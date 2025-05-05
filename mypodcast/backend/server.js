
require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const multer = require('multer');
const { PassThrough } = require('stream');
const mp3Duration = require('mp3-duration'); // Added to compute MP3 duration
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fetch = require('node-fetch');

const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Create thumbnails directory if it doesn't exist
const thumbnailsDir = path.join(__dirname, 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir);
}


// ---------------- MongoDB Connection ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

let gridFSBucket;
let avatarFSBucket;
mongoose.connection.once("open", () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "ttsFiles"
  });
  avatarFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'avatarFiles'
  });
});


// ---------------- User Schema and Model ----------------
const userSchema = new mongoose.Schema({
  displayName: String,
  email: { type: String, unique: true },
  password: String, // hashed password; for OAuth users this can be empty
  googleId: { type: String, default: null },
  totalPrompts: { type: Number, default: 0 }, // count of podcasts generated
  totalDuration: { type: Number, default: 0 },
  resetToken: String,
  resetTokenExpiry: Date,
  profilePicture: String,
                                                   // total duration (in seconds) of all podcasts generated
});
const User = mongoose.model('User', userSchema);

// ---------------- Chat Schema and Model ----------------
const chatSchema = new mongoose.Schema({
  chatId: { type: String, unique: true, required: true },
  title: { type: String, default: '' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});
const Chat = mongoose.model('Chat', chatSchema);

// ShareLink Schema and Model
const shareLinkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resourceId: { type: String, required: true }, // Could be chatId or audio fileId
  resourceType: { type: String, enum: ['audio', 'chat','avatar'], required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  lastAccessed: { type: Date }
});

const ShareLink = mongoose.model('ShareLink', shareLinkSchema);

// ---------------- JWT Secret ----------------
const JWT_SECRET = process.env.JWT_SECRET || 'Secret_KEY_24765234500786231';

// ---------------- Helper Middleware ----------------
// Checks for token in req.body.token or Authorization header.
const verifyToken = (req, res, next) => {
  let token = req.body.token || req.query.token || null;
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }
  // console.log("Token received:", token);
  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info (id, email) to the request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Optional token middleware
const optionalVerifyToken = (req, res, next) => {
  let token = req.body.token || req.query.token || null;
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }

  if (!token) {
    // No token -> proceed as a "public" request
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info
    return next();
  } catch (error) {
    // Invalid token -> treat as no token
    req.user = null;
    return next();
  }
};

// Helper function to verify share tokens
const verifyShareToken = async (req, res, next) => {
  const shareToken = req.query.shareToken;
  if (!shareToken) {
    return res.status(401).json({ error: "Share token required" });
  }
  
  try {
    // First verify the JWT
    const decoded = jwt.verify(shareToken, JWT_SECRET);
    
    // Then check if the token exists in the database
    const shareLink = await ShareLink.findOne({ token: shareToken });
    
    if (!shareLink) {
      return res.status(403).json({ error: "Invalid share token" });
    }
    
    // Check if expired
    if (new Date() > shareLink.expiresAt) {
      // Delete the expired link
      await ShareLink.findByIdAndDelete(shareLink._id);
      return res.status(403).json({ error: "Share link has expired" });
    }
    
    // Update last accessed time
    shareLink.lastAccessed = new Date();
    await shareLink.save();
    
    // Add token data to request
    req.shareData = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired share token" });
  }
};


// ---------------- Multer Setup ----------------
const upload = multer();

// ---------- User Registration ----------
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      displayName: username,
      email,
      password: hashedPassword,
      totalPrompts: 0,
      totalDuration: 0,
      profilePicture: null // Explicitly setting default profile picture
    });
    await user.save();
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        profilePicture: user.profilePicture 
      }, 
      JWT_SECRET, 
      { expiresIn: '4h' }
    );

    return res.status(201).json({ token, profilePicture: user.profilePicture });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---------- User Login ----------
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        profilePicture: user.profilePicture 
      }, 
      JWT_SECRET, 
      { expiresIn: '4h' }
    );

    return res.json({ token, profilePicture: user.profilePicture });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---------- Google OAuth Sign-In ----------
app.post('/api/google-signin', async (req, res) => {
  const { idToken } = req.body;
  try {
    // Verify the ID token with Google
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    // Ensure the token was issued for your application
    if (response.data.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const { email, name, sub, picture } = response.data; // 'sub' is the Google user id
    // Process Google profile picture URL to ensure it works cross-origin
    // Remove size restrictions and use a format that allows cross-origin loading
    const profilePicture = picture ? picture.replace(/=s\d+-c/, '=s400-c-mo') : null;


    // Look up the user by email or googleId
    let user = await User.findOne({ $or: [{ email }, { googleId: sub }] });
    if (!user) {
      // Create a new user if not found (no password required for OAuth users)
      user = new User({
        displayName: name,
        email,
        password: "", // blank password for OAuth users
        googleId: sub,
        totalPrompts: 0,
        totalDuration: 0,
        profilePicture // Store the modified profile picture URL
      });
      await user.save();
    } else if (!user.googleId) {
      // If the user exists (from email/password) but doesn't have googleId, update the record
      user.googleId = sub;
      user.profilePicture = profilePicture;
      await user.save();
    }else {
      // Update profile picture if user already exists with googleId
      if (profilePicture && profilePicture !== user.profilePicture) {
        user.profilePicture = profilePicture;
        await user.save();
      }
    }

    // Generate your app's JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        displayName: user.displayName
        // profilePicture removed from token
      }, 
      JWT_SECRET, 
      { expiresIn: '4h' }
    );

    return res.json({ 
      token, 
      profilePicture: user.profilePicture,
      user: {
        displayName: user.displayName,
        email: user.email,
        id: user._id
      }
    });

  } catch (error) {
    console.error("Google sign in error:", error.response ? error.response.data : error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ---------- Retrieve User Profile ----------
app.post('/api/profile', verifyToken, async (req, res) => {
  try {
    // The user profile now includes totalDuration along with totalPrompts
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User profile not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// ---------- Update User Profile ----------
app.post('/api/update-profile', verifyToken, async (req, res) => {
  const { displayName, email } = req.body;
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.displayName = displayName || user.displayName;
    user.email = email || user.email;
    await user.save();
    return res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD.replace(/\s+/g, '') 
  }
});
transporter.verify(function(error, success) {
  if (error) {
    console.log("Transporter verification error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// ---------- Update Password ----------
app.post('/api/update-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current password and new password are required" });
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.password) {
      return res.status(404).json({ error: "User not found or not applicable for OAuth users" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// // ---------- Generate Share Token Endpoint ----------
// // POST /api/share-token
// // Request body: { type: 'audio' | 'chat', id: '<id>', duration: <number|string> }
// // For "permanent", duration should be "permanent". Otherwise, a number (in hours) is expected.
// app.post('/api/share-token', verifyToken, async (req, res) => {
//   try {
//     let { type, id, duration } = req.body;
//     if (!['audio', 'chat'].includes(type)) {
//       return res.status(400).json({ error: "Invalid share type" });
//     }
//     if (!id) {
//       return res.status(400).json({ error: "ID is required" });
//     }
    
//     // Ensure the id is a string.
//     id = String(id);
    
//     let expiresIn;
//     if (duration === "permanent") {
//       expiresIn = '876000h'; // Approximately 100 years
//     } else {
//       // Convert duration to a number if necessary
//       duration = Number(duration);
//       if (isNaN(duration)) {
//         return res.status(400).json({ error: "Invalid duration format" });
//       }
//       expiresIn = `${duration}h`;
//     }
//     const shareToken = jwt.sign({ type, id }, JWT_SECRET, { expiresIn });
//     return res.json({ shareToken });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

app.post('/api/share-token', verifyToken, async (req, res) => {
      try {
        console.log("Processing share token request:", req.body);
        let { type, id, duration } = req.body;
        
        // Validate share type
        if (!['audio', 'chat', 'avatar'].includes(type)) {
          console.log("400 - Invalid Type:", type);
          return res.status(400).json({ error: "Invalid share type" });
        }
        
        // Validate ID
        if (!id) {
          console.log("400 - ID Required");
          return res.status(400).json({ error: "ID is required" });
        }
        
        console.log(`Processing ${type} share for ID: ${id}`);
        
        // Type-specific validation
        if (type === 'avatar') {
          const ObjectId = mongoose.Types.ObjectId;
    let avatarId;
    
    try {
      avatarId = new ObjectId(id);
    } catch (err) {
      console.log("400 - Invalid avatar ID format");
      return res.status(400).json({ error: "Invalid avatar ID format" });
    }
    
    try {
      // Query the GridFS collection
      const avatarFile = await mongoose.connection.db
        .collection('avatarFiles.files')
        .findOne({ _id: avatarId });
    
      if (!avatarFile) {
        console.log("404 - Avatar file not found with ID:", id);
        return res.status(404).json({ error: "Avatar not found" });
      }
    
      console.log("Avatar found:", avatarFile._id, "User ID:", req.user.id);
    
      // Check if metadata exists and contains userId
      if (!avatarFile.metadata || !avatarFile.metadata.userId) {
        console.log("500 - Avatar metadata missing userId");
        return res.status(500).json({ error: "Avatar metadata is corrupted or missing" });
      }
    
      const avatarUserId = avatarFile.metadata.userId.toString();
    
      // Compare user IDs
      if (avatarUserId !== req.user.id) {
        console.log("403 - Permission Error. User:", req.user.id, "Avatar owner:", avatarUserId);
        return res.status(403).json({ error: "You don't have permission to share this avatar" });
      }
    
      console.log("Avatar permission check passed");
    } catch (avatarError) {
      console.error("Error in avatar validation:", avatarError);
      return res.status(500).json({ error: "Error validating avatar", details: avatarError.message });
    }
    
        }
    // Ensure the id is a string.
    id = String(id);
    
    let expiresIn;
    let expiresAt;
    const now = new Date();
    
    if (duration === "permanent") {
      expiresIn = '876000h'; // Approximately 100 years
      expiresAt = new Date(now.getTime() + (876000 * 60 * 60 * 1000));
    } else {
      // Convert duration to a number if necessary
      duration = Number(duration);
      if (isNaN(duration)) {
        console.log("400 - Invalid duration format:", duration);
        return res.status(400).json({ error: "Invalid duration format" });
      }
      expiresIn = `${duration}h`;
      expiresAt = new Date(now.getTime() + (duration * 60 * 60 * 1000));
    }
    
    console.log("Creating JWT token");
    const shareToken = jwt.sign({ type, id }, JWT_SECRET, { expiresIn });
    
    // Save the share link in the database
    const shareLink = new ShareLink({
      userId: req.user.id,
      resourceId: id,
      resourceType: type,
      token: shareToken,
      expiresAt: expiresAt
    });
    
    await shareLink.save();
    
    // Generate the full share URL based on type
    let shareUrl;
    if (type === 'audio') {
      shareUrl = `${process.env.BASE_URL || 'http://localhost:5173'}/public-audio/${id}?shareToken=${shareToken}`;
    } else if (type === 'avatar') {
      shareUrl = `${process.env.BASE_URL || 'http://localhost:5173'}/public-avatar/${id}?shareToken=${shareToken}`;
    } else {
      shareUrl = `${process.env.BASE_URL || 'http://localhost:5173'}/share/${id}?shareToken=${shareToken}`;
    }
    console.log("Generated share URL:", shareUrl);
    return res.json({ shareToken, shareUrl });
  } catch (error) {
    console.error("Error in share-token route:", error);
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/shared-links - Retrieve all share links for the logged-in user
app.get('/api/shared-links', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const shareLinks = await ShareLink.find({ userId }).sort({ createdAt: -1 });
    const now = new Date();
    await ShareLink.deleteMany({ 
      userId: req.user.id,
      expiresAt: { $lt: now } 
    });
    const enrichedLinks = await Promise.all(shareLinks.map(async (link) => {
      let resourceName = '';
      let resourceDetails = {};
      
      // Get detailed info based on resource type
      if (link.resourceType === 'chat') {
        const chat = await Chat.findOne({ chatId: link.resourceId });
        resourceName = chat ? (chat.title || `Chat from ${new Date(chat.createdAt).toLocaleDateString()}`) : 'Unknown Chat';
      } else if (link.resourceType === 'audio') {
        const fileId = new mongoose.Types.ObjectId(link.resourceId);
        const fileInfo = await mongoose.connection.db
          .collection("ttsFiles.files")
          .findOne({ _id: fileId });
        
        resourceName = fileInfo ? 
          (fileInfo.metadata?.requestedText?.substring(0, 30) + '...' || 'Audio file') : 
          'Unknown Audio';
        
        if (fileInfo) {
          resourceDetails = {
            duration: fileInfo.metadata?.duration || 0,
            createdAt: fileInfo.uploadDate
          };
        }
      }
      
      // Generate the full share URL
      let shareUrl;
      if (link.resourceType === 'audio') {
        shareUrl = `${process.env.BASE_URL || 'http://localhost:5173'}/public-audio/${link.resourceId}?shareToken=${link.token}`;
      } else {
        shareUrl = `${process.env.BASE_URL || 'http://localhost:5173'}/share/${link.resourceId}?shareToken=${link.token}`;
      }
      
      // Check if link is expired
      const isExpired = new Date() > link.expiresAt;
      
            // Calculate time remaining
      const timeRemaining = Math.max(0, link.expiresAt - now);
      const secondsRemaining = Math.floor(timeRemaining / 1000);
      const minutesRemaining = Math.floor(secondsRemaining / 60);
      const hoursRemaining = Math.floor(minutesRemaining / 60);
      const daysRemaining = Math.floor(hoursRemaining / 24);
      
      // Format remaining time for display
      let expiryDisplay = '';
      if (timeRemaining <= 0) {
        expiryDisplay = 'Expired';
      } else if (daysRemaining > 0) {
        expiryDisplay = `${daysRemaining}d ${hoursRemaining % 24}h remaining`;
      } else if (hoursRemaining > 0) {
        expiryDisplay = `${hoursRemaining}h ${minutesRemaining % 60}m remaining`;
      } else {
        expiryDisplay = `${minutesRemaining}m ${secondsRemaining % 60}s remaining`;
      }

      return {
        ...link.toObject(),
        resourceName,
        resourceDetails,
        shareUrl,
        isExpired: timeRemaining <= 0,
        expiryTimestamp: link.expiresAt.getTime(), // Send timestamp for client-side calculations
        expiryDisplay
      };
    }));
    
    return res.json({ shareLinks: enrichedLinks });
  } catch (error) {
    console.error("Error retrieving shared links:", error);
    return res.status(500).json({ error: "Failed to retrieve shared links" });
  }
});

app.delete('/api/shared-links/:id', verifyToken, async (req, res) => {
  try {
    const shareLink = await ShareLink.findById(req.params.id);
    
    if (!shareLink) {
      return res.status(404).json({ error: "Share link not found" });
    }
    
    if (shareLink.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized - not your share link" });
    }
    
    await ShareLink.findByIdAndDelete(req.params.id);
    
    return res.json({ message: "Share link revoked successfully" });
  } catch (error) {
    console.error("Error revoking share link:", error);
    return res.status(500).json({ error: "Failed to revoke share link" });
  }
});

// ---------- TTS-Audio Route ----------
// Receives an audio file from the frontend and stores it in GridFS.
// It dynamically computes the audio duration from the file buffer and updates totalPrompts and totalDuration.
app.post('/tts-audio', verifyToken, upload.single("audio"), async (req, res) => {
  try {
    if (!gridFSBucket) {
      return res.status(500).json({ error: "GridFSBucket not initialized" });
    }

    // Get duration from the frontend if provided (more reliable)
    let duration = req.body.duration ? parseFloat(req.body.duration) : null;

    // If duration wasn't provided by frontend, compute it from the buffer
    if (duration === null) {
      duration = await new Promise((resolve, reject) => {
        mp3Duration(req.file.buffer, (err, duration) => {
          if (err) return reject(err);
          resolve(duration);
        });
      });

      // Apply correction factor if needed (based on your 100s vs 61.5s example)
      // This is a fallback in case frontend duration isn't provided
      const correctionFactor = 1.625; // Approximate factor based on your example
      duration = duration * correctionFactor;
    }

    console.log(`Audio duration: ${duration} seconds`);

    // Increment totalPrompts and add the computed duration to totalDuration
    await User.findByIdAndUpdate(
      req.user.id, 
      { $inc: { totalPrompts: 1, totalDuration: duration } }, 
      { new: true }
    );
    
    const filename = "tts_" + Date.now() + ".mp3";
    const uploadStream = gridFSBucket.openUploadStream(filename, {
      metadata: {
        userId: req.user.id,
        chatId: req.body.chatId || null,  // Store chatId in metadata
        type: "tts",
        requestedText: req.body.text || "",
        duration: duration, // Store computed duration in metadata
        timestamp: new Date(),
        speaker1: req.body.speaker1Name || null,
        speaker2: req.body.speaker2Name || null

      }
    });

    uploadStream.on("finish", () => {
      return res.json({ 
        message: "File stored successfully", 
        fileId: uploadStream.id,
        duration: duration
      });
    });

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("Error in /tts-audio route:", error);
    res.status(500).json({ error: "Failed to store audio file" });
  }
});
// ---------- TTS History Route ----------
// Returns a JSON array of TTS audio files stored in GridFS for the logged-in user,
// including the requestedText and duration from the file's metadata.
app.get('/api/tts-history', verifyToken, async (req, res) => {
  try {
    const files = await mongoose.connection.db
      .collection("ttsFiles.files")
      .find({ "metadata.userId": req.user.id })
      .toArray();

    const history = files.map(file => ({
      _id: file._id,
      uploadDate: file.uploadDate,
      filename: file.filename,
      requestedText: file.metadata?.requestedText || "",
      duration: file.metadata?.duration || 0,
      speaker1: file.metadata?.speaker1 || null,
      speaker2: file.metadata?.speaker2 || null

    }));

    return res.json({ history });
  } catch (error) {
    console.error("Error retrieving tts history:", error);
    return res.status(500).json({ error: "Failed to retrieve history" });
  }
});

// ---------- Audio Streaming Route ----------
// Streams a TTS audio file from GridFS based on the file ID provided in the URL.
// Retains the original range support implementation.
app.get('/api/tts-audio/:id', optionalVerifyToken, async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const filesCollection = mongoose.connection.db.collection("ttsFiles.files");
    const fileInfo = await filesCollection.findOne({ _id: fileId });
    if (!fileInfo) {
      return res.status(404).json({ error: "File not found" });
    }

    // If the request has a valid logged-in user
    if (req.user) {
      // Make sure the file belongs to that user
      if (fileInfo.metadata.userId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized - not your audio" });
      }
      // If it belongs to them, proceed with streaming...
    } else {
      // No token => check if the chat is "shared" publicly
      const chatId = fileInfo.metadata.chatId;
      const chat = await Chat.findOne({ chatId });
      if (!chat) {
        // Not a valid chat => block
        return res.status(403).json({ error: "Audio not publicly accessible" });
      }
      // If chat exists, we allow streaming because user got the share link
      // (Optionally, you could add a chat.isPublic field to confirm it's truly shared)
    }

    // -- Range / streaming logic remains the same below --
    const fileSize = fileInfo.length;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      if (start >= fileSize) {
        res
          .status(416)
          .send(`Requested range not satisfiable\n${start} >= ${fileSize}`);
        return;
      }
      const chunksize = end - start + 1;
      res.status(206).set({
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "audio/mp3",
      });
      const downloadStream = gridFSBucket.openDownloadStream(fileId, {
        start,
        end: end + 1,
      });
      downloadStream.on("error", (err) => {
        console.error("Download stream error:", err);
        res.status(404).json({ error: "File not found" });
      });
      downloadStream.pipe(res);
    } else {
      res.set({
        "Content-Length": fileSize,
        "Content-Type": "audio/mp3",
      });
      const downloadStream = gridFSBucket.openDownloadStream(fileId);
      downloadStream.on("error", (err) => {
        console.error("Download stream error:", err);
        res.status(404).json({ error: "File not found" });
      });
      downloadStream.pipe(res);
    }
  } catch (err) {
    console.error("Error streaming audio:", err);
    res.status(500).json({ error: "Error streaming audio file" });
  }
});

// ---------- Audio Streaming Route for Shared Audio ----------
// GET /public-audio/:id - Streams an audio file for sharing, using a share token.
app.get('/public-audio/:id', verifyShareToken, async (req, res) => {
  try {
    const shareToken = req.query.shareToken;
    if (!shareToken) {
      return res.status(401).json({ error: "Share token required" });
    }
    let decoded;
    try {
      decoded = jwt.verify(shareToken, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: "Invalid or expired share token" });
    }
    
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const filesCollection = mongoose.connection.db.collection("ttsFiles.files");
    const fileInfo = await filesCollection.findOne({ _id: fileId });
    if (!fileInfo) {
      return res.status(404).json({ error: "File not found" });
    }
    
    // Allow if:
    // (a) Token type is 'audio' and its id matches the file id, OR
    // (b) Token type is 'chat' and the file's metadata.chatId matches the token id.
    if (decoded.type === 'audio') {
      if (decoded.id !== fileId.toString()) {
        return res.status(403).json({ error: "Invalid share token for this audio" });
      }
    } else if (decoded.type === 'chat') {
      if (fileInfo.metadata.chatId !== decoded.id) {
        return res.status(403).json({ error: "Invalid share token for this audio" });
      }
    } else {
      return res.status(403).json({ error: "Invalid share token type" });
    }
    
    const fileSize = fileInfo.length;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      if (start >= fileSize) {
        res.status(416).send(`Requested range not satisfiable\n${start} >= ${fileSize}`);
        return;
      }
      const chunksize = end - start + 1;
      res.status(206).set({
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "audio/mp3"
      });
      const downloadStream = gridFSBucket.openDownloadStream(fileId, { start, end: end + 1 });
      downloadStream.on("error", (err) => {
        console.error("Download stream error:", err);
        res.status(404).json({ error: "File not found" });
      });
      downloadStream.pipe(res);
    } else {
      res.set({
        "Content-Length": fileSize,
        "Content-Type": "audio/mp3"
      });
      const downloadStream = gridFSBucket.openDownloadStream(fileId);
      downloadStream.on("error", (err) => {
        console.error("Download stream error:", err);
        res.status(404).json({ error: "File not found" });
      });
      downloadStream.pipe(res);
    }
  } catch (err) {
    console.error("Error streaming public audio:", err);
    res.status(500).json({ error: "Error streaming audio file" });
  }
});




// ---------- Chat Endpoints ----------

// GET /api/chats - Retrieve all chats for the logged-in user
app.get('/api/chats', verifyToken, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id });
    return res.json(chats);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/chats/:chatId/audio - Retrieve chat-specific TTS audio history
app.get('/api/chats/:chatId/audio', verifyToken, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    // Verify that the chat exists and that the user is a participant.
    const chat = await Chat.findOne({ chatId, participants: req.user.id });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found or unauthorized" });
    }
    const files = await mongoose.connection.db.collection("ttsFiles.files")
      .find({ "metadata.chatId": chatId, "metadata.userId": req.user.id })
      .toArray();

    const history = files.map(file => ({
      _id: file._id,
      uploadDate: file.uploadDate,
      filename: file.filename,
      requestedText: file.metadata?.requestedText || "",
      duration: file.metadata?.duration || 0,
      speaker1: file.metadata?.speaker1 || null,  // Add this
      speaker2: file.metadata?.speaker2 || null  
    }));

    return res.json({ history });
  } catch (error) {
    console.error("Error retrieving chat audio history:", error);
    return res.status(500).json({ error: "Failed to retrieve chat audio history" });
  }
});

// POST /api/chats/new - Create a new chat session
app.post('/api/chats/new', verifyToken, async (req, res) => {
  try {
    // Generate a unique chatId (e.g., using current timestamp and a random string)
    const chatId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newChat = new Chat({
      chatId,
      participants: [req.user.id]
    });
    await newChat.save();
    return res.status(201).json({ chat: newChat });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/chats/:chatId - Update chat title
app.put('/api/chats/:chatId', verifyToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    // Make sure the chat exists and user is a participant
    const chat = await Chat.findOne({ chatId, participants: req.user.id });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found or unauthorized" });
    }

    // Update the title if provided
    if (typeof title === 'string' && title.trim().length > 0) {
      chat.title = title.trim();
    }
    await chat.save();

    return res.json({ chat });
  } catch (error) {
    console.error("Error updating chat title:", error);
    return res.status(500).json({ error: "Failed to update chat title" });
  }
});



// ---------- Updated Share Chat Route with Share Token ----------
// GET /share/:chatId - Retrieve chat details and audio history for sharing,
// requiring a valid share token provided via query string.
app.get('/share/:chatId', verifyShareToken, async (req, res) => {
  try {
    // Verify share token: Expect it to be provided as ?shareToken=...
    const shareToken = req.query.shareToken;
    if (!shareToken) {
      return res.status(401).json({ error: "Share token required" });
    }
    let decoded;
    try {
      decoded = jwt.verify(shareToken, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: "Invalid or expired share token" });
    }
    if (decoded.type !== 'chat' || decoded.id !== req.params.chatId) {
      return res.status(403).json({ error: "Invalid share token for this chat" });
    }
    
    // Retrieve the chat
    const chat = await Chat.findOne({ chatId: req.params.chatId });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Retrieve audio files associated with this chat
    const files = await mongoose.connection.db
      .collection("ttsFiles.files")
      .find({ "metadata.chatId": req.params.chatId })
      .toArray();

    const conversation = files.map(file => ({
      _id: file._id,
      query: file.metadata.requestedText || "",
      // Include the share token in the URL so that subsequent audio requests are validated.
      audio: `http://localhost:5257/public-audio/${file._id}?shareToken=${shareToken}`,
      uploadDate: file.uploadDate
    }));

    conversation.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));

    return res.json({ chat: { ...chat.toObject(), conversation } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---------- Share Audio Page Endpoint ----------
// ---------- Share Audio Page Endpoint ----------
// GET /share-audio/:id - Returns JSON with audio data for the shared audio
app.get('/share-audio/:id', verifyShareToken, async (req, res) => {
  try {
    const shareToken = req.query.shareToken;
    if (!shareToken) {
      return res.status(401).json({ error: "Share token required" });
    }
    
    let decoded;
    try {
      decoded = jwt.verify(shareToken, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: "Invalid or expired share token" });
    }
    
    // Allow tokens of type 'audio' or tokens of type 'chat' (if using chat share)
    if (decoded.type !== 'audio' && decoded.type !== 'chat') {
      return res.status(403).json({ error: "Invalid share token type" });
    }

    // Update last accessed time
    await ShareLink.findOneAndUpdate(
      { token: shareToken },
      { lastAccessed: new Date() }
    );
    
    // Get audio file info
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const fileInfo = await mongoose.connection.db
      .collection("ttsFiles.files")
      .findOne({ _id: fileId });
    
    if (!fileInfo) {
      return res.status(404).json({ error: "Audio file not found" });
    }
    
    // Build the public audio URL that streams the file
    const audioUrl = `${process.env.BASE_URL || 'http://localhost:5173'}/public-audio/${req.params.id}?shareToken=${shareToken}`;
    
    // Return JSON data that frontend can use
    return res.json({
      audioData: {
        _id: fileInfo._id,
        filename: fileInfo.filename,
        uploadDate: fileInfo.uploadDate,
        requestedText: fileInfo.metadata?.requestedText || "",
        duration: fileInfo.metadata?.duration || 0,
        audioUrl: audioUrl
      }
    });
    
  } catch (err) {
    console.error("Error retrieving shared audio data:", err);
    res.status(500).json({ error: "Error retrieving audio data" });
  }
});


// ---------- Delete Chat Route ----------
// DELETE /api/chats/:chatId - Delete a chat session
app.delete('/api/chats/:chatId', verifyToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findOne({ chatId, participants: req.user.id });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found or unauthorized" });
    }
    await Chat.deleteOne({ chatId, participants: req.user.id });
    return res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Cleanup function to delete expired share links
async function cleanupExpiredShareLinks() {
  try {
    const now = new Date();
    const result = await ShareLink.deleteMany({ expiresAt: { $lt: now } });
    console.log(`Cleaned up ${result.deletedCount} expired share links`);
  } catch (error) {
    console.error('Error cleaning up expired share links:', error);
  }
}
// Run cleanup job every hour
setInterval(cleanupExpiredShareLinks, 60 * 60 * 1000);

// Also run once at server startup
cleanupExpiredShareLinks();

app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ message: 'If your email is registered, a reset link will be sent.' });
    }
    
    // Generate reset token and expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    
    // Save token to database
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    
    // Create reset URL
    const resetUrl = `${process.env.APP_URL}/reset-password/${resetToken}`;
    
    // Send email
    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset for your account.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
      `
    });
    
    res.status(200).json({ message: 'If your email is registered, a reset link will be sent.' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Verify reset token
app.get('/api/reset-password/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find user with this token and valid expiry
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ valid: false });
    }
    
    res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Failed to verify token' });
  }
});
app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Find user with this token and valid expiry
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    // Update password and clear reset token
    user.password = await bcrypt.hash(newPassword, 10); // Assuming you use bcrypt
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    // You could send a confirmation email here if you want
    
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});




// ---------------- AI Avatar Video Routes ----------------

// Set up multer storage for avatar videos
const avatarUpload = multer().single('video');

// POST /api/avatar-video - Upload a new AI avatar video
app.post('/api/avatar-video', verifyToken, avatarUpload, async (req, res) => {
  try {
    if (!avatarFSBucket) {
      return res.status(500).json({ error: "avatarFSBucket not initialized" });
    }

    const videoFile = req.file;
    
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title (user script) is required" });
    }

    // Generate a unique identifier for this avatar
    const avatarId = new mongoose.Types.ObjectId();
    const videoFilename = `avatar_video_${avatarId}_${Date.now()}.mp4`;
    
    // Upload video to GridFS
    const videoUploadStream = avatarFSBucket.openUploadStream(videoFilename, {
      metadata: {
        userId: req.user.id,
        type: "avatar",
        title: title,
        timestamp: new Date(),
        avatarId: avatarId
      }
    });

    // Create a promise for video upload
    const videoUploadPromise = new Promise((resolve, reject) => {
      videoUploadStream.on("finish", function() {
        resolve(videoUploadStream.id);
      });
      
      videoUploadStream.on("error", reject);
    });
    
    // Start video upload
    videoUploadStream.end(videoFile.buffer);
    
    // Wait for video upload to complete
    const videoId = await videoUploadPromise;
    
    return res.json({ 
      message: "Avatar video stored successfully", 
      fileId: avatarId.toString(),
      videoFileId: videoId.toString(),
      title: title,
      createdAt: new Date()
    });
    
  } catch (error) {
    console.error("Error in /api/avatar-video route:", error);
    res.status(500).json({ error: "Failed to store avatar video file" });
  }
});

// GET /api/avatar-videos - Return list of user's avatar videos
app.get('/api/avatar-videos', verifyToken, async (req, res) => {
  try {
    const files = await mongoose.connection.db
      .collection("avatarFiles.files")
      .find({ 
        "metadata.userId": req.user.id,
        "metadata.type": "avatar"
      })
      .toArray();

    const videos = files.map(file => ({
      _id: file._id,
      avatarId: file.metadata.avatarId,
      createdAt: file.uploadDate,
      title: file.metadata?.title || "Untitled Avatar"
    }));

    return res.json({ videos });
  } catch (error) {
    console.error("Error retrieving avatar videos:", error);
    return res.status(500).json({ error: "Failed to retrieve avatar videos" });
  }
});

// GET /api/avatar-video/:id - Stream a specific avatar video
app.get('/api/avatar-video/:id', verifyToken, async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const filesCollection = mongoose.connection.db.collection("avatarFiles.files");
    const fileInfo = await filesCollection.findOne({ _id: fileId });
    
    if (!fileInfo) {
      return res.status(404).json({ error: "File not found" });
    }

    // Check if the user owns the video
    if (fileInfo.metadata.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized - not your avatar video" });
    }

    // Handle range requests for video streaming
    const fileSize = fileInfo.length;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
      if (start >= fileSize) {
        res
          .status(416)
          .send(`Requested range not satisfiable\n${start} >= ${fileSize}`);
        return;
      }
      
      const chunksize = end - start + 1;
      res.status(206).set({
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      });
      
      const downloadStream = avatarFSBucket.openDownloadStream(fileId, {
        start,
        end: end + 1,
      });
      
      downloadStream.on("error", (err) => {
        console.error("Download stream error:", err);
        res.status(404).json({ error: "File not found" });
      });
      
      downloadStream.pipe(res);
    } else {
      res.set({
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      });
      
      const downloadStream = avatarFSBucket.openDownloadStream(fileId);
      
      downloadStream.on("error", (err) => {
        console.error("Download stream error:", err);
        res.status(404).json({ error: "File not found" });
      });
      
      downloadStream.pipe(res);
    }
  } catch (err) {
    console.error("Error streaming avatar video:", err);
    res.status(500).json({ error: "Error streaming video file" });
  }
});

// PUT /api/avatar-video/:id - Update an avatar video's title
app.put('/api/avatar-video/:id', verifyToken, async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    
    const filesCollection = mongoose.connection.db.collection("avatarFiles.files");
    const fileInfo = await filesCollection.findOne({ _id: fileId });
    
    if (!fileInfo) {
      return res.status(404).json({ error: "File not found" });
    }
    
    // Ensure the user owns this video
    if (fileInfo.metadata.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized - not your avatar video" });
    }
    
    // Update the title in metadata
    await filesCollection.updateOne(
      { _id: fileId },
      { $set: { "metadata.title": title } }
    );
    
    return res.json({
      message: "Avatar video updated successfully",
      _id: fileId.toString(),
      title: title
    });
  } catch (error) {
    console.error("Error updating avatar video:", error);
    return res.status(500).json({ error: "Failed to update avatar video" });
  }
});

// DELETE /api/avatar-video/:id - Delete an avatar video
app.delete('/api/avatar-video/:id', verifyToken, async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const filesCollection = mongoose.connection.db.collection("avatarFiles.files");
    const fileInfo = await filesCollection.findOne({ _id: fileId });
    
    if (!fileInfo) {
      return res.status(404).json({ error: "File not found" });
    }
    
    // Ensure the user owns this video
    if (fileInfo.metadata.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized - not your avatar video" });
    }
    
    // Delete the video
    await avatarFSBucket.delete(fileId);
    
    return res.json({ 
      message: "Avatar video deleted successfully",
      deletedVideo: fileId.toString()
    });
  } catch (error) {
    console.error("Error deleting avatar video:", error);
    return res.status(500).json({ error: "Failed to delete avatar video" });
  }
});

// Proxy route for handling CORS issues with videos
app.get('/api/proxy-video', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).send('Missing video URL');
  }
  
  try {
    const response = await fetch(videoUrl);
    if (!response.ok) {
      return res.status(response.status).send('Error fetching video');
    }
    
    // Set headers based on the response from S3
    res.set('Content-Type', response.headers.get('content-type'));
    
    response.body.pipe(res);
  } catch (error) {
    console.error('Error in proxy:', error);
    res.status(500).send('Server error');
  }
});

//share route for avatar
// Public route to view a shared avatar
app.get('/api/public-avatar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { shareToken } = req.query;
    
    if (!shareToken) {
      return res.status(401).json({ error: "Share token is required" });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(shareToken, JWT_SECRET);
      
      // Check if token is for this specific avatar and type
      if (decoded.type !== 'avatar' || decoded.id !== id) {
        return res.status(403).json({ error: "Invalid share token for this avatar" });
      }
      
      let avatarId;
      try {
        avatarId = new mongoose.Types.ObjectId(id);
      } catch (err) {
        return res.status(400).json({ error: "Invalid avatar ID format" });
      }

      // Find the avatar
      const avatar = await mongoose.connection.db
      .collection('avatarFiles.files')
      .findOne({ _id: avatarId });
      if (!avatar) {
        return res.status(404).json({ error: "Avatar not found" });
      }
      
      // Optional: Track view analytics
      await ShareLink.findOneAndUpdate(
        { token: shareToken },
        { $inc: { viewCount: 1 } },
        { new: true }
      );
      
      // Return avatar data (excluding sensitive fields)
      const safeAvatarData = {
        _id: avatar._id,
        name: avatar.name,
        description: avatar.description,
        videoUrl: avatar.videoUrl,
        thumbnailUrl: avatar.thumbnailUrl,
        createdAt: avatar.createdAt,
        // Include other non-sensitive fields as needed
      };
      
      return res.json({ avatar: safeAvatarData });
    } catch (err) {
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: "Invalid or expired share token" });
      }
      throw err;
    }
  } catch (error) {
    console.error("Error accessing shared avatar:", error);
    return res.status(500).json({ error: "Failed to access shared avatar" });
  }
});

// Route to stream avatar video for public sharing from GridFS
app.get('/api/public-avatar/:id/video', async (req, res) => {
  try {
    const { id } = req.params;
    const { shareToken } = req.query;

    if (!shareToken) {
      return res.status(401).json({ error: "Share token is required" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(shareToken, JWT_SECRET);

      if (decoded.type !== 'avatar' || decoded.id !== id) {
        return res.status(403).json({ error: "Invalid share token for this avatar" });
      }

      let avatarId;
      try {
        avatarId = new mongoose.Types.ObjectId(id);
      } catch (err) {
        return res.status(400).json({ error: "Invalid avatar ID format" });
      }

      const db = mongoose.connection.db;
      const bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'avatarFiles'
      });

      // Find avatar file by ID
      const avatarFile = await db.collection('avatarFiles.files').findOne({ _id: avatarId });

      if (!avatarFile) {
        return res.status(404).json({ error: "Avatar not found in GridFS" });
      }

      // Stream the avatar file (assumed to be the video file itself)
      const fileSize = avatarFile.length;
      const range = req.headers.range;

      res.set('Content-Type', avatarFile.contentType || 'video/mp4');
      res.set('Accept-Ranges', 'bytes');

      let downloadStream;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;

        res.set({
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Content-Length': chunkSize,
        });
        res.status(206);

        downloadStream = bucket.openDownloadStream(avatarFile._id, {
          start: start,
          end: end + 1
        });
      } else {
        res.set('Content-Length', fileSize);
        res.status(200);
        downloadStream = bucket.openDownloadStream(avatarFile._id);
      }

      downloadStream.pipe(res);

      downloadStream.on('error', (err) => {
        console.error('Error streaming GridFS file:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming video file" });
        }
      });

    } catch (err) {
      if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: "Invalid or expired share token" });
      }
      throw err;
    }
  } catch (error) {
    console.error("Error streaming avatar video:", error);
    return res.status(500).json({ error: "Failed to stream Avatar video" });
  }
});


const PORT = process.env.PORT || 5257;
app.listen(PORT, () => console.log(`Server running on port no ${PORT}`));



