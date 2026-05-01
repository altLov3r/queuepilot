/**
 * Landing Page Component
 * Welcome screen with app introduction and demo button
 */

import React from 'react';

const LandingPage = ({ onStartDemo, onConnectedInbox, onJudgeDemo }) => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Status Badge */}
        <div style={styles.statusBadge}>
          <span style={styles.statusDot}></span>
          <span style={styles.statusText}>Fallback AI Active</span>
          <span style={styles.statusSeparator}>•</span>
          <span style={styles.statusText}>watsonx-ready</span>
          <span style={styles.statusSeparator}>•</span>
          <span style={styles.statusText}>Demo Data Only</span>
        </div>

        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h1 style={styles.title}>QueuePilot</h1>
          <p style={styles.subtitle}>AI-Powered Support Ticket Triage</p>
        </div>

        <div style={styles.description}>
          <p style={styles.descriptionText}>
            Small businesses receive dozens of support messages daily but struggle to identify which ones need immediate attention. 
            QueuePilot uses AI to instantly analyze customer support tickets, categorize them, assess urgency, detect sentiment, 
            and provide suggested replies—helping your team respond faster to the customers who need it most.
          </p>
        </div>

        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🎯</div>
            <h3 style={styles.featureTitle}>Smart Categorization</h3>
            <p style={styles.featureText}>Automatically sorts tickets into delivery, refund, billing, bug, complaint, or general categories</p>
          </div>
          
          <div style={styles.feature}>
            <div style={styles.featureIcon}>⚡</div>
            <h3 style={styles.featureTitle}>Urgency Detection</h3>
            <p style={styles.featureText}>Identifies high-priority tickets that need immediate attention</p>
          </div>
          
          <div style={styles.feature}>
            <div style={styles.featureIcon}>😊</div>
            <h3 style={styles.featureTitle}>Sentiment Analysis</h3>
            <p style={styles.featureText}>Detects angry or frustrated customers to prevent escalation</p>
          </div>
          
          <div style={styles.feature}>
            <div style={styles.featureIcon}>💬</div>
            <h3 style={styles.featureTitle}>Reply Suggestions</h3>
            <p style={styles.featureText}>Generates professional response templates tailored to each ticket</p>
          </div>
        </div>

        <div style={styles.buttonContainer}>
          <button style={styles.judgeDemoButton} onClick={onJudgeDemo}>
            ⚡ Judge Demo Mode
          </button>
          <button style={styles.demoButton} onClick={onStartDemo}>
            Try Demo
          </button>
          <button style={styles.connectedButton} onClick={onConnectedInbox}>
            🔗 Connected Inbox
          </button>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Built with IBM Bob • Powered by AI • Ready for watsonx.ai integration
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  content: {
    maxWidth: '1000px',
    width: '100%',
    background: 'white',
    borderRadius: '20px',
    padding: '60px 40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    textAlign: 'center'
  },
  header: {
    marginBottom: '40px'
  },
  iconContainer: {
    display: 'inline-block',
    marginBottom: '20px'
  },
  icon: {
    width: '64px',
    height: '64px',
    color: '#667eea'
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#1a202c',
    margin: '0 0 10px 0',
    letterSpacing: '-1px'
  },
  subtitle: {
    fontSize: '20px',
    color: '#718096',
    margin: 0,
    fontWeight: '500'
  },
  description: {
    marginBottom: '50px',
    padding: '0 20px'
  },
  descriptionText: {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#4a5568',
    margin: 0
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '30px',
    marginBottom: '50px'
  },
  feature: {
    padding: '20px',
    textAlign: 'center'
  },
  featureIcon: {
    fontSize: '40px',
    marginBottom: '15px'
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 10px 0'
  },
  featureText: {
    fontSize: '14px',
    color: '#718096',
    lineHeight: '1.6',
    margin: 0
  },
  statusBadge: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '10px 20px',
    borderRadius: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontSize: '12px',
    fontWeight: '600'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10b981',
    animation: 'pulse 2s infinite'
  },
  statusText: {
    color: '#4a5568',
    fontSize: '12px'
  },
  statusSeparator: {
    color: '#cbd5e0',
    fontSize: '12px'
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  judgeDemoButton: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
    border: 'none',
    padding: '18px 50px',
    fontSize: '18px',
    fontWeight: '700',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    animation: 'glow 2s infinite'
  },
  demoButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '18px 60px',
    fontSize: '18px',
    fontWeight: '700',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  connectedButton: {
    background: 'white',
    color: '#667eea',
    border: '3px solid #667eea',
    padding: '18px 60px',
    fontSize: '18px',
    fontWeight: '700',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  footer: {
    marginTop: '50px',
    paddingTop: '30px',
    borderTop: '1px solid #e2e8f0'
  },
  footerText: {
    fontSize: '14px',
    color: '#a0aec0',
    margin: 0
  }
};

export default LandingPage;

// Made with Bob
