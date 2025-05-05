import  { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import ShareModal from "./ShareModal";
import AudioPlayer from "./ShareAudioPlayer";
import "./Dashboard.css";
import { SlidersHorizontal, ListFilter } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [ttsHistory, setTtsHistory] = useState([]);
  const [chats, setChats] = useState([]);
  const [sharedLinks, setSharedLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({ totalPrompts: 0, totalDuration: 0 });
  const [activeTab, setActiveTab] = useState('history'); // 'history', 'chats', or 'shared'
    // Consolidated sort state with proper tab-specific state
    const [sortStates, setSortStates] = useState({
      history: { isOpen: false, order: 'ascending', by: 'date' },
      chats: { isOpen: false, order: 'ascending', by: 'date' },
      shared: { isOpen: false, order: 'ascending', by: 'date' }
    });

  // State for controlling the ShareModal
  const [shareModalData, setShareModalData] = useState({ open: false, type: "", id: "" });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5257";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch user profile for stats
        const profileResponse = await fetch(`${backendUrl}/api/profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserStats({
            totalPrompts: profileData.totalPrompts || 0,
            totalDuration: profileData.totalDuration || 0
          });
        }

        // Fetch TTS history
        const historyResponse = await fetch(`${backendUrl}/api/tts-history`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!historyResponse.ok) {
          throw new Error('Failed to fetch TTS history');
        }

        const historyData = await historyResponse.json();
        setTtsHistory(historyData.history || []);

        // Fetch chats
        const chatsResponse = await fetch(`${backendUrl}/api/chats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!chatsResponse.ok) {
          throw new Error('Failed to fetch chats');
        }

        const chatsData = await chatsResponse.json();
        setChats(chatsData || []);

        // Fetch shared links
        const sharedLinksResponse = await fetch(`${backendUrl}/api/shared-links`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!sharedLinksResponse.ok) {
          throw new Error('Failed to fetch shared links');
        }

        const sharedLinksData = await sharedLinksResponse.json();
        // Ensure sharedLinks is an array
        setSharedLinks(Array.isArray(sharedLinksData.shareLinks) ? sharedLinksData.shareLinks : []);

      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleCreateChat = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/chats/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create chat');
      }

      const data = await response.json();
      setChats([...chats, data.chat]);
      navigate(`/chat/${data.chat.chatId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  // New helper to open ShareModal with the appropriate type and id
  const openShareModal = (type, id) => {
    setShareModalData({ open: true, type, id });
  };

  // Updated share handlers now simply open the modal
  const handleShareAudio = (audioId) => {
    openShareModal("audio", audioId);
  };

  const handleShareChat = (chatId) => {
    openShareModal("chat", chatId);
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }

      setChats(chats.filter(chat => chat.chatId !== chatId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateChatTitle = async (chatId, newTitle) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/chats/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle })
      });

      if (!response.ok) {
        throw new Error('Failed to update chat title');
      }

      const data = await response.json();
      setChats(chats.map(chat => chat.chatId === chatId ? data.chat : chat));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSharedLink = async (linkId) => {
    if (!window.confirm('Are you sure you want to delete this shared link?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/shared-links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete shared link');
      }
  
      setSharedLinks(sharedLinks.filter(link => link._id !== linkId));
    } catch (err) {
      setError(err.message);
    }
  };
  
  const SortControl = ({ activeTab, sortState, setSortState }) => {
    const getSortLabel = () => {
      if (activeTab === 'chats') return 'Title';
      if (activeTab === 'shared') return 'Name';
      return 'Duration';
    };
  
    const updateSortState = (newStateOrFunction) => {
      setSortState((prevStates) => {
        const prevTabState = prevStates[activeTab];
        const newTabState = typeof newStateOrFunction === 'function' 
          ? newStateOrFunction(prevTabState)
          : newStateOrFunction;
        return {
          ...prevStates,
          [activeTab]: newTabState
        };
      });
    };
  
    return (
      <div className="sort-container">
        <button 
          className="sort-toggle-button"
          onClick={() => updateSortState(prev => ({
            ...prev,
            isOpen: !prev.isOpen
          }))}
        >
          <ListFilter className="sort-icon" />
          Sort By
        </button>
        
        {sortState.isOpen && (
          <div className="sort-options-menu">
            <div className="sort-order-section">
              <button
                className={`sort-option ${sortState.order === 'ascending' ? 'active' : ''}`}
                onClick={() => {
                  updateSortState(prev => ({
                    ...prev,
                    order: 'ascending',
                    isOpen: false
                  }));
                }}
              >
                Ascending
              </button>
              <button
                className={`sort-option ${sortState.order === 'descending' ? 'active' : ''}`}
                onClick={() => {
                  updateSortState(prev => ({
                    ...prev,
                    order: 'descending',
                    isOpen: false
                  }));
                }}
              >
                Descending
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleSort = (data, type, sortBy, sortOrder) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    return [...data].sort((a, b) => {
      let valueA, valueB;
      
      if (type === 'tts') {
        if (sortBy === 'date') {
          valueA = new Date(a.uploadDate).getTime();
          valueB = new Date(b.uploadDate).getTime();
        } else {
          // Fix: Parse duration properly - it might be a string like "1:45"
          valueA = parseDurationToSeconds(a.duration);
          valueB = parseDurationToSeconds(b.duration);
        }
      } else if (type === 'chats') {
        if (sortBy === 'date') {
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
        } else {
          // Title sorting - using localeCompare for proper string comparison
          valueA = (a.title || '').toLowerCase();
          valueB = (b.title || '').toLowerCase();
          return sortOrder === 'ascending' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        }
      } else if (type === 'shared') {
        if (sortBy === 'date') {
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
        } else {
          // Resource name sorting
          valueA = (a.resourceName || '').toLowerCase();
          valueB = (b.resourceName || '').toLowerCase();
          return sortOrder === 'ascending' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        }
      }
      
      // For numeric values (dates and durations)
      return sortOrder === 'ascending' ? valueA - valueB : valueB - valueA;
    });
  };

  // Add this helper function to convert duration strings to seconds for proper comparison
const parseDurationToSeconds = (durationStr) => {
  if (!durationStr) return 0;
  
  // If already a number, return it
  if (typeof durationStr === 'number') return durationStr;
  
  // If it's a string like "1:45"
  if (typeof durationStr === 'string' && durationStr.includes(':')) {
    const parts = durationStr.split(':');
    const minutes = parseInt(parts[0], 10) || 0;
    const seconds = parseInt(parts[1], 10) || 0;
    return (minutes * 60) + seconds;
  }
  
  // Try to convert to number if it's another format
  return Number(durationStr) || 0;
};


//FIlter
// Add this new state near existing sortStates
const [filterStates, setFilterStates] = useState({
  history: 'all',
  chats: 'all',
  shared: 'all'
});

// Add this FilterControl component
const FilterControl = ({ activeTab, filterState, setFilterState }) => {
  const updateFilterState = (newFilter) => {
    setFilterState(prev => ({
      ...prev,
      [activeTab]: newFilter
    }));
  };

  return (
    <div className="dashboard-filter-container">
    <div className="dashboard-filter-dropdown">
      <button className="dashboard-filter-toggle-button">
      <span>Filter</span>
      <SlidersHorizontal className="dashboard-filter-icon" />
      </button>
      <div className="dashboard-filter-options-menu">
        <button
          className={`dashboard-filter-option ${filterState[activeTab] === 'all' ? 'active' : ''}`}
          onClick={() => updateFilterState('all')}
        >
          All Time
        </button>
        <button
          className={`dashboard-filter-option ${filterState[activeTab] === '7days' ? 'active' : ''}`}
          onClick={() => updateFilterState('7days')}
        >
          Last 7 Days
        </button>
        <button
          className={`dashboard-filter-option ${filterState[activeTab] === '14days' ? 'active' : ''}`}
          onClick={() => updateFilterState('14days')}
        >
          Last 14 Days
        </button>
        <button
          className={`dashboard-filter-option ${filterState[activeTab] === '1month' ? 'active' : ''}`}
          onClick={() => updateFilterState('1month')}
        >
          Last 1 Month
        </button>
      </div>
    </div>
  </div>
);
};
// Add this filter function above the return statement
const filterData = (data, tab, filter) => {
  const now = new Date();
  let cutoffDate = new Date();

  switch (filter) {
    case '7days':
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case '14days':
      cutoffDate.setDate(now.getDate() - 14);
      break;
    case '1month':
      cutoffDate.setMonth(now.getMonth() - 1);
      break;
    case 'all':
    default:
      return data;
  }

  // Reset time components to midnight (00:00:00)
  cutoffDate.setHours(0, 0, 0, 0);

  return data.filter(item => {
    const itemDate = new Date(
      tab === 'history' ? item.uploadDate :
      tab === 'chats' ? item.createdAt :
      item.createdAt
    );
    
    // Compare dates without time components
    return itemDate >= cutoffDate;
  });
};
  const getRemainingDays = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const copyLinkToClipboard = (link) => {
    navigator.clipboard.writeText(link.shareUrl)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {currentUser?.displayName || "User"}!</h1>
        <div className="user-stats">
          <div className="stat-item">Total Podcasts: {userStats.totalPrompts}</div>
          <div className="stat-item">Total Duration: {formatDuration(userStats.totalDuration)}</div>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Audio History
        </button>
        <button 
          className={`tab-button ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveTab('chats')}
        >
          Chats
        </button>
        <button 
          className={`tab-button ${activeTab === 'shared' ? 'active' : ''}`}
          onClick={() => setActiveTab('shared')}
        >
          Shared Links
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading-indicator">Loading your data...</div>
        ) : error ? (
          <div className="error-message">Error: {error}</div>
        ) : activeTab === 'history' ? (
          <div className="tts-history-container">
            <h2>Your Audio History</h2>
                  <FilterControl
            activeTab="history"
            filterState={filterStates}
            setFilterState={setFilterStates}
          />
            <SortControl
              activeTab="history"
              sortState={sortStates.history}
              setSortState={setSortStates}
            />
            {ttsHistory.length === 0 ? (
              <p className="no-history">No audio files found. Start by creating one!</p>
            ) : (
              <ul className="tts-history-list">
            {handleSort(
                filterData(ttsHistory, 'history', filterStates.history),
                'tts', 
                sortStates.history.by, 
                sortStates.history.order
              ).map((item) => (
                  <li key={item._id} className="tts-history-item">
                    <div className="tts-header">
                      <h3 className="tts-text">{item.requestedText}</h3>
                      <span className="tts-date">{formatDate(item.uploadDate)}</span>
                    </div>
                    <div className="tts-details">
                   
                    <span className="speaker-tag">Speaker 1: {item.speaker1 || "Default Speaker"}</span>
                  
                
                    <span className="speaker-tag">Speaker 2: {item.speaker2 || "Default Speaker"}</span>
                  
                    </div> 

                    <div className="tts-controls">
                      <div className="audio-player-container">
                        <AudioPlayer src={`${backendUrl}/api/tts-audio/${item._id}`} />
                      </div>
                      <button
                        className="share-button"
                        onClick={() => handleShareAudio(item._id)}
                      >
                        Share
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : activeTab === 'chats' ? (
          <div className="chats-container">
            <div className="chats-header">
              <h2>Your Chats</h2>

             
            </div>

            {chats.length === 0 ? (
              <p className="no-chats">No chats found. Start by creating one!</p>
            ) : (
              <ul className="chats-list">
          {handleSort(
              filterData(chats, 'chats', filterStates.chats),
              'chats',
              sortStates.chats.by,
              sortStates.chats.order
      ).map((chat) => (
                  <li key={chat.chatId} className="chat-item">
                    <div 
                      className="chat-title" 
                      onClick={() => navigate(`/chat/${chat.chatId}`)}
                    >
                      {chat.title || `Chat ${new Date(chat.createdAt).toLocaleDateString()}`}
                    </div>
                    <div className="chat-controls">
                      <button 
                        className="edit-title-button"
                        onClick={() => {
                          const newTitle = prompt("Enter new chat title:", chat.title);
                          if (newTitle) handleUpdateChatTitle(chat.chatId, newTitle);
                        }}
                      >
                        Rename
                      </button>
                      <button 
                        className="share-button"
                        onClick={() => handleShareChat(chat.chatId)}
                      >
                        Share
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteChat(chat.chatId)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
<div className="shared-links-container">
  <h2>Your Shared Links</h2>
  <FilterControl
      activeTab="shared"
      filterState={filterStates}
      setFilterState={setFilterStates}
    />
            <SortControl
              activeTab="shared"
              sortState={sortStates.shared}
              setSortState={setSortStates}
            />
  {!Array.isArray(sharedLinks) || sharedLinks.length === 0 ? (
    <p className="no-shared-links">No shared links found. Share content to create links!</p>
  ) : (
    <ul className="shared-links-list">
      {handleSort(
          filterData(sharedLinks, 'shared', filterStates.shared),
          'shared',
          sortStates.shared.by,
          sortStates.shared.order
).map((link) => (
        <li key={link._id} className="shared-link-item">
          <div className="shared-link-info">
            <div className="shared-link-title">
              {link.resourceType === 'audio' ? 'Audio: ' : 'Chat: '}
              {link.resourceName || 'Untitled'}
            </div>
            <div className="shared-link-metadata">
              <span className="shared-link-created">Created: {formatDate(link.createdAt)}</span>
              <span className="shared-link-expiry">Expires: {link.expiryDisplay}</span>
            </div>
          </div>
          <div className="shared-link-controls">
            <button 
              className="copy-link-button"
              onClick={() => {
                navigator.clipboard.writeText(link.shareUrl)
                  .then(() => alert('Link copied to clipboard!'));
              }}
            >
              Copy Link
            </button>
            {/* <button 
              className="extend-link-button"
              onClick={() => {
                const days = parseInt(prompt("Extend expiry by how many days?", "7"), 10);
                if (!isNaN(days) && days > 0) handleUpdateSharedLinkExpiry(link._id, days);
              }}
            >
              Extend
            </button> */}
            <button 
              className="delete-link-button"
              onClick={() => handleDeleteSharedLink(link._id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>
        )}
      </div>

      {/* Conditionally render the ShareModal */}
      {shareModalData.open && (
        <ShareModal
          type={shareModalData.type}
          id={shareModalData.id}
          onClose={() => setShareModalData({ ...shareModalData, open: false })}
        />
      )}
    </div>
  );
};

export default Dashboard;