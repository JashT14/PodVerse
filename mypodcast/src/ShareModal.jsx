import  { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Share2, Copy, Check, Clock, MessageCircle, Twitter, Facebook } from "lucide-react";
import "./ShareModal.css";

//Define backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5257";
//Define frontend URL
const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";

const ShareModal = ({ type, id, onClose }) => {
  const [shareLink, setShareLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const token = localStorage.getItem("token");

  const generateShareLink = async (duration) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/share-token`,
        { type, id, duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // const { shareToken } = res.data;
      // let link = "";
      const { shareUrl } = res.data;
      setShareLink(shareUrl);
      // if (type === "audio") {
      //   link = `${frontendUrl}/public-audio/${id}?shareToken=${shareToken}`;
      // } else if (type === "chat") {
      //   link = `${frontendUrl}/share/${id}?shareToken=${shareToken}`;
      // } else if (type === "avatar") {
      //   link = `${frontendUrl}/public-avatar/${id}?shareToken=${shareToken}`;
      // } 
      
      // Automatically copy the link to the clipboard
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Error generating share link:", err);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareOnSocial = (platform) => {
    if (!shareLink) return;
    
    const shareText = `Check out this ${type === "audio" ? "audio" : "chat"}: ${shareLink}`;
    let url = "";
    
    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
        break;
      default:
        return;
    }
    
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <div className="share-modal-title">
            <Share2 size={20} />
            <h3>Share {type === "audio" ? "Audio" : "Chat"}</h3>
          </div>
          <button onClick={onClose} className="share-modal-close">
            &times;
          </button>
        </div>
        
        <div className="share-modal-body">
          <p>How long would you like to share this for?</p>
          
          <div className="share-duration-options">
            <button 
              className={`share-duration-btn ${loading ? 'disabled' : ''}`}
              onClick={() => generateShareLink(1)} 
              disabled={loading}
            >
              <Clock size={16} />
              1 Hour
            </button>
            <button 
              className={`share-duration-btn ${loading ? 'disabled' : ''}`}
              onClick={() => generateShareLink(8)} 
              disabled={loading}
            >
              <Clock size={16} />
              8 Hours
            </button>
            <button 
              className={`share-duration-btn ${loading ? 'disabled' : ''}`}
              onClick={() => generateShareLink(24)} 
              disabled={loading}
            >
              <Clock size={16} />
              24 Hours
            </button>
            <button 
              className={`share-duration-btn ${loading ? 'disabled' : ''}`}
              onClick={() => generateShareLink(168)} 
              disabled={loading}
            >
              <Clock size={16} />
              1 Week
            </button>
            <button
              className={`share-duration-btn ${loading ? 'disabled' : ''}`}
              onClick={() => generateShareLink(720)}
              disabled={loading}
            >
              <Clock size={16} />
              30 Days
            </button>
            <button
              className={`share-duration-btn ${loading ? 'disabled' : ''}`}
              onClick={() => generateShareLink("permanent")}
              disabled={loading}
            >
              <Clock size={16} />
              Permanent
            </button>
          </div>
          
          {loading && (
            <div className="share-loading">
              <div className="share-loader"></div>
              <p>Generating share link...</p>
            </div>
          )}
          
          {shareLink && (
            <>
              <div className="share-link-container">
                <p className="share-link-label">
                  {copied ? "Link copied to clipboard!" : "Share link:"}
                </p>
                <div className="share-link-input-container">
                  <input
                    type="text"
                    readOnly
                    value={shareLink}
                    className="share-link-input"
                    onFocus={(e) => e.target.select()}
                  />
                  <button 
                    onClick={copyToClipboard} 
                    className="share-copy-btn"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="share-divider">
                <span>OR</span>
              </div>
              
              <div className="social-share-options">
                <center>
                <p>Share directly via:</p>
                </center>
  
  <div className="flex gap-3">
    {/* WhatsApp Button */}
    <div 
      className="flex-1 h-[54px] rounded-lg border flex justify-center items-center cursor-pointer hover:bg-gray-50"
      onClick={() => shareOnSocial("whatsapp")}
    >
      <img 
        alt="whatsapp" 
        width="24" 
        height="24" 
        src="/assets/sharing-icons/whatsapp.png" 
        style={{ color: 'transparent' }} 
      />
    </div>

    {/* Twitter Button */}
    <div 
      className="flex-1 h-[54px] rounded-lg border flex justify-center items-center cursor-pointer hover:bg-gray-50"
      onClick={() => shareOnSocial("twitter")}
    >
      <img 
        alt="twitter" 
        width="24" 
        height="24" 
        src="/assets/sharing-icons/twitter.png" 
        style={{ color: 'transparent' }} 
      />
    </div>

    {/* Facebook Button */}
    <div 
      className="flex-1 h-[54px] rounded-lg border flex justify-center items-center cursor-pointer hover:bg-gray-50"
      onClick={() => shareOnSocial("facebook")}
    >
      <img 
        alt="facebook" 
        width="24" 
        height="24" 
        src="/assets/sharing-icons/facebook.png" 
        style={{ color: 'transparent' }} 
      />
    </div>
  </div>
</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ShareModal.propTypes = {
  type: PropTypes.oneOf(["audio", "chat"]).isRequired,
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ShareModal;