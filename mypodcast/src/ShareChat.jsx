import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ShareAudioPlayer from './ShareAudioPlayer';
import './ShareChat.css';

//Define backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5257";

const ShareChat = () => {
  const { chatId } = useParams();
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const shareToken = searchParams.get('shareToken') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/share/${chatId}?shareToken=${shareToken}`,
          { timeout: 10000 } // Add timeout for better error handling
        );
        
        const data = response.data;
        if (data.conversation) {
          setConversation(data.conversation);
        } else if (data.chat && data.chat.conversation) {
          setConversation(data.chat.conversation);
        } else {
          setError('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching shared audio:', err);
        setError(
          err.response?.data?.error || 
          err.message || 
          'Failed to load shared audio'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chatId, shareToken]);

  if (loading) {
    return (
      <div className="shared-loading-container">
        <div className="loading-spinner"></div>
        <p>Loading shared audio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-error-container">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Audio</h2>
        <p>{error}</p>
        <button 
          className="retry-button" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!conversation || conversation.length === 0) {
    return (
      <div className="shared-empty-container">
        <div className="empty-icon">🔍</div>
        <h2>No Audio Found</h2>
        <p>No audio content was found for this share link.</p>
      </div>
    );
  }

  return (
    <div className="shared-chat-container">
      <header className="shared-header">
        <h1>Shared Audio Collection</h1>
        <p className="shared-subtitle">Shared with you • {conversation.length} audio tracks</p>
      </header>
      
      <div className="shared-audio-list">
        {conversation.map((item, index) => (
          <div key={item._id || index} className="shared-audio-item">
            <div className="audio-item-header">
              <span className="audio-number">{index + 1}</span>
              <h3 className="audio-query">{item.query || 'Untitled Audio'}</h3>
              {item.uploadDate && (
                <span className="audio-date">
                  {new Date(item.uploadDate).toLocaleDateString()} 
                </span>
              )}
            </div>
            
            <div className="audio-player-container">
              <ShareAudioPlayer 
                src={item.audio} 
                title={item.query || 'Audio Track'}
              />
            </div>
            
            {item.description && (
              <p className="audio-description">{item.description}</p>
            )}
          </div>
        ))}
      </div>
      
      <footer className="shared-footer">
        <p>Audio sharing powered by PodVerse</p>
      </footer>
    </div>
  );
};

export default ShareChat;