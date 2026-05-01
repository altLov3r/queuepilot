/**
 * Export utilities for QueuePilot
 * Functions to export analysis results as JSON and CSV
 */

/**
 * Export data as JSON file
 */
export function exportAsJSON(data, filename = 'queuepilot-analysis.json') {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  downloadBlob(blob, filename);
}

/**
 * Export data as CSV file
 */
export function exportAsCSV(tickets, filename = 'queuepilot-analysis.csv') {
  // CSV headers - now includes all fields including status and import fields
  const headers = [
    'ID',
    'Status',
    'Source',
    'Customer Name',
    'Email',
    'Subject',
    'Message',
    'Category',
    'Urgency',
    'Sentiment',
    'Priority Score',
    'Priority Level',
    'Customer Risk Score',
    'Churn Risk',
    'Team',
    'Escalation',
    'SLA Time',
    'Reviewed',
    'Completed',
    'Reviewed At',
    'Completed At',
    'Suggested Reply',
    'Internal Action'
  ];
  
  // Convert tickets to CSV rows
  const rows = tickets.map(ticket => [
    ticket.id,
    ticket.status || 'open',
    ticket.source || '',
    ticket.customerName || '',
    ticket.email || '',
    `"${escapeCSV(ticket.subject || '')}"`,
    `"${escapeCSV(ticket.message)}"`,
    ticket.category,
    ticket.urgency,
    ticket.sentiment,
    ticket.priorityScore || 0,
    ticket.priorityLevel || 'low',
    ticket.customerRiskScore || 0,
    ticket.churnRisk || 'low',
    ticket.team || 'Support Team',
    ticket.escalation || 'none',
    ticket.slaTime || '24 hours',
    ticket.reviewed ? 'Yes' : 'No',
    ticket.completed ? 'Yes' : 'No',
    ticket.reviewedAt || '',
    ticket.completedAt || '',
    `"${escapeCSV(ticket.suggestedReply)}"`,
    `"${escapeCSV(ticket.internalAction)}"`
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

/**
 * Escape special characters for CSV
 */
function escapeCSV(str) {
  if (!str) return '';
  return str.replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, '');
}

/**
 * Download a blob as a file
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

export default {
  exportAsJSON,
  exportAsCSV,
  copyToClipboard
};

// Made with Bob
