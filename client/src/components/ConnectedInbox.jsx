/**
 * Connected Inbox Component
 * Allows importing tickets from various support sources
 */

import { useState, useEffect } from 'react';

function ConnectedInbox({ onImportComplete }) {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [importedTickets, setImportedTickets] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);

  // Fetch available sources on mount
  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/import/sources');
      const data = await response.json();
      setSources(data);
    } catch (err) {
      console.error('Error fetching sources:', err);
      setError('Failed to load connector sources');
    }
  };

  const handleLoadDemoImport = async (sourceId) => {
    setLoading(true);
    setError(null);
    setSelectedSource(sourceId);

    try {
      const response = await fetch('http://localhost:3001/api/import/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId })
      });

      if (!response.ok) {
        throw new Error('Failed to load demo import');
      }

      const data = await response.json();
      setImportedTickets(data.tickets);
      console.log('Imported tickets:', data);
    } catch (err) {
      console.error('Error loading demo import:', err);
      setError('Failed to load demo import: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeImported = () => {
    if (importedTickets.length === 0) {
      setError('No tickets to analyze. Please load a demo import first.');
      return;
    }

    // Pass imported tickets to parent for analysis
    onImportComplete(importedTickets);
  };

  const getSourceIcon = (sourceId) => {
    const icons = {
      'website-form': '🌐',
      'ecommerce-support': '🛒',
      'helpdesk-csv': '📊'
    };
    return icons[sourceId] || '📥';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🔗 Connected Inbox</h1>
        <p style={styles.subtitle}>
          Import support tickets from external sources using webhook API or demo connectors
        </p>
      </div>

      {error && (
        <div style={styles.error}>
          <span style={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      {/* Connector Cards */}
      <div style={styles.sourcesGrid}>
        {sources.map(source => (
          <div key={source.id} style={styles.sourceCard}>
            <div style={styles.sourceIcon}>{getSourceIcon(source.id)}</div>
            <h3 style={styles.sourceName}>{source.name}</h3>
            <p style={styles.sourceDescription}>{source.description}</p>
            <button
              style={{
                ...styles.loadButton,
                ...(loading && selectedSource === source.id ? styles.loadButtonDisabled : {})
              }}
              onClick={() => handleLoadDemoImport(source.id)}
              disabled={loading && selectedSource === source.id}
            >
              {loading && selectedSource === source.id ? '⏳ Loading...' : '📥 Load Demo Import'}
            </button>
          </div>
        ))}
      </div>

      {/* Imported Tickets Summary */}
      {importedTickets.length > 0 && (
        <div style={styles.importedSection}>
          <div style={styles.importedHeader}>
            <h2 style={styles.importedTitle}>
              ✅ Imported {importedTickets.length} Tickets
            </h2>
            <button style={styles.analyzeButton} onClick={handleAnalyzeImported}>
              🔍 Analyze Imported Tickets
            </button>
          </div>

          <div style={styles.ticketsList}>
            {importedTickets.slice(0, 5).map(ticket => (
              <div key={ticket.id} style={styles.ticketPreview}>
                <div style={styles.ticketPreviewHeader}>
                  <span style={styles.ticketCustomer}>👤 {ticket.customerName}</span>
                  <span style={styles.ticketSource}>📍 {ticket.source}</span>
                </div>
                <div style={styles.ticketSubject}>{ticket.subject}</div>
                <div style={styles.ticketMessage}>{ticket.message.substring(0, 100)}...</div>
              </div>
            ))}
            {importedTickets.length > 5 && (
              <div style={styles.moreTickets}>
                + {importedTickets.length - 5} more tickets
              </div>
            )}
          </div>
        </div>
      )}

      {/* Webhook API Documentation */}
      <div style={styles.webhookSection}>
        <h2 style={styles.webhookTitle}>📡 Webhook API Integration</h2>
        <p style={styles.webhookDescription}>
          Connect your support tools by sending POST requests to the webhook endpoint:
        </p>
        
        <div style={styles.codeBlock}>
          <div style={styles.codeHeader}>
            <span>POST /api/import/webhook</span>
            <button 
              style={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText('http://localhost:3001/api/import/webhook');
                alert('Endpoint copied to clipboard!');
              }}
            >
              📋 Copy
            </button>
          </div>
          <pre style={styles.code}>{`{
  "source": "Website Contact Form",
  "tickets": [
    {
      "customerName": "Maria",
      "email": "demo@example.com",
      "subject": "Late order",
      "message": "My order is late and nobody answers me."
    }
  ]
}`}</pre>
        </div>

        <div style={styles.webhookFeatures}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>✅</span>
            <span>Compatible with any support tool or contact form</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>✅</span>
            <span>Automatic ticket normalization and ID assignment</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>✅</span>
            <span>Preserves customer information and metadata</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>✅</span>
            <span>Ready for AI analysis and priority scoring</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    color: 'white',
    margin: '0 0 15px 0',
    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
  },
  subtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.9)',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.6'
  },
  error: {
    background: '#fee2e2',
    border: '2px solid #991b1b',
    borderRadius: '12px',
    padding: '15px 20px',
    marginBottom: '30px',
    color: '#991b1b',
    fontSize: '16px',
    fontWeight: '600',
    maxWidth: '1200px',
    margin: '0 auto 30px auto'
  },
  errorIcon: {
    marginRight: '10px'
  },
  sourcesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    maxWidth: '1200px',
    margin: '0 auto 40px auto'
  },
  sourceCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  sourceIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  sourceName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 15px 0'
  },
  sourceDescription: {
    fontSize: '15px',
    color: '#718096',
    lineHeight: '1.6',
    marginBottom: '25px',
    minHeight: '60px'
  },
  loadButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
    width: '100%'
  },
  loadButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  importedSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto 40px auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  importedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  importedTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  analyzeButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    padding: '14px 32px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
    transition: 'all 0.3s ease'
  },
  ticketsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  ticketPreview: {
    background: '#f7fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '15px 20px'
  },
  ticketPreviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  ticketCustomer: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748'
  },
  ticketSource: {
    fontSize: '13px',
    color: '#718096'
  },
  ticketSubject: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '8px'
  },
  ticketMessage: {
    fontSize: '14px',
    color: '#4a5568',
    lineHeight: '1.5'
  },
  moreTickets: {
    textAlign: 'center',
    padding: '15px',
    fontSize: '15px',
    color: '#718096',
    fontWeight: '600'
  },
  webhookSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  webhookTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '15px'
  },
  webhookDescription: {
    fontSize: '16px',
    color: '#718096',
    marginBottom: '25px',
    lineHeight: '1.6'
  },
  codeBlock: {
    background: '#1a202c',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '25px'
  },
  codeHeader: {
    background: '#2d3748',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600'
  },
  copyButton: {
    background: '#4a5568',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    fontSize: '13px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  code: {
    color: '#10b981',
    padding: '20px',
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.6',
    fontFamily: 'monospace',
    overflow: 'auto'
  },
  webhookFeatures: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '15px',
    color: '#2d3748'
  },
  featureIcon: {
    fontSize: '20px'
  }
};

export default ConnectedInbox;

// Made with Bob