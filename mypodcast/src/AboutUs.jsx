import React from 'react';
import './AboutUs.css';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

import { 
  Mic, 
  Podcast, 
  Waves,
  Mic2
} from 'lucide-react';

  // Custom Icon Components
  const VoiceCloningIcon = (props) => (
    <div style={{position: 'relative'}}>
      <Mic/>
    </div>
  );
  
  const TextToPodcastIcon = (props) => (
    <div style={{position: 'relative'}}>
      <Podcast/>
    </div>
  );
  
  const AudioNoiseBgRemoverIcon = (props) => (
    <div style={{position: 'relative'}}>
      <Waves />
    </div>
  );
  
  const AIAvatarIcon = (props) => (
    <div style={{position: 'relative'}}>
      <Mic2 />
    </div>
  );
  

const AboutUs = () => {
  const features = [
    {
      id: 1,
      title: "Voice Cloning",
      description: "Create personalized podcasts using your own voice or choose from our library of voice profiles. Our AI technology ensures natural-sounding speech patterns.",
      icon: <VoiceCloningIcon />
    },
    {
      id: 2,
      title: "Text-to-Podcast",
      description: "Transform any text into engaging podcast content with just a click. Convert articles, blog posts, or scripts into professional audio content effortlessly.",
      icon: <TextToPodcastIcon />
    },
    {
      id: 3,
      title: "Audio Background Noise Remover",
      description: "Clean up your recordings with our advanced noise cancellation technology. Remove background noise, echo, and interference for crystal-clear audio.",
      icon: <AudioNoiseBgRemoverIcon />
    },
    {
      id: 4,
      title: "AI Avatar",
      description: "Create virtual hosts for your podcasts with customizable AI avatars. Give your content a visual identity that matches your brand.",
      icon: <AIAvatarIcon />
    }
  ];
  

  const teamMembers = [
    {
      id: 1,
      name: "Jash Thakkkar",
      title: "Fullstack Developer",
      description: "Architected and implemented the Node.js server, configured MongoDB database schemas and integrations, developed the React frontend UI components, and conducted comprehensive testing of the Text-to-Podcast and background noise removal ML models. Collaborated closely with the ML team to integrate the Flask-based backend services into the application.",
      image: "/assets/Team/jash.jpg",
      social: {
        twitter: "https://x.com/the_JashThakkar",
        linkedin: "https://www.linkedin.com/in/thejashthakkar/",
        github: "https://github.com/JashT14"
      }
    },
    {
      id: 2,
      name: "Neel Shah",
      title: "AI Developer & Research Lead",
      description: "Led project research and technical design, crafting system architecture and UI/UX prototypes. Developed and fine-tuned machine learning algorithms for core features, and executed rigorous testing to validate model performance and reliability.",
      image: "/assets/Team/neel.jpg",
      social: {
        twitter: "https://x.com/NeelSha2215922",
        linkedin: "https://www.linkedin.com/in/neel-shah14/",
        github: "https://github.com/Neel7977"
      }
    },
    {
      id: 3,
      name: "Ganesh Palav",
      title: "ML Integration Developer",
      description: "Designed, developed, and tested machine learning models, optimizing data pipelines and integration points. Worked hand-in-hand with the Fullstack Developer to seamlessly integrate the Flask-based ML backend into the user interface, ensuring a smooth end-to-end experience.",
      image: "/assets/Team/ganesh.jpg",
      social: {
        twitter: "https://x.com/higanesh45",
        linkedin: "https://www.linkedin.com/in/ganesh-palav-00ba06303/",
        github: "https://github.com/ganesh9076"
      }
    }
  ];
  


  return (
    <div className="about-container">
      <header className="about-header">
        <div className="header-content">
          <h1>About <span className="highlight">PodVerse</span></h1>
          <p className="tagline">Revolutionizing Podcast Creation with AI</p>
        </div>
      </header>

      <section className="vision-section">
        <h2>Our Vision</h2>
        <div className="vision-content">
          <p>
          PodVerse is a final-year diploma project developed at Shri Bhagubhai Mafatlal Polytechnic with the aim of democratizing podcast creation using AI technologies. It simplifies content production through features like voice cloning, text-to-podcast, and audio enhancement, enabling users from all backgrounds to easily share their stories and ideas.

          </p>
        </div>
      </section>

      <section className="idea-section">
        <h2>Our Motivation</h2>
        <div className="idea-content">
          <p>
            Inspired by advancements in AI such as NotebookLM and similar applications, 
            we saw an opportunity to create a platform that removes the technical barriers 
            to podcast creation. Many people have valuable insights and stories but lack the 
            equipment, technical knowledge, or confidence to start a podcast. PodVerse 
            aims to change that by providing intuitive AI-powered tools that simplify the 
            entire process.
          </p>
        </div>
      </section>

     
      <section className="team-section">
  <h2>Meet Our Team</h2>
  <div className="team-container">
    {teamMembers.map(member => (
      <div key={member.id} className="team-card">
        <div className="member-image">
          <img src={member.image} alt={member.name} />
        </div>
        <div className="member-info">
          <h3>{member.name}</h3>
          <h4>{member.title}</h4>
          <p>{member.description}</p>
          <div className="social-icons">
            <a href={member.social.twitter} className="social-icon"><FaTwitter /></a>
            <a href={member.social.linkedin} className="social-icon"><FaLinkedin /></a>
            <a href={member.social.github} className="social-icon"><FaGithub /></a>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

<section className="thanks-section">
  <h2>Acknowledgements</h2>
  <p>
    We would like to express our gratitude to <span className="highlight">SVKM's Shri Bhagubhai Mafatlal Polytechnic</span> for 
    providing us with the resources and support for development of our project PodVerse.
  </p>
  <p>
    Special thanks to our project guide, <span className="highlight">Mrs. Pradnya Natekar</span>, whose 
    mentorship and expertise have been invaluable throughout this journey.
  </p>
</section>

      <footer className="about-footer">
        <p>© 2025 PodVerse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;