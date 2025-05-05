// firebase-admin.js
const admin = require('firebase-admin');
const serviceAccount = require('D:/serviceAccountKey.json'); // Replace with the path to your service account key JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
