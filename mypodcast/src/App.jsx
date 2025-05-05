
import  { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, ChevronDown, Headphones, Volume2, MicOff, User } from 'lucide-react';
import TextToSpeech from './TextToSpeech';
import AudioBgRemover from './AudioBgRemover';
import VoiceCloning from './VoiceCloning';
import Avatar from './Avatar';
import AudioEditingEnvironment from './AudioEditingEnvironment';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';
import ProfileView from './ProfileView';
import ProfileEdit from './ProfileEdit';
import AboutUs from './AboutUs';
import { useAuth } from './AuthContext';
import { useTheme } from './useTheme';
import defaultAvatar from './assets/default-avatar.png';
import ShareChat from './ShareChat';
import SharedAudioPage from './SharedAudioPage';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import LetterAvatar from './LetterAvatar';
import TOS from './TOS'
import PublicAvatarView from './PublicAvatarView';
import ContactUsPage from './ContactUsPage';
import './App.css';



// Improved Loader Component with synchronized music bars animation
const Loader = ({ isLoading }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [isLoading]);
  
  if (!isLoading) return null;
  
  return (
    <div className="loader-overlay">
      <div className="music-bars-container">
        <div className="synchronized-music-bars">
          {[...Array(8)].map((_, index) => (
            <span 
              key={index} 
              style={{
                animationDelay: `${index * 0.1}s`,
                height: `${20 + Math.sin((animationProgress + index * 10) * 0.1) * 15}px`
              }}
            ></span>
          ))}
        </div>
        <p>Loading PodVerse... {Math.min(animationProgress, 99)}%</p>
      </div>
    </div>
  );
};


const UniqueFeatureSection = ({
  id,
  title,
  description,
  theory,
  videoSrc,
  tryRoute,
  handleTryIt,
  icon
}) => {
  const audioRef = useRef(null);
  const cardRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.05;
      audioRef.current.play().catch((e) =>
        console.log('Audio playback prevented:', e)
      );
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={`feature-card ${isHovered ? 'hovered' : ''}`}
      id={id}
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="feature-content">
        <div className="feature-header">
          <div className="feature-header-icon">{icon}</div>
          <h2 className="feature-title">
            {id === 'text-to-speech' ? 'Text to Podcast' : title}
          </h2>
        </div>
  
        <p className="feature-description">{description}</p>
  
        <div className="feature-details">
          <h3 className="details-heading">How it works</h3>
          <p className="feature-theory">{theory}</p>
        </div>
  
        <div className={`sound-wave ${isPlaying ? 'active' : ''}`}>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.15}s` }}></span>
          ))}
        </div>
  
        <div className="try-now-container">
          <button className="try-button" onClick={() => handleTryIt(tryRoute)}>
            <span className="btn-text">Try it now</span>
            <span className="btn-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};


const AppContent = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [featureLoading, setFeatureLoading] = useState(false);
  const { currentUser, logout: doLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef(null);

  // Reduced initial page load animation time
  useEffect(() => {
    // Show loader for 1.5 seconds instead of 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Reduced feature loading time
  useEffect(() => {
    if (featureLoading) {
      const timer = setTimeout(() => {
        setFeatureLoading(false);
      }, 800); // Reduced from 1500ms
      
      return () => clearTimeout(timer);
    }
  }, [featureLoading]);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNav = () => setNavOpen(!navOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  
  const handleLogout = () => {
    doLogout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const handleTryIt = (route) => {
    setFeatureLoading(true);
    
    // Reduced delay
    setTimeout(() => {
      if (currentUser) {
        navigate(route);
      } else {
        navigate('/login', { state: { redirectTo: route } });
      }
    }, 400); // Reduced from 800ms
  };

  const handleNavigation = (path) => {
    setFeatureLoading(true);
    
    // Reduced delay
    setTimeout(() => {
      navigate(path);
    }, 400); // Reduced from 800ms
  };

  return (
    <div className={`app ${theme}-mode`}>
      {/* Main loader for initial page load */}
      <Loader isLoading={isLoading} />
      
      {/* Feature loader for navigation between pages */}
      <Loader isLoading={featureLoading} />
      
    

      <header className={`header ${scrollPosition > 50 ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="logo-menu-container">
            {/* Hamburger menu with three vertical bars */}
            <button className="hamburger-menu" onClick={toggleNav} aria-label="Toggle menu">
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </button>
            
            <Link to="/" className="logo" onClick={(e) => {
              e.preventDefault();
              handleNavigation('/');
            }}>
              <span className="logo-icon">🎙️</span>
              <span className="logo-text">PodVerse</span>
            </Link>
          </div>
          
          <div className="header-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <nav className={`nav-menu ${navOpen ? 'open' : ''}`}>
              <div className="nav-menu-header">
                <span className="logo-icon">🎙️</span>
                <span className="logo-text">PodVerse</span>
                <button className="close-menu" onClick={toggleNav}>×</button>
              </div>

              <Link to="/aboutus" className="nav-link" onClick={(e) => {
                e.preventDefault();
                handleNavigation('/aboutus');
                toggleNav();
              }}>About Us</Link>
              
              <Link to="/" className="nav-link" onClick={(e) => {
                e.preventDefault();
                handleNavigation('/');
                toggleNav();
              }}>Features</Link>

              {currentUser ? (
                <div className="profile-dropdown" ref={dropdownRef}>
                  {/* <button className="profile-button" onClick={toggleDropdown}>
                    <img
                      src={currentUser.photoURL || defaultAvatar}
                      alt="avatar"
                      className="avatar"
                    />
                    <span className="profile-name">{currentUser.displayName || "Profile"}</span>
                    <ChevronDown size={16} className={dropdownOpen ? 'rotated' : ''} />
                  </button> */}
                  <button className="profile-button" onClick={toggleDropdown}>
                  {currentUser.profilePicture ? (
                    <img
                    src={currentUser.profilePicture}
                      alt="avatar"
                      className="avatar"
                      loading="lazy" 
                      onError={(e) => {
                        console.log(e);
                        e.target.style.display = 'none';
                        // The parent element will show the letter avatar
                      }}
                    />
                  ) : (
                    <LetterAvatar 
                      email={currentUser.email} 
                      size="32px" 
                      className="avatar"
                    />
                  )}
                    <span className="profile-name">{currentUser.displayName || "Profile"}</span>
                    <ChevronDown size={16} className={dropdownOpen ? 'rotated' : ''} />
                  </button>
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      <button onClick={() => {
                        setFeatureLoading(true);
                        setTimeout(() => {
                          navigate('/dashboard');
                          setDropdownOpen(false);
                          toggleNav();
                        }, 400);
                      }}>Dashboard</button>
                      <button onClick={() => {
                        setFeatureLoading(true);
                        setTimeout(() => {
                          navigate('/profile-view');
                          setDropdownOpen(false);
                          toggleNav();
                        }, 400);
                      }}>View Profile</button>
                     
                      <button onClick={() => {
                        handleLogout();
                        toggleNav();
                      }}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn btn-login" onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/login');
                    toggleNav();
                  }}>Login</Link>
                  <Link to="/signup" className="btn btn-signup" onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/signup');
                    toggleNav();
                  }}>Signup</Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<MainPage handleTryIt={handleTryIt} />} />
          <Route path="/tts" element={<TextToSpeech />} />
          <Route path="/AudioBgRemover" element={<AudioBgRemover />} />
          <Route path="/dubbing" element={<AudioEditingEnvironment />} />
          <Route path="/login" element={<AuthForm mode="login" />} />
          <Route path="/signup" element={<AuthForm mode="signup" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile-view" element={<ProfileView />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/voice-cloning" element={<VoiceCloning/>} />
          <Route path="/avatar" element={<Avatar />} />
          <Route path="/share/:chatId" element={<ShareChat />} />
          <Route path="/public-audio/:id" element={<SharedAudioPage />} />
          <Route path="/TOS" element={<TOS />} />
          <Route path="/public-avatar/:id" element={<PublicAvatarView />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword/>}/>
          <Route path="/contactus" element={<ContactUsPage />} />

        </Routes>
      </main>
      <footer className="footer">

        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">🎙️</span>
                <span className="logo-text">PodVerse</span>
              </div>
              <p className="footer-tagline">Advanced audio tools for creative minds</p>
              
            </div>
            
            <div className="footer-links-section">
              <div className="footer-links-column">
                <h3>Quick Links</h3>
                <div className="footer-links">
                  <Link to="/aboutus" onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/aboutus');
                  }}>About Us</Link>
                 
                  <Link to="/login" onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/login');
                  }}>Login</Link>
                </div>
              </div>
              
              <div className="footer-links-column">
                <h3>Services</h3>
                <div className="footer-links">
                  <Link to="/voice-cloning" onClick={(e) => {
                    e.preventDefault();
                    handleTryIt('/voice-cloning');
                  }}>Voice Cloning</Link>
                  <Link to="/tts" onClick={(e) => {
                    e.preventDefault();
                    handleTryIt('/tts');
                  }}>Text to Podcast</Link>
                  <Link to="/AudioBgRemover" onClick={(e) => {
                    e.preventDefault();
                    handleTryIt('/AudioBgRemover');
                  }}>Background Noise Remover</Link>
                  <Link to="/avatar" onClick={(e) => {
                    e.preventDefault();
                    handleTryIt('/avatar');
                  }}>AI Avatar</Link>
                </div>
              </div>
              
              <div className="footer-links-column">
                <h3>Support</h3>
                <div className="footer-links">
                  
                  <a href="/contactus">Contact Us</a>
                  <a href="/TOS">Terms of Service</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-copyright">
              © {new Date().getFullYear()} PodVerse. All rights reserved.
            </div>
            <div className="footer-badges">
              <span className="footer-badge">Made with ♥ for audio creators</span>
              <span className="footer-badge">AI Powered</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const MainPage = ({ handleTryIt }) => {
  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Transform Your <span className="gradient-text">Audio</span> Experience
          </h1>
          <p className="hero-subtitle">
            Advanced audio tools for podcast creators, voice artists, and content producers
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => handleTryIt('/tts')}>
              Get Started
            </button>
            <button className="btn btn-secondary" onClick={() => handleTryIt('/aboutus')}>
              Learn More
            </button>
          </div>
        </div>
        {/* <div className="hero-graphic">
          <div className="waveform-container">
            <div className="waveform"></div>
          </div>
        </div> */}
        {/* Replace the existing hero-graphic div with this */}
<div className="hero-graphic">
  <div className="podcast-visualization">
    {/* <div className="mic-container">
      <div className="mic-body"></div>
      <div className="mic-stand"></div>
      <div className="mic-base"></div>
    </div> */}
    <div className="sound-waves">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="wave" style={{ '--i': i }}></div>
      ))}
    </div>
    <div className="audio-levels">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="bar" style={{ '--delay': i * 0.1 + 's' }}></div>
      ))}
    </div>
    <div className="particles">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="particle" style={{
          '--size': Math.random() * 4 + 2 + 'px',
          '--x': Math.random() * 100 + '%',
          '--y': Math.random() * 100 + '%',
          '--delay': Math.random() * 2 + 's'
        }}></div>
      ))}
    </div>
  </div>
</div>
      </section>
      
      <section className="features-section">
        <h2 className="section-title">Our Audio Solutions</h2>
        <div className="features-container">
          <UniqueFeatureSection
            id="voice-cloning"
            title="Voice Cloning"
            description="Replicate unique voice characteristics for a personalized audio experience."
            theory="Leveraging neural networks and extensive training data, our system mimics tonal qualities, pitch, and cadence of any voice, enabling realistic voice synthesis for unprecedented creative freedom."
            audioSrc="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            tryRoute="/voice-cloning"
            handleTryIt={handleTryIt}
            icon={<Headphones size={32} />}
          />
          <UniqueFeatureSection
            id="text-to-speech"
            title="Text to Podcast"
            description="Convert written content into natural-sounding speech with our state-of-the-art technology."
            theory="Our TTS system employs sophisticated algorithms to analyze text context, ensuring generated speech is both intelligible and expressive, capturing the nuances of human speech."
            audioSrc="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            tryRoute="/tts"
            handleTryIt={handleTryIt}
            icon={<Volume2 size={32} />}
          />
          <UniqueFeatureSection
            id="bg-noise-remover"
            title="Noise Remover"
            description="Eliminate unwanted background noise from your audio recordings with precision."
            theory="Using cutting-edge audio analysis and filtering methods, our noise remover distinguishes between speech and noise, ensuring clear audio output even in challenging recording environments."
            audioSrc="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            tryRoute="/AudioBgRemover"
            handleTryIt={handleTryIt}
            icon={<MicOff size={32} />}
          />
          <UniqueFeatureSection
            id="ai-avatar"
            title="AI-Powered Avatar"
            description="Create virtual avatars that speak with your chosen voice for enhanced visual content."
            theory="Using advanced AI and computer vision technology, our avatar system generates realistic digital personas that can be synchronized with audio to create immersive visual content for your podcast or presentations."
            audioSrc="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
            tryRoute="/avatar"
            handleTryIt={handleTryIt}
            icon={<User size={32} />}
          />
        </div>
      </section>
      
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to elevate your audio projects?</h2>
          <p>Join thousands of content creators who trust PodVerse for their audio needs</p>
          <button className="btn btn-primary" onClick={() => handleTryIt('/tts')}>
            Start Creating Now !!
          </button>
        </div>
      </section>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;