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

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing'); // landing, input, dashboard, connected-inbox
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleStartDemo = () => {
    setCurrentScreen('input');
  };

  const handleConnectedInbox = () => {
    setCurrentScreen('connected-inbox');
  };

  const handleAnalyze = (result) => {
    setAnalysisResult(result);
    setCurrentScreen('dashboard');
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
      alert('Failed to analyze imported tickets. Please try again.');
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen('landing');
    setAnalysisResult(null);
  };

  const handleNewAnalysis = () => {
    setCurrentScreen('input');
    setAnalysisResult(null);
  };

  const handleBackToInput = () => {
    setCurrentScreen('input');
  };

  return (
    <div className="App">
      {currentScreen === 'landing' && (
        <LandingPage
          onStartDemo={handleStartDemo}
          onConnectedInbox={handleConnectedInbox}
        />
      )}
      
      {currentScreen === 'input' && (
        <TicketInput
          onAnalyze={handleAnalyze}
          onBack={handleBackToHome}
        />
      )}

      {currentScreen === 'connected-inbox' && (
        <ConnectedInbox
          onImportComplete={handleImportComplete}
        />
      )}
      
      {currentScreen === 'dashboard' && analysisResult && (
        <Dashboard
          analysisResult={analysisResult}
          onBack={handleBackToHome}
          onNewAnalysis={handleNewAnalysis}
        />
      )}
    </div>
  );
}

export default App;

// Made with Bob
