/**
 * Main App Component
 * Manages application state and navigation between screens
 */

import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import TicketInput from './components/TicketInput';
import Dashboard from './components/Dashboard';
import ConnectedInbox from './components/ConnectedInbox';
import './App.css';

// API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing'); // landing, input, dashboard, connected-inbox
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleStartDemo = () => {
    setCurrentScreen('input');
    setError(null);
  };

  const handleConnectedInbox = () => {
    setCurrentScreen('connected-inbox');
    setError(null);
  };

  const handleAnalyze = (result) => {
    setAnalysisResult(result);
    setCurrentScreen('dashboard');
    setError(null);
  };

  // Judge Demo Mode: Load crisis scenario and auto-analyze
  const handleJudgeDemo = async () => {
    setError(null);
    try {
      // Load crisis mode demo tickets
      const response = await fetch(`${API_URL}/api/demo-tickets/crisis`);
      if (!response.ok) throw new Error('Failed to load demo tickets');
      
      const data = await response.json();
      
      // Analyze the tickets
      const analyzeResponse = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tickets: data.tickets.map((t, i) => ({ id: i + 1, message: t.message })),
          scenarioId: 'crisis'
        })
      });

      if (!analyzeResponse.ok) throw new Error('Analysis failed');

      const result = await analyzeResponse.json();
      handleAnalyze(result);
    } catch (err) {
      console.error('Judge Demo Mode error:', err);
      setError('Failed to load Judge Demo Mode. Please check if the backend is running.');
      // Still navigate to input screen so user can try manually
      setCurrentScreen('input');
    }
  };

  // Reset Demo: Clear all state and return to landing
  const handleResetDemo = () => {
    setCurrentScreen('landing');
    setAnalysisResult(null);
    setError(null);
  };

  const handleImportComplete = async (importedTickets) => {
    // Convert imported tickets to the format expected by analyze endpoint
    const ticketsForAnalysis = importedTickets.map(ticket => ({
      id: ticket.id,
      message: ticket.message
    }));

    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickets: ticketsForAnalysis })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      
      // Merge imported ticket metadata with analysis results
      const enrichedTickets = result.tickets.map(analyzedTicket => {
        const importedTicket = importedTickets.find(t => t.id === analyzedTicket.id);
        return {
          ...analyzedTicket,
          source: importedTicket?.source || 'Unknown',
          customerName: importedTicket?.customerName || 'Unknown',
          email: importedTicket?.email || '',
          subject: importedTicket?.subject || 'No subject'
        };
      });

      const enrichedResult = {
        ...result,
        tickets: enrichedTickets
      };

      handleAnalyze(enrichedResult);
    } catch (error) {
      console.error('Error analyzing imported tickets:', error);
      setError('Failed to analyze imported tickets. Please check if the backend is running.');
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen('landing');
    setAnalysisResult(null);
    setError(null);
  };

  const handleNewAnalysis = () => {
    setCurrentScreen('input');
    setAnalysisResult(null);
    setError(null);
  };

  const handleBackToInput = () => {
    setCurrentScreen('input');
    setError(null);
  };

  return (
    <div className="App">
      {/* Global Error Display */}
      {error && (
        <div style={styles.errorBanner}>
          <span style={styles.errorIcon}>⚠️</span>
          <span style={styles.errorText}>{error}</span>
          <button style={styles.errorClose} onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {currentScreen === 'landing' && (
        <LandingPage
          onStartDemo={handleStartDemo}
          onConnectedInbox={handleConnectedInbox}
          onJudgeDemo={handleJudgeDemo}
        />
      )}
      
      {currentScreen === 'input' && (
        <TicketInput
          onAnalyze={handleAnalyze}
          onBack={handleBackToHome}
          onReset={handleResetDemo}
        />
      )}

      {currentScreen === 'connected-inbox' && (
        <ConnectedInbox
          onImportComplete={handleImportComplete}
          onBack={handleBackToHome}
          onReset={handleResetDemo}
        />
      )}
      
      {currentScreen === 'dashboard' && analysisResult && (
        <Dashboard
          analysisResult={analysisResult}
          onBack={handleBackToHome}
          onNewAnalysis={handleNewAnalysis}
          onReset={handleResetDemo}
        />
      )}
    </div>
  );
}

const styles = {
  errorBanner: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: '#fee2e2',
    borderBottom: '2px solid #ef4444',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 9999,
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
  },
  errorIcon: {
    fontSize: '20px'
  },
  errorText: {
    flex: 1,
    color: '#991b1b',
    fontWeight: '600',
    fontSize: '14px'
  },
  errorClose: {
    background: 'transparent',
    border: 'none',
    color: '#991b1b',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background 0.2s'
  }
};

export default App;

// Made with Bob
