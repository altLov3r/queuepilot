/**
 * Ticket Input Component
 * Allows users to paste tickets or load demo data with scenario selection
 */

import React, { useState, useEffect } from 'react';

// API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const TicketInput = ({ onAnalyze, onBack, onReset }) => {
  const [ticketText, setTicketText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState('normal');
  const [loadingScenarios, setLoadingScenarios] = useState(true);

  // Load available scenarios on mount
  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      const response = await fetch(`${API_URL}/api/demo-scenarios`);
      if (!response.ok) throw new Error('Failed to load scenarios');
      
      const data = await response.json();
      setScenarios(data.scenarios);
    } catch (err) {
      console.error('Failed to load scenarios:', err);
      // Set default scenarios if API fails
      setScenarios([
        { id: 'normal', name: 'Normal Day', description: 'Balanced mix of tickets', ticketCount: 15 },
        { id: 'crisis', name: 'Crisis Mode', description: 'High urgency situations', ticketCount: 10 },
        { id: 'smooth', name: 'Smooth Operations', description: 'Positive feedback', ticketCount: 10 },
        { id: 'delivery', name: 'Delivery Crisis', description: 'Shipping issues', ticketCount: 10 },
        { id: 'billing', name: 'Billing Complaints', description: 'Payment problems', ticketCount: 10 }
      ]);
    } finally {
      setLoadingScenarios(false);
    }
  };

  const handleLoadDemo = async () => {
    setLoading(true);
    setError('');
    
    try {
      const url = `${API_URL}/api/demo-tickets/${selectedScenario}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load demo tickets');
      
      const data = await response.json();
      const demoText = data.tickets
        .map((ticket, index) => `Ticket ${index + 1}:\n${ticket.message}`)
        .join('\n\n---\n\n');
      
      setTicketText(demoText);
    } catch (err) {
      setError('Failed to load demo tickets. Please check if the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!ticketText.trim()) {
      setError('Please enter some tickets to analyze');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Parse tickets from text
      const tickets = parseTickets(ticketText);
      
      if (tickets.length === 0) {
        setError('No valid tickets found. Please enter at least one ticket.');
        setLoading(false);
        return;
      }

      // Call API to analyze with scenario ID
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tickets,
          scenarioId: selectedScenario
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      onAnalyze(result);
      
    } catch (err) {
      setError('Failed to analyze tickets. Please check if the backend is running on http://localhost:3001');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parseTickets = (text) => {
    // Split by separator or by double newlines
    const parts = text.split(/---+|\n\n\n+/);
    
    return parts
      .map((part, index) => {
        const message = part
          .replace(/^Ticket \d+:\s*/i, '')
          .trim();
        
        if (message.length > 10) {
          return {
            id: index + 1,
            message
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  const getScenarioEmoji = (scenarioId) => {
    const emojis = {
      normal: '📊',
      crisis: '🚨',
      smooth: '✅',
      delivery: '📦',
      billing: '💳'
    };
    return emojis[scenarioId] || '📋';
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.headerButtons}>
            <button style={styles.backButton} onClick={onBack}>
              ← Back
            </button>
            {onReset && (
              <button style={styles.resetButton} onClick={onReset}>
                🔄 Reset Demo
              </button>
            )}
          </div>
          <h1 style={styles.title}>Enter Support Tickets</h1>
          <p style={styles.subtitle}>
            {ticketText.trim()
              ? `${parseTickets(ticketText).length} tickets ready to analyze`
              : 'Load a demo scenario or paste your own support messages to begin'}
          </p>
        </div>

        {/* Scenario Selector */}
        <div style={styles.scenarioSection}>
          <h3 style={styles.scenarioTitle}>📋 Demo Scenarios</h3>
          <p style={styles.scenarioSubtitle}>
            Choose a scenario to see how QueuePilot handles different support situations
          </p>
          
          {loadingScenarios ? (
            <div style={styles.scenarioLoading}>Loading scenarios...</div>
          ) : (
            <div style={styles.scenarioGrid}>
              {scenarios.map(scenario => (
                <div
                  key={scenario.id}
                  style={{
                    ...styles.scenarioCard,
                    ...(selectedScenario === scenario.id ? styles.scenarioCardActive : {})
                  }}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <div style={styles.scenarioEmoji}>
                    {getScenarioEmoji(scenario.id)}
                  </div>
                  <div style={styles.scenarioName}>{scenario.name}</div>
                  <div style={styles.scenarioDescription}>{scenario.description}</div>
                  {scenario.ticketCount && (
                    <div style={styles.scenarioCount}>{scenario.ticketCount} tickets</div>
                  )}
                  {selectedScenario === scenario.id && (
                    <div style={styles.scenarioCheck}>✓</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.inputSection}>
          <textarea
            style={styles.textarea}
            value={ticketText}
            onChange={(e) => setTicketText(e.target.value)}
            placeholder="Paste your support tickets here...&#10;&#10;Separate multiple tickets with '---' or blank lines.&#10;&#10;Example:&#10;My order is late and I'm very frustrated!&#10;&#10;---&#10;&#10;Thank you for the great service!"
            disabled={loading}
          />
          
          <div style={styles.info}>
            <p style={styles.infoText}>
              💡 Tip: Separate multiple tickets with "---" or blank lines
            </p>
          </div>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <div style={styles.actions}>
          <button
            style={styles.demoButton}
            onClick={handleLoadDemo}
            disabled={loading}
          >
            {loading ? 'Loading...' : `Load ${scenarios.find(s => s.id === selectedScenario)?.name || 'Demo'} Tickets`}
          </button>
          
          <button
            style={styles.analyzeButton}
            onClick={handleAnalyze}
            disabled={loading || !ticketText.trim()}
          >
            {loading ? 'Analyzing...' : 'Analyze Tickets'}
          </button>
        </div>

        {!ticketText.trim() && !loading && (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>📋</div>
            <h3 style={styles.emptyStateTitle}>No Tickets Yet</h3>
            <p style={styles.emptyStateText}>
              Choose a demo scenario above and click "Load Tickets", or paste your own support messages in the text area.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px'
  },
  headerButtons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  resetButton: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    marginTop: '20px'
  },
  emptyStateIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  emptyStateTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'white',
    margin: '0 0 12px 0'
  },
  emptyStateText: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: '1.6',
    margin: 0
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center'
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    color: '#667eea',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 16px',
    marginBottom: '20px',
    transition: 'color 0.2s',
    float: 'left'
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#1a202c',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#718096',
    margin: 0,
    lineHeight: '1.6'
  },
  scenarioSection: {
    marginBottom: '30px',
    padding: '25px',
    background: '#f7fafc',
    borderRadius: '12px',
    border: '2px solid #e2e8f0'
  },
  scenarioTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 8px 0'
  },
  scenarioSubtitle: {
    fontSize: '14px',
    color: '#718096',
    margin: '0 0 20px 0'
  },
  scenarioLoading: {
    textAlign: 'center',
    padding: '20px',
    color: '#718096',
    fontSize: '14px'
  },
  scenarioGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px'
  },
  scenarioCard: {
    position: 'relative',
    padding: '20px 15px',
    background: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  },
  scenarioCardActive: {
    borderColor: '#667eea',
    background: '#f0f4ff',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
  },
  scenarioEmoji: {
    fontSize: '32px',
    marginBottom: '8px'
  },
  scenarioName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '4px'
  },
  scenarioDescription: {
    fontSize: '12px',
    color: '#718096',
    lineHeight: '1.4',
    marginBottom: '4px'
  },
  scenarioCount: {
    fontSize: '11px',
    color: '#667eea',
    fontWeight: '600'
  },
  scenarioCheck: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '20px',
    height: '20px',
    background: '#667eea',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700'
  },
  inputSection: {
    marginBottom: '20px'
  },
  textarea: {
    width: '100%',
    minHeight: '400px',
    padding: '20px',
    fontSize: '15px',
    lineHeight: '1.6',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  },
  info: {
    marginTop: '15px',
    padding: '15px',
    background: '#f7fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  infoText: {
    margin: 0,
    fontSize: '14px',
    color: '#4a5568'
  },
  error: {
    padding: '15px',
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    color: '#991b1b',
    marginBottom: '20px',
    fontSize: '14px'
  },
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  demoButton: {
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
  analyzeButton: {
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
  stats: {
    textAlign: 'center'
  },
  statsText: {
    fontSize: '14px',
    color: '#718096',
    margin: 0
  }
};

export default TicketInput;

// Made with Bob
