/**
 * Summary Panel Component
 * Displays aggregate statistics, health score, and visual charts
 */

import React from 'react';

const SummaryPanel = ({ summary }) => {
  if (!summary) return null;

  // Defensive defaults for all summary fields
  const safeSummary = {
    total: summary?.total || 0,
    supportHealthScore: summary?.supportHealthScore || 100,
    criticalTickets: summary?.criticalTickets || 0,
    highUrgency: summary?.highUrgency || 0,
    highRiskCustomers: summary?.highRiskCustomers || 0,
    negativeSentiment: summary?.negativeSentiment || 0,
    escalationsNeeded: summary?.escalationsNeeded || 0,
    averagePriorityScore: summary?.averagePriorityScore || 0,
    topCategory: summary?.topCategory || 'general',
    topIssuePattern: summary?.topIssuePattern || 'No major pattern detected',
    recommendedAction: summary?.recommendedAction || 'Continue monitoring support queue',
    priorityBreakdown: summary?.priorityBreakdown || {},
    riskBreakdown: summary?.riskBreakdown || {},
    categoryBreakdown: summary?.categoryBreakdown || {},
    sentimentBreakdown: summary?.sentimentBreakdown || {}
  };

  // Get health score color
  const getHealthColor = (score) => {
    if (score >= 80) return { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' };
    if (score >= 50) return { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' };
    return { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' };
  };

  const healthColors = getHealthColor(safeSummary.supportHealthScore);

  // Calculate percentages for charts
  const getPercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Support Command Center</h2>
      
      {/* Health Score - Prominent Display */}
      <div style={{...styles.healthScore, background: healthColors.bg, borderColor: healthColors.border}}>
        <div style={styles.healthScoreContent}>
          <span style={styles.healthScoreLabel}>Support Health Score</span>
          <span style={{...styles.healthScoreValue, color: healthColors.color}}>
            {safeSummary.supportHealthScore}/100
          </span>
        </div>
        <div style={styles.healthScoreBar}>
          <div style={{
            ...styles.healthScoreFill,
            width: `${safeSummary.supportHealthScore}%`,
            background: healthColors.color
          }} />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div style={styles.grid}>
        <div style={styles.stat}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statValue}>{safeSummary.total}</div>
          <div style={styles.statLabel}>Total Tickets</div>
        </div>

        <div style={styles.stat}>
          <div style={styles.statIcon}>🔥</div>
          <div style={styles.statValue}>{safeSummary.criticalTickets}</div>
          <div style={styles.statLabel}>Critical</div>
        </div>

        <div style={styles.stat}>
          <div style={styles.statIcon}>🚨</div>
          <div style={styles.statValue}>{safeSummary.highUrgency}</div>
          <div style={styles.statLabel}>High Urgency</div>
        </div>

        <div style={styles.stat}>
          <div style={styles.statIcon}>⚠️</div>
          <div style={styles.statValue}>{safeSummary.highRiskCustomers}</div>
          <div style={styles.statLabel}>High Risk</div>
        </div>

        <div style={styles.stat}>
          <div style={styles.statIcon}>😠</div>
          <div style={styles.statValue}>{safeSummary.negativeSentiment}</div>
          <div style={styles.statLabel}>Negative</div>
        </div>

        <div style={styles.stat}>
          <div style={styles.statIcon}>⬆️</div>
          <div style={styles.statValue}>{safeSummary.escalationsNeeded}</div>
          <div style={styles.statLabel}>Escalations</div>
        </div>

        <div style={styles.stat}>
          <div style={styles.statIcon}>📈</div>
          <div style={styles.statValue}>{safeSummary.averagePriorityScore}</div>
          <div style={styles.statLabel}>Avg Priority</div>
        </div>

        <div style={styles.stat}>
          <div style={styles.statIcon}>🏷️</div>
          <div style={styles.statValue}>{safeSummary.topCategory}</div>
          <div style={styles.statLabel}>Top Category</div>
        </div>
      </div>

      {/* Visual Charts */}
      <div style={styles.chartsSection}>
        <h3 style={styles.chartsTitle}>Distribution Analysis</h3>
        
        {/* Priority Distribution Chart */}
        {Object.keys(safeSummary.priorityBreakdown).length > 0 && (
          <div style={styles.chartContainer}>
            <h4 style={styles.chartTitle}>Priority Levels</h4>
            {Object.entries(safeSummary.priorityBreakdown).map(([level, count]) => {
              const percentage = getPercentage(count, safeSummary.total);
              const colors = {
                critical: '#7f1d1d',
                high: '#991b1b',
                medium: '#92400e',
                low: '#065f46'
              };
              return (
                <div key={level} style={styles.chartRow}>
                  <span style={styles.chartLabel}>{level}</span>
                  <div style={styles.chartBarContainer}>
                    <div 
                      style={{
                        ...styles.chartBar,
                        width: `${percentage}%`,
                        background: colors[level] || '#374151'
                      }}
                    />
                  </div>
                  <span style={styles.chartValue}>{count} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Risk Distribution Chart */}
        {Object.keys(safeSummary.riskBreakdown).length > 0 && (
          <div style={styles.chartContainer}>
            <h4 style={styles.chartTitle}>Customer Risk Levels</h4>
            {Object.entries(safeSummary.riskBreakdown).map(([level, count]) => {
              const percentage = getPercentage(count, safeSummary.total);
              const colors = {
                high: '#991b1b',
                medium: '#9a3412',
                low: '#065f46'
              };
              return (
                <div key={level} style={styles.chartRow}>
                  <span style={styles.chartLabel}>{level}</span>
                  <div style={styles.chartBarContainer}>
                    <div 
                      style={{
                        ...styles.chartBar,
                        width: `${percentage}%`,
                        background: colors[level] || '#374151'
                      }}
                    />
                  </div>
                  <span style={styles.chartValue}>{count} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Category Distribution Chart */}
        {Object.keys(safeSummary.categoryBreakdown).length > 0 && (
          <div style={styles.chartContainer}>
            <h4 style={styles.chartTitle}>Categories</h4>
            {Object.entries(safeSummary.categoryBreakdown).map(([category, count]) => {
              const percentage = getPercentage(count, safeSummary.total);
              const colors = {
                delivery: '#1e40af',
                refund: '#9f1239',
                billing: '#92400e',
                bug: '#991b1b',
                complaint: '#5b21b6',
                general: '#374151'
              };
              return (
                <div key={category} style={styles.chartRow}>
                  <span style={styles.chartLabel}>{category}</span>
                  <div style={styles.chartBarContainer}>
                    <div 
                      style={{
                        ...styles.chartBar,
                        width: `${percentage}%`,
                        background: colors[category] || '#374151'
                      }}
                    />
                  </div>
                  <span style={styles.chartValue}>{count} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Sentiment Distribution Chart */}
        {Object.keys(safeSummary.sentimentBreakdown).length > 0 && (
          <div style={styles.chartContainer}>
            <h4 style={styles.chartTitle}>Sentiment</h4>
            {Object.entries(safeSummary.sentimentBreakdown).map(([sentiment, count]) => {
              const percentage = getPercentage(count, safeSummary.total);
              const colors = {
                angry: '#991b1b',
                frustrated: '#9a3412',
                neutral: '#374151',
                positive: '#065f46'
              };
              return (
                <div key={sentiment} style={styles.chartRow}>
                  <span style={styles.chartLabel}>{sentiment}</span>
                  <div style={styles.chartBarContainer}>
                    <div 
                      style={{
                        ...styles.chartBar,
                        width: `${percentage}%`,
                        background: colors[sentiment] || '#374151'
                      }}
                    />
                  </div>
                  <span style={styles.chartValue}>{count} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Issue Pattern */}
      <div style={styles.issuePattern}>
        <h3 style={styles.issuePatternTitle}>🔍 Top Issue Pattern</h3>
        <p style={styles.issuePatternText}>{safeSummary.topIssuePattern}</p>
      </div>

      {/* Recommended Action */}
      <div style={styles.recommendation}>
        <h3 style={styles.recommendationTitle}>📋 Recommended Action</h3>
        <p style={styles.recommendationText}>{safeSummary.recommendedAction}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1a202c',
    margin: '0 0 25px 0',
    textAlign: 'center'
  },
  healthScore: {
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid',
    marginBottom: '25px'
  },
  healthScoreContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  healthScoreLabel: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2d3748'
  },
  healthScoreValue: {
    fontSize: '32px',
    fontWeight: '800'
  },
  healthScoreBar: {
    width: '100%',
    height: '12px',
    background: '#e2e8f0',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  healthScoreFill: {
    height: '100%',
    transition: 'width 0.5s ease',
    borderRadius: '6px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px',
    marginBottom: '30px'
  },
  stat: {
    textAlign: 'center',
    padding: '15px',
    background: '#f7fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  statIcon: {
    fontSize: '28px',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#2d3748',
    marginBottom: '5px',
    display: 'block'
  },
  statLabel: {
    fontSize: '12px',
    color: '#718096',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  chartsSection: {
    marginBottom: '25px'
  },
  chartsTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 20px 0'
  },
  chartContainer: {
    marginBottom: '20px',
    padding: '15px',
    background: '#f7fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  chartTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 12px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  chartRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px'
  },
  chartLabel: {
    fontSize: '13px',
    color: '#4a5568',
    textTransform: 'capitalize',
    minWidth: '80px',
    fontWeight: '600'
  },
  chartBarContainer: {
    flex: 1,
    height: '24px',
    background: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  chartBar: {
    height: '100%',
    transition: 'width 0.5s ease',
    borderRadius: '4px'
  },
  chartValue: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#2d3748',
    minWidth: '70px',
    textAlign: 'right'
  },
  issuePattern: {
    padding: '15px',
    background: '#dbeafe',
    borderRadius: '12px',
    border: '2px solid #93c5fd',
    marginBottom: '15px'
  },
  issuePatternTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e40af',
    margin: '0 0 8px 0'
  },
  issuePatternText: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#1e3a8a',
    margin: 0,
    fontWeight: '600'
  },
  recommendation: {
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
    borderRadius: '12px',
    border: '2px solid #667eea'
  },
  recommendationTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 10px 0'
  },
  recommendationText: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#4a5568',
    margin: 0,
    fontWeight: '600'
  }
};

export default SummaryPanel;

// Made with Bob
