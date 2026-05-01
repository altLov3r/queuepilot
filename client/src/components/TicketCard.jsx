/**
 * Ticket Card Component
 * Displays individual ticket with all analysis details and status management
 */

import React, { useState } from 'react';
import Badge from './Badge';

const TicketCard = ({ ticket, onStatusChange }) => {
  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Defensive defaults for all ticket fields
  const safeTicket = {
    id: ticket?.id || 0,
    message: ticket?.message || '',
    category: ticket?.category || 'general',
    urgency: ticket?.urgency || 'low',
    sentiment: ticket?.sentiment || 'neutral',
    suggestedReply: ticket?.suggestedReply || 'No reply generated',
    internalAction: ticket?.internalAction || 'No action specified',
    priorityScore: ticket?.priorityScore || 0,
    priorityLevel: ticket?.priorityLevel || 'low',
    customerRiskScore: ticket?.customerRiskScore || 0,
    churnRisk: ticket?.churnRisk || 'low',
    team: ticket?.team || 'Support Team',
    escalation: ticket?.escalation || 'none',
    slaTime: ticket?.slaTime || '24 hours',
    status: ticket?.status || 'open',
    reviewed: ticket?.reviewed || false,
    completed: ticket?.completed || false,
    reviewedAt: ticket?.reviewedAt || null,
    completedAt: ticket?.completedAt || null,
    source: ticket?.source || null,
    customerName: ticket?.customerName || null,
    email: ticket?.email || null,
    subject: ticket?.subject || null
  };

  const handleCopyReply = async () => {
    try {
      await navigator.clipboard.writeText(safeTicket.suggestedReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleStatusUpdate = async (action) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/tickets/${safeTicket.id}/${action}`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} ticket`);
      }

      const data = await response.json();
      
      // Notify parent component with updated ticket and summary
      if (onStatusChange) {
        onStatusChange(data.ticket, data.summary);
      }
    } catch (err) {
      console.error(`Error updating ticket status:`, err);
      alert(`Failed to ${action} ticket. Please try again.`);
    } finally {
      setUpdating(false);
    }
  };

  const getPriorityColor = (level) => {
    const colors = {
      critical: '#7f1d1d',
      high: '#991b1b',
      medium: '#92400e',
      low: '#065f46'
    };
    return colors[level] || '#374151';
  };

  const getStatusBadgeStyle = (status) => {
    const styles = {
      open: { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
      reviewed: { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
      completed: { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' }
    };
    return styles[status] || styles.open;
  };

  const statusStyle = getStatusBadgeStyle(safeTicket.status);
  const isCompleted = safeTicket.status === 'completed';
  const isReviewed = safeTicket.status === 'reviewed';
  const isOpen = safeTicket.status === 'open';

  return (
    <div style={{
      ...styles.card,
      borderLeft: `4px solid ${getPriorityColor(safeTicket.priorityLevel)}`,
      opacity: isCompleted ? 0.7 : 1
    }}>
      {/* Import Source Info */}
      {safeTicket.source && (
        <div style={styles.importInfo}>
          <div style={styles.importBadge}>
            📍 {safeTicket.source}
          </div>
          {safeTicket.customerName && (
            <div style={styles.customerInfo}>
              👤 {safeTicket.customerName}
              {safeTicket.email && <span style={styles.email}> ({safeTicket.email})</span>}
            </div>
          )}
          {safeTicket.subject && (
            <div style={styles.subjectInfo}>
              📧 <strong>Subject:</strong> {safeTicket.subject}
            </div>
          )}
        </div>
      )}
      {/* Header with ID and Status */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.ticketId}>Ticket #{safeTicket.id}</span>
          <div style={{
            ...styles.statusBadge,
            background: statusStyle.bg,
            color: statusStyle.color,
            border: `2px solid ${statusStyle.border}`
          }}>
            {safeTicket.status.toUpperCase()}
          </div>
        </div>
        <div style={styles.headerRight}>
          <Badge type="priority" level={safeTicket.priorityLevel} score={safeTicket.priorityScore} />
          <Badge type="risk" level={safeTicket.churnRisk} score={safeTicket.customerRiskScore} />
        </div>
      </div>

      {/* Main Badges Row */}
      <div style={styles.badgesRow}>
        <Badge type="category" value={safeTicket.category} />
        <Badge type="urgency" value={safeTicket.urgency} />
        <Badge type="sentiment" value={safeTicket.sentiment} />
        <Badge type="team" value={safeTicket.team} />
      </div>

      {/* Escalation Warning */}
      {safeTicket.escalation && safeTicket.escalation !== 'none' && !isCompleted && (
        <div style={styles.escalationWarning}>
          ⚠️ <strong>Escalation Required:</strong> {safeTicket.escalation}
        </div>
      )}

      {/* Message */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Customer Message</h4>
        <p style={styles.message}>{safeTicket.message}</p>
      </div>

      {/* Suggested Reply */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h4 style={styles.sectionTitle}>Suggested Reply</h4>
          <button
            style={styles.copyButton}
            onClick={handleCopyReply}
            disabled={copied}
          >
            {copied ? '✓ Copied!' : '📋 Copy Reply'}
          </button>
        </div>
        <p style={styles.reply}>{safeTicket.suggestedReply}</p>
      </div>

      {/* Internal Action */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Internal Action</h4>
        <p style={styles.action}>{safeTicket.internalAction}</p>
      </div>

      {/* Metrics Row */}
      <div style={styles.metricsRow}>
        <div style={styles.metric}>
          <span style={styles.metricLabel}>SLA:</span>
          <span style={styles.metricValue}>{safeTicket.slaTime}</span>
        </div>
        <div style={styles.metric}>
          <span style={styles.metricLabel}>Team:</span>
          <span style={styles.metricValue}>{safeTicket.team}</span>
        </div>
        {safeTicket.escalation && safeTicket.escalation !== 'none' && (
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Escalate to:</span>
            <span style={styles.metricValue}>{safeTicket.escalation}</span>
          </div>
        )}
      </div>

      {/* Status Timestamps */}
      {(safeTicket.reviewedAt || safeTicket.completedAt) && (
        <div style={styles.timestamps}>
          {safeTicket.reviewedAt && (
            <div style={styles.timestamp}>
              ✓ Reviewed: {new Date(safeTicket.reviewedAt).toLocaleString()}
            </div>
          )}
          {safeTicket.completedAt && (
            <div style={styles.timestamp}>
              ✓ Completed: {new Date(safeTicket.completedAt).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        {isOpen && (
          <>
            <button
              style={styles.reviewButton}
              onClick={() => handleStatusUpdate('review')}
              disabled={updating}
            >
              {updating ? 'Updating...' : '👁️ Mark as Reviewed'}
            </button>
            <button
              style={styles.completeButton}
              onClick={() => handleStatusUpdate('complete')}
              disabled={updating}
            >
              {updating ? 'Updating...' : '✓ Mark as Completed'}
            </button>
          </>
        )}
        
        {isReviewed && (
          <>
            <button
              style={styles.completeButton}
              onClick={() => handleStatusUpdate('complete')}
              disabled={updating}
            >
              {updating ? 'Updating...' : '✓ Mark as Completed'}
            </button>
            <button
              style={styles.reopenButton}
              onClick={() => handleStatusUpdate('reopen')}
              disabled={updating}
            >
              {updating ? 'Updating...' : '↺ Reopen'}
            </button>
          </>
        )}
        
        {isCompleted && (
          <button
            style={styles.reopenButton}
            onClick={() => handleStatusUpdate('reopen')}
            disabled={updating}
          >
            {updating ? 'Updating...' : '↺ Reopen Ticket'}
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  headerRight: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  ticketId: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#4a5568'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px'
  },
  badgesRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '16px'
  },
  escalationWarning: {
    padding: '12px 16px',
    background: '#fef3c7',
    border: '2px solid #fcd34d',
    borderRadius: '8px',
    color: '#92400e',
    fontSize: '14px',
    marginBottom: '16px',
    fontWeight: '600'
  },
  section: {
    marginBottom: '16px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  message: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#2d3748',
    margin: 0,
    padding: '12px',
    background: '#f7fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  reply: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#2d3748',
    margin: 0,
    padding: '12px',
    background: '#f0f4ff',
    borderRadius: '8px',
    border: '1px solid #c7d2fe'
  },
  action: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#2d3748',
    margin: 0,
    padding: '12px',
    background: '#fef3c7',
    borderRadius: '8px',
    border: '1px solid #fcd34d',
    fontWeight: '600'
  },
  copyButton: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  metricsRow: {
    display: 'flex',
    gap: '20px',
    padding: '12px',
    background: '#f7fafc',
    borderRadius: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap'
  },
  metric: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center'
  },
  metricLabel: {
    fontSize: '12px',
    color: '#718096',
    fontWeight: '600'
  },
  metricValue: {
    fontSize: '12px',
    color: '#2d3748',
    fontWeight: '700'
  },
  timestamps: {
    padding: '12px',
    background: '#f7fafc',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  timestamp: {
    fontSize: '12px',
    color: '#4a5568',
    marginBottom: '4px'
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  reviewButton: {
    flex: 1,
    minWidth: '150px',
    background: '#fbbf24',
    color: '#78350f',
    border: 'none',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  completeButton: {
    flex: 1,
    minWidth: '150px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  reopenButton: {
    flex: 1,
    minWidth: '150px',
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  importInfo: {
    background: '#eff6ff',
    border: '2px solid #bfdbfe',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '16px'
  },
  importBadge: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: '8px'
  },
  customerInfo: {
    fontSize: '13px',
    color: '#1e3a8a',
    marginBottom: '6px',
    fontWeight: '600'
  },
  email: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '400'
  },
  subjectInfo: {
    fontSize: '13px',
    color: '#1e3a8a',
    lineHeight: '1.5'
  }
};

export default TicketCard;

// Made with Bob
