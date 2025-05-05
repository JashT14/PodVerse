import React from 'react';
import './TOS.css';

const TOS = () => {
  return (
    <div className="TOS-container">
      <header className="TOS-header">
        <h1 className="TOS-title">PodVerse Terms of Service</h1>
        <p className="TOS-effective-date">Effective Date: April 2025</p>
      </header>

      <main className="TOS-main">
        <section className="TOS-section">
          <h2 className="TOS-section-title">1. Acceptance of Terms</h2>
          <p className="TOS-paragraph">
            By using PodVerse, you agree to these Terms of Service. If you don't agree, please don't use our platform.
            We may update these terms occasionally, and continued use means acceptance of changes.
          </p>
        </section>

        <section className="TOS-section">
          <h2 className="TOS-section-title">2. User Responsibilities</h2>
          <div className="TOS-responsibility-grid">
            <div className="TOS-responsibility-card">
              <h3 className="TOS-card-title">Lawful Use</h3>
              <p className="TOS-card-text">Only upload content you have rights to share</p>
            </div>
            <div className="TOS-responsibility-card">
              <h3 className="TOS-card-title">Account Security</h3>
              <p className="TOS-card-text">Keep your login credentials safe and confidential</p>
            </div>
            <div className="TOS-responsibility-card">
              <h3 className="TOS-card-title">Community Guidelines</h3>
              <p className="TOS-card-text">No hate speech, harassment, or illegal content</p>
            </div>
          </div>
        </section>

        <section className="TOS-section">
          <h2 className="TOS-section-title">3. Content Ownership</h2>
          <p className="TOS-paragraph">
            You retain ownership of your content. By uploading, you grant PodVerse a non-exclusive license to store
            and distribute your content through our platform.
          </p>
        </section>

        <section className="TOS-section">
          <h2 className="TOS-section-title">4. Termination</h2>
          <p className="TOS-paragraph">
            We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section className="TOS-section">
          <h2 className="TOS-section-title">5. Disclaimers</h2>
          <p className="TOS-paragraph">
            PodVerse is provided "as is" without warranties. We don't guarantee uninterrupted service or content
            accuracy. Use at your own risk.
          </p>
        </section>

        <section className="TOS-section">
          <h2 className="TOS-section-title">6. Limitation of Liability</h2>
          <p className="TOS-paragraph">
            We're not liable for indirect damages arising from platform use. 
          </p>
        </section>

        <section className="TOS-section">
          <h2 className="TOS-section-title">7. Changes to Terms</h2>
          <p className="TOS-paragraph">
            We'll notify users of significant changes via email or platform notifications. Minor changes become
            effective immediately.
          </p>
        </section>

       
      </main>

      <footer className="TOS-footer">
        <p className="TOS-copyright">© 2025 PodVerse Team</p>
      </footer>
    </div>
  );
};

export default TOS;