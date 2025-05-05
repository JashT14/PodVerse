import  { useState, useEffect } from 'react';
import './ContactUsPage.css';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setTimeout(() => {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 1000);
    }
  };

  const SuccessMessage = () => {
    const [countdown, setCountdown] = useState(3);
    const [progress, setProgress] = useState(0);
  
    useEffect(() => {
      // Start animation immediately
      const duration = 3000; // 3 seconds total
      const interval = 16; // Update roughly every 16ms for smooth animation (60fps)
      const increment = (interval / duration) * 100;
      let currentProgress = 0;
      
      // Smooth progress animation
      const progressInterval = setInterval(() => {
        currentProgress += increment;
        setProgress(Math.min(currentProgress, 100));
        
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
        }
      }, interval);
      
      // Countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsSubmitted(false);
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
  
      return () => {
        clearInterval(timer);
        clearInterval(progressInterval);
      };
    }, []);
  
    return (
      <div className="success-message-container">
        <div className="success-content animate-slideUp">
          <div className="success-icon">✓</div>
          <h2>Thank You!</h2>
          <p>We&apos;ll get back to you soon! Redirecting in {countdown} seconds...</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`contact-us-page ${isMounted ? 'mounted' : ''}`}>
      <div className="contact-header animate-fadeIn">
        <h1>Get in Touch</h1>
        <p>Have questions or need assistance? Reach out to us – our team is ready to help!</p>
      </div>

      {isSubmitted ? (
        <SuccessMessage />
      ) : (
        <div className="contact-container animate-fadeInUp">
          <div className="contact-info-sidebar">
            <div className="info-item animate-slideIn">
              <div className="info-icon"><span className="icon-location"></span></div>
              <div className="info-content">
                <h3>Project Developed at</h3>
                <p>SVKM&apos;s SBMP & CoE,<br />Vile Parle (W), Mumbai<br/> Pin - 400056</p>
              </div>
            </div>

            <div className="info-item animate-slideIn">
              <div className="info-icon"><span className="icon-phone"></span></div>
              <div className="info-content">
                <h3>Phone Support</h3>
                <p>+91 123-456-7890</p>
              </div>
            </div>

            <div className="info-item animate-slideIn">
              <div className="info-icon"><span className="icon-email"></span></div>
              <div className="info-content">
                <h3>Email Us</h3>
                <p>support@podverse.com</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  placeholder=" "
                />
                <label>Your Name</label>
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder=" "
                />
                <label>Email Address</label>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={errors.subject ? 'error' : ''}
                placeholder=" "
              />
              <label>Subject</label>
              {errors.subject && <span className="error-message">{errors.subject}</span>}
            </div>

            <div className="form-group">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className={errors.message ? 'error' : ''}
                placeholder=" "
              ></textarea>
              <label>Your Message</label>
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>

            <button type="submit" className="submit-btn">
              <span>Send Message</span>
              <div className="submit-arrow">→</div>
            </button>
          </form>
        </div>
      )}

      <div className="map-container animate-fadeIn">
        <iframe
          title="Project Development"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1885.0005212451015!2d72.83714573079251!3d19.107610198768086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c651c56f9b%3A0xc32173e36e9d804f!2sSVKM&#39;s%20Shri%20Bhagubhai%20Mafatlal%20Polytechnic%20and%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1745090821767!5m2!1sen!2sin"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUsPage;