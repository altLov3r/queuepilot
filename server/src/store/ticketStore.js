/**
 * In-memory ticket store for QueuePilot
 * Manages analyzed tickets and their status during the demo session
 */

class TicketStore {
  constructor() {
    this.latestTickets = [];
    this.latestSummary = null;
    this.selectedScenario = null;
    this.lastAnalyzedAt = null;
    this.importedTickets = [];
    this.importSource = null;
  }

  /**
   * Store analyzed tickets and summary
   */
  setAnalysisResult(tickets, summary, scenarioId = null) {
    // Add status fields to each ticket if not present
    this.latestTickets = tickets.map(ticket => ({
      ...ticket,
      status: ticket.status || 'open',
      reviewed: ticket.reviewed || false,
      completed: ticket.completed || false,
      reviewedAt: ticket.reviewedAt || null,
      completedAt: ticket.completedAt || null
    }));
    
    this.latestSummary = summary;
    this.selectedScenario = scenarioId;
    this.lastAnalyzedAt = new Date().toISOString();
  }

  /**
   * Get all tickets
   */
  getTickets() {
    return this.latestTickets;
  }

  /**
   * Get summary
   */
  getSummary() {
    return this.latestSummary;
  }

  /**
   * Get a single ticket by ID
   */
  getTicketById(id) {
    return this.latestTickets.find(ticket => ticket.id === id);
  }

  /**
   * Update ticket status
   */
  updateTicketStatus(id, updates) {
    const ticketIndex = this.latestTickets.findIndex(ticket => ticket.id === id);
    
    if (ticketIndex === -1) {
      return null;
    }

    // Update the ticket
    this.latestTickets[ticketIndex] = {
      ...this.latestTickets[ticketIndex],
      ...updates
    };

    // Recalculate summary
    this.recalculateSummary();

    return this.latestTickets[ticketIndex];
  }

  /**
   * Mark ticket as reviewed
   */
  markAsReviewed(id) {
    return this.updateTicketStatus(id, {
      reviewed: true,
      status: 'reviewed',
      reviewedAt: new Date().toISOString()
    });
  }

  /**
   * Mark ticket as completed
   */
  markAsCompleted(id) {
    return this.updateTicketStatus(id, {
      completed: true,
      reviewed: true,
      status: 'completed',
      completedAt: new Date().toISOString(),
      reviewedAt: this.getTicketById(id)?.reviewedAt || new Date().toISOString()
    });
  }

  /**
   * Reopen ticket
   */
  reopenTicket(id) {
    return this.updateTicketStatus(id, {
      reviewed: false,
      completed: false,
      status: 'open',
      reviewedAt: null,
      completedAt: null
    });
  }

  /**
   * Recalculate summary based on current ticket statuses
   */
  recalculateSummary() {
    if (!this.latestSummary || this.latestTickets.length === 0) {
      return;
    }

    const openTickets = this.latestTickets.filter(t => t.status === 'open').length;
    const reviewedTickets = this.latestTickets.filter(t => t.reviewed && !t.completed).length;
    const completedTickets = this.latestTickets.filter(t => t.completed).length;
    const total = this.latestTickets.length;

    // Count pending critical and high risk tickets (not completed)
    const pendingCriticalTickets = this.latestTickets.filter(
      t => !t.completed && t.priorityLevel === 'critical'
    ).length;
    
    const pendingHighRiskTickets = this.latestTickets.filter(
      t => !t.completed && t.churnRisk === 'high'
    ).length;

    // Update summary with status counts
    this.latestSummary = {
      ...this.latestSummary,
      openTickets,
      reviewedTickets,
      completedTickets,
      completionRate: total > 0 ? Math.round((completedTickets / total) * 100) : 0,
      pendingCriticalTickets,
      pendingHighRiskTickets,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Store imported tickets (not yet analyzed)
   */
  setImportedTickets(tickets, source) {
    this.importedTickets = tickets;
    this.importSource = source;
  }

  /**
   * Get imported tickets
   */
  getImportedTickets() {
    return this.importedTickets;
  }

  /**
   * Get import source
   */
  getImportSource() {
    return this.importSource;
  }

  /**
   * Clear imported tickets
   */
  clearImportedTickets() {
    this.importedTickets = [];
    this.importSource = null;
  }

  /**
   * Clear all data
   */
  clear() {
    this.latestTickets = [];
    this.latestSummary = null;
    this.selectedScenario = null;
    this.lastAnalyzedAt = null;
    this.importedTickets = [];
    this.importSource = null;
  }

  /**
   * Get store metadata
   */
  getMetadata() {
    return {
      ticketCount: this.latestTickets.length,
      selectedScenario: this.selectedScenario,
      lastAnalyzedAt: this.lastAnalyzedAt,
      hasData: this.latestTickets.length > 0,
      importedCount: this.importedTickets.length,
      importSource: this.importSource
    };
  }
}

// Create singleton instance
const ticketStore = new TicketStore();

export default ticketStore;

// Made with Bob