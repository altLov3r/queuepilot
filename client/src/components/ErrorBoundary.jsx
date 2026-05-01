/**
 * Error Boundary Component
 * Catches React errors and displays a friendly message instead of blank screen
 */

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.state = { hasError: true, error, errorInfo };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>Something Went Wrong</h1>
            <p style={styles.message}>
              The dashboard encountered an error while rendering. This might be due to unexpected data format.
            </p>
            <div style={styles.details}>
              <p style={styles.detailsTitle}>Error Details:</p>
              <pre style={styles.errorText}>
                {this.state.error && this.state.error.toString()}
              </pre>
            </div>
            <div style={styles.actions}>
              <button style={styles.reloadButton} onClick={this.handleReset}>
                🔄 Reload Application
              </button>
              <button style={styles.consoleButton} onClick={() => console.log(this.state)}>
                📋 Log Error to Console
              </button>
            </div>
            <p style={styles.hint}>
              💡 Tip: Check the browser console (F12) for more details, or try analyzing tickets again.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px'
  },
  content: {
    maxWidth: '600px',
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    textAlign: 'center'
  },
  icon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1a202c',
    margin: '0 0 15px 0'
  },
  message: {
    fontSize: '16px',
    color: '#718096',
    lineHeight: '1.6',
    marginBottom: '25px'
  },
  details: {
    background: '#f7fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '25px',
    textAlign: 'left'
  },
  detailsTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '10px'
  },
  errorText: {
    fontSize: '13px',
    color: '#991b1b',
    background: '#fee2e2',
    padding: '12px',
    borderRadius: '8px',
    overflow: 'auto',
    maxHeight: '150px',
    margin: 0,
    fontFamily: 'monospace'
  },
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  reloadButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '14px 32px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease'
  },
  consoleButton: {
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    padding: '14px 32px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  hint: {
    fontSize: '14px',
    color: '#4a5568',
    fontStyle: 'italic'
  }
};

export default ErrorBoundary;

// Made with Bob