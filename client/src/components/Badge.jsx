/**
 * Badge component for displaying category, urgency, sentiment, priority, risk, and team
 */

import React from 'react';

const Badge = ({ type, value, score }) => {
  const getStyles = () => {
    const baseStyles = {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    };

    // Priority level colors
    if (type === 'priority') {
      const priorityColors = {
        critical: { background: '#7f1d1d', color: '#ffffff', border: '1px solid #991b1b' },
        high: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
        medium: { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' },
        low: { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' }
      };
      return { ...baseStyles, ...priorityColors[value] };
    }

    // Risk level colors
    if (type === 'risk') {
      const riskColors = {
        high: { background: '#7f1d1d', color: '#ffffff', border: '1px solid #991b1b' },
        medium: { background: '#fed7aa', color: '#9a3412', border: '1px solid #fdba74' },
        low: { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' }
      };
      return { ...baseStyles, ...riskColors[value] };
    }

    // Team colors
    if (type === 'team') {
      const teamColors = {
        'Senior Support': { background: '#ede9fe', color: '#5b21b6', border: '1px solid #c4b5fd' },
        'Technical Team': { background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' },
        'Finance Team': { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' },
        'Logistics Team': { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' },
        'Support Team': { background: '#e5e7eb', color: '#374151', border: '1px solid #d1d5db' }
      };
      return { ...baseStyles, ...teamColors[value] };
    }

    // Urgency colors
    if (type === 'urgency') {
      const urgencyColors = {
        high: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
        medium: { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' },
        low: { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' }
      };
      return { ...baseStyles, ...urgencyColors[value] };
    }

    // Sentiment colors
    if (type === 'sentiment') {
      const sentimentColors = {
        angry: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
        frustrated: { background: '#fed7aa', color: '#9a3412', border: '1px solid #fdba74' },
        neutral: { background: '#e5e7eb', color: '#374151', border: '1px solid #d1d5db' },
        positive: { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' }
      };
      return { ...baseStyles, ...sentimentColors[value] };
    }

    // Category colors
    if (type === 'category') {
      const categoryColors = {
        delivery: { background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' },
        refund: { background: '#fce7f3', color: '#9f1239', border: '1px solid #f9a8d4' },
        billing: { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' },
        bug: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
        complaint: { background: '#ede9fe', color: '#5b21b6', border: '1px solid #c4b5fd' },
        general: { background: '#e5e7eb', color: '#374151', border: '1px solid #d1d5db' }
      };
      return { ...baseStyles, ...categoryColors[value] };
    }

    return baseStyles;
  };

  // Display score if provided (for priority and risk)
  const displayValue = score !== undefined ? `${value} (${score})` : value;

  return (
    <span style={getStyles()}>
      {displayValue}
    </span>
  );
};

export default Badge;

// Made with Bob
