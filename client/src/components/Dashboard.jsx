/**
 * Dashboard Component
 * Main results view showing analyzed tickets and summary with advanced filtering
 */

import React, { useState, useMemo } from 'react';
import TicketCard from './TicketCard';
import SummaryPanel from './SummaryPanel';
import { exportAsJSON, exportAsCSV } from '../utils/exportUtils';

const Dashboard = ({ analysisResult, onBack, onNewAnalysis, onReset }) => {
  // Defensive defaults for analysisResult
  const safeResult = {
    tickets: analysisResult?.tickets || [],
    summary: analysisResult?.summary || {
      total: 0,
      supportHealthScore: 100,
      topCategory: 'general',
      recommendedAction: 'No tickets analyzed yet'
    }
  };

  // Use state to manage tickets and summary (will be updated from backend)
  const [tickets, setTickets] = useState(safeResult.tickets);
  const [summary, setSummary] = useState(safeResult.summary);

  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [escalationFilter, setEscalationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  // Handle ticket status change from backend
  const handleStatusChange = (updatedTicket, updatedSummary) => {
    // Update the ticket in the list
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
    
    // Update summary if provided
    if (updatedSummary) {
      setSummary(updatedSummary);
    }
  };

  // Filter and sort tickets
  const filteredAndSortedTickets = useMemo(() => {
    let filtered = tickets.filter(ticket => {
      // Search filter - safe access
      if (searchQuery && ticket?.message && !ticket.message.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && ticket?.category !== categoryFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && ticket?.priorityLevel !== priorityFilter) {
        return false;
      }

      // Urgency filter
      if (urgencyFilter !== 'all' && ticket?.urgency !== urgencyFilter) {
        return false;
      }

      // Sentiment filter
      if (sentimentFilter !== 'all' && ticket?.sentiment !== sentimentFilter) {
        return false;
      }

      // Risk filter
      if (riskFilter !== 'all' && ticket?.churnRisk !== riskFilter) {
        return false;
      }

      // Escalation filter
      if (escalationFilter !== 'all') {
        const escalation = ticket?.escalation || 'none';
        if (escalationFilter === 'needed' && escalation === 'none') {
          return false;
        }
        if (escalationFilter === 'none' && escalation !== 'none') {
          return false;
        }
      }

      // Status filter
      const status = ticket?.status || 'open';
      if (statusFilter !== 'all' && status !== statusFilter) {
        return false;
      }

      return true;
    });

    // Sort tickets - safe access
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return (b?.priorityScore || 0) - (a?.priorityScore || 0);
        case 'risk':
          return (b?.customerRiskScore || 0) - (a?.customerRiskScore || 0);
        case 'category':
          return (a?.category || '').localeCompare(b?.category || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [tickets, searchQuery, categoryFilter, priorityFilter, urgencyFilter, sentimentFilter, riskFilter, escalationFilter, statusFilter, sortBy]);

  // Get unique values for filters - safe access
  const categories = [...new Set(tickets.map(t => t?.category).filter(Boolean))];
  const priorities = ['critical', 'high', 'medium', 'low'];
  const urgencies = ['high', 'medium', 'low'];
  const sentiments = ['angry', 'frustrated', 'neutral', 'positive'];
  const risks = ['high', 'medium', 'low'];
  const statuses = ['open', 'reviewed', 'completed'];

  const handleExportJSON = () => {
    exportAsJSON({ tickets, summary }, `queuepilot-analysis-${Date.now()}.json`);
  };

  const handleExportCSV = () => {
    exportAsCSV(tickets, `queuepilot-analysis-${Date.now()}.csv`);
  };

  // Count tickets by status - safe access
  const openCount = tickets.filter(t => (t?.status || 'open') === 'open').length;
  const reviewedCount = tickets.filter(t => (t?.status || 'open') === 'reviewed').length;
  const completedCount = tickets.filter(t => (t?.status || 'open') === 'completed').length;

  // Show empty state if no tickets
  if (tickets.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.header}>
            <div style={styles.headerTop}>
              <button style={styles.backButton} onClick={onBack}>
                ← Back to Home
              </button>
              <div style={styles.headerButtons}>
                <button style={styles.newButton} onClick={onNewAnalysis}>
                  New Analysis
                </button>
                {onReset && (
                  <button style={styles.resetButton} onClick={onReset}>
                    🔄 Reset Demo
                  </button>
                )}
              </div>
            </div>
            <h1 style={styles.title}>Analysis Results</h1>
          </div>
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>📊</div>
            <h2 style={styles.emptyStateTitle}>No Tickets Analyzed Yet</h2>
            <p style={styles.emptyStateText}>
              Load a demo scenario or import tickets from Connected Inbox to begin analyzing support messages.
            </p>
            <div style={styles.emptyStateButtons}>
              <button style={styles.emptyStateButton} onClick={onNewAnalysis}>
                Analyze Tickets
              </button>
              <button style={styles.emptyStateButtonSecondary} onClick={onBack}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <button style={styles.backButton} onClick={onBack}>
              ← Back to Home
            </button>
            <div style={styles.headerButtons}>
              <button style={styles.newButton} onClick={onNewAnalysis}>
                New Analysis
              </button>
              {onReset && (
                <button style={styles.resetButton} onClick={onReset}>
                  🔄 Reset Demo
                </button>
              )}
            </div>
          </div>
          <h1 style={styles.title}>Analysis Results</h1>
          <p style={styles.subtitle}>
            Your tickets have been analyzed and prioritized. Use filters to focus on specific issues.
          </p>
        </div>

        <SummaryPanel summary={summary} />

        <div style={styles.actions}>
          <h2 style={styles.sectionTitle}>Export Results</h2>
          <div style={styles.exportButtons}>
            <button style={styles.exportButton} onClick={handleExportJSON}>
              📥 Export as JSON
            </button>
            <button style={styles.exportButton} onClick={handleExportCSV}>
              📊 Export as CSV
            </button>
          </div>
        </div>

        <div style={styles.ticketsSection}>
          <div style={styles.ticketsHeader}>
            <h2 style={styles.sectionTitle}>
              Analyzed Tickets ({filteredAndSortedTickets.length} of {tickets.length})
            </h2>
            <div style={styles.statusCounts}>
              <span style={styles.statusCount}>
                <span style={{...styles.statusDot, background: '#3b82f6'}}></span>
                Open: {openCount}
              </span>
              <span style={styles.statusCount}>
                <span style={{...styles.statusDot, background: '#f59e0b'}}></span>
                Reviewed: {reviewedCount}
              </span>
              <span style={styles.statusCount}>
                <span style={{...styles.statusDot, background: '#10b981'}}></span>
                Completed: {completedCount}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="🔍 Search tickets by message content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters */}
          <div style={styles.filtersContainer}>
            <div style={styles.filterRow}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Priorities</option>
                {priorities.map(pri => (
                  <option key={pri} value={pri}>{pri}</option>
                ))}
              </select>

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Urgencies</option>
                {urgencies.map(urg => (
                  <option key={urg} value={urg}>{urg}</option>
                ))}
              </select>

              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Sentiments</option>
                {sentiments.map(sent => (
                  <option key={sent} value={sent}>{sent}</option>
                ))}
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Risk Levels</option>
                {risks.map(risk => (
                  <option key={risk} value={risk}>{risk}</option>
                ))}
              </select>

              <select
                value={escalationFilter}
                onChange={(e) => setEscalationFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Escalations</option>
                <option value="needed">Escalation Needed</option>
                <option value="none">No Escalation</option>
              </select>
            </div>

            <div style={styles.filterRow}>
              <label style={styles.sortLabel}>
                Sort by:
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={styles.sortSelect}
                >
                  <option value="priority">Priority Score (High to Low)</option>
                  <option value="risk">Risk Score (High to Low)</option>
                  <option value="category">Category (A-Z)</option>
                </select>
              </label>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setPriorityFilter('all');
                  setUrgencyFilter('all');
                  setSentimentFilter('all');
                  setRiskFilter('all');
                  setEscalationFilter('all');
                  setStatusFilter('all');
                  setSortBy('priority');
                }}
                style={styles.resetButton}
              >
                🔄 Reset All Filters
              </button>
            </div>
          </div>

          {/* Tickets List */}
          <div style={styles.ticketsList}>
            {filteredAndSortedTickets.length > 0 ? (
              filteredAndSortedTickets.map(ticket => (
                <TicketCard
                  key={ticket?.id || Math.random()}
                  ticket={ticket}
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <div style={styles.noResults}>
                <p style={styles.noResultsText}>
                  No tickets match your current filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setPriorityFilter('all');
                    setUrgencyFilter('all');
                    setSentimentFilter('all');
                    setRiskFilter('all');
                    setEscalationFilter('all');
                    setStatusFilter('all');
                  }}
                  style={styles.resetButton}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
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
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  headerButtons: {
    display: 'flex',
    gap: '10px'
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    color: '#667eea',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 16px',
    transition: 'color 0.2s'
  },
  newButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease'
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
  emptyState: {
    background: 'white',
    borderRadius: '12px',
    padding: '60px 30px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  emptyStateIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  emptyStateTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 12px 0'
  },
  emptyStateText: {
    fontSize: '16px',
    color: '#718096',
    marginBottom: '30px',
    lineHeight: '1.6'
  },
  emptyStateButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  emptyStateButton: {
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
  emptyStateButtonSecondary: {
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
  actions: {
    background: 'white',
    borderRadius: '12px',
    padding: '25px 30px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 15px 0'
  },
  exportButtons: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  exportButton: {
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  ticketsSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  ticketsHeader: {
    marginBottom: '20px'
  },
  statusCounts: {
    display: 'flex',
    gap: '20px',
    marginTop: '10px',
    flexWrap: 'wrap'
  },
  statusCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568'
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },
  searchContainer: {
    position: 'relative',
    marginBottom: '20px'
  },
  searchInput: {
    width: '100%',
    padding: '14px 45px 14px 20px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '50px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit'
  },
  clearButton: {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: '#e2e8f0',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4a5568',
    transition: 'background 0.2s'
  },
  filtersContainer: {
    marginBottom: '25px',
    padding: '20px',
    background: '#f7fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  filterRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '12px'
  },
  filterSelect: {
    flex: '1',
    minWidth: '140px',
    padding: '10px 14px',
    fontSize: '14px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'inherit',
    fontWeight: '600',
    color: '#2d3748',
    textTransform: 'capitalize'
  },
  sortLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
    flex: '1'
  },
  sortSelect: {
    padding: '10px 14px',
    fontSize: '14px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'inherit',
    fontWeight: '600',
    color: '#2d3748'
  },
  resetButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  },
  ticketsList: {
    marginTop: '20px'
  },
  noResults: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#f7fafc',
    borderRadius: '12px',
    border: '2px dashed #cbd5e0'
  },
  noResultsText: {
    fontSize: '16px',
    color: '#718096',
    marginBottom: '20px'
  }
};

export default Dashboard;

// Made with Bob
