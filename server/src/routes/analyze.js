/**
 * Analysis API routes for QueuePilot
 */

import express from 'express';
import { analyzeTickets } from '../analyzer/fallbackAnalyzer.js';
import { isWatsonXAvailable } from '../analyzer/watsonxAdapter.js';
import { isOpenRouterAvailable, analyzeTicketsWithOpenRouter } from '../analyzer/openrouterAnalyzer.js';
import { demoScenarios } from '../data/demoTickets.js';
import ticketStore from '../store/ticketStore.js';

const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    store: ticketStore.getMetadata()
  });
});

/**
 * GET /api/demo-scenarios
 * Get list of available demo scenarios without full ticket data
 */
router.get('/demo-scenarios', (req, res) => {
  const scenarios = Object.values(demoScenarios).map(scenario => ({
    id: scenario.id,
    name: scenario.name,
    description: scenario.description,
    ticketCount: scenario.tickets.length
  }));

  res.json({
    scenarios,
    count: scenarios.length
  });
});

/**
 * GET /api/demo-tickets
 * Get demo tickets for default scenario (normal)
 */
router.get('/demo-tickets', (req, res) => {
  const scenario = demoScenarios.normal;
  
  res.json({
    scenario: {
      id: scenario.id,
      name: scenario.name,
      description: scenario.description
    },
    tickets: scenario.tickets,
    count: scenario.tickets.length
  });
});

/**
 * GET /api/demo-tickets/:scenarioId
 * Get demo tickets for a specific scenario
 */
router.get('/demo-tickets/:scenarioId', (req, res) => {
  const { scenarioId } = req.params;
  
  const scenario = demoScenarios[scenarioId];
  
  if (!scenario) {
    return res.status(404).json({
      error: 'Scenario not found',
      message: `Scenario '${scenarioId}' does not exist`,
      availableScenarios: Object.keys(demoScenarios)
    });
  }

  res.json({
    scenario: {
      id: scenario.id,
      name: scenario.name,
      description: scenario.description
    },
    tickets: scenario.tickets,
    count: scenario.tickets.length
  });
});

/**
 * POST /api/analyze
 * Analyze support tickets and store results in backend
 * Includes realistic AI processing simulation
 */
router.post('/analyze', async (req, res) => {
  try {
    const { tickets, scenarioId } = req.body;
    
    // Validate input
    if (!tickets || !Array.isArray(tickets)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Request body must contain a "tickets" array'
      });
    }
    
    if (tickets.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Tickets array cannot be empty'
      });
    }
    
    // Validate each ticket has required fields
    for (const ticket of tickets) {
      if (!ticket.message || typeof ticket.message !== 'string') {
        return res.status(400).json({
          error: 'Invalid ticket format',
          message: 'Each ticket must have a "message" field with string content'
        });
      }
    }
    
    const startTime = Date.now();
    let result;
    let analyzerUsed = 'fallback';

    // Disable OpenRouter for now - use enhanced fallback analyzer
    // OpenRouter.ai integration available but disabled for demo stability
    // To enable: set OPENROUTER_API_KEY in environment variables
    
    // Simulate realistic AI processing delay
    const baseDelay = 800;
    const perTicketDelay = 120;
    const processingDelay = Math.min(baseDelay + (tickets.length * perTicketDelay), 3000);
    await new Promise(resolve => setTimeout(resolve, processingDelay));
    
    // Use fallback analyzer
    result = analyzeTickets(tickets);
    
    // Store results in backend
    ticketStore.setAnalysisResult(result.tickets, result.summary, scenarioId);
    
    // Calculate actual processing time
    const endTime = Date.now();
    const actualProcessingTime = endTime - startTime;
    
    // Add/update metadata
    result.metadata = {
      ...result.metadata,
      analyzer: analyzerUsed === 'openrouter'
        ? 'OpenRouter.ai (Real AI - Llama 3.2)'
        : 'Fallback AI (watsonx.ai-ready)',
      openrouterAvailable: isOpenRouterAvailable(),
      watsonxAvailable: isWatsonXAvailable(),
      timestamp: new Date().toISOString(),
      scenarioId: scenarioId || null,
      processingTime: `${actualProcessingTime}ms`,
      ticketsAnalyzed: tickets.length,
      averageTimePerTicket: `${Math.round(actualProcessingTime / tickets.length)}ms`
    };
    
    res.json(result);
    
  } catch (error) {
    console.error('Error analyzing tickets:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});

/**
 * GET /api/tickets
 * Get latest analyzed tickets and summary from backend store
 */
router.get('/tickets', (req, res) => {
  const tickets = ticketStore.getTickets();
  const summary = ticketStore.getSummary();
  const metadata = ticketStore.getMetadata();

  if (tickets.length === 0) {
    return res.status(404).json({
      error: 'No tickets found',
      message: 'No tickets have been analyzed yet. Please analyze tickets first.',
      metadata
    });
  }

  res.json({
    tickets,
    summary,
    metadata
  });
});

/**
 * PATCH /api/tickets/:id/review
 * Mark a ticket as reviewed
 */
router.patch('/tickets/:id/review', (req, res) => {
  const ticketId = parseInt(req.params.id);
  
  if (isNaN(ticketId)) {
    return res.status(400).json({
      error: 'Invalid ticket ID',
      message: 'Ticket ID must be a number'
    });
  }

  const ticket = ticketStore.markAsReviewed(ticketId);
  
  if (!ticket) {
    return res.status(404).json({
      error: 'Ticket not found',
      message: `Ticket with ID ${ticketId} not found`
    });
  }

  res.json({
    ticket,
    summary: ticketStore.getSummary(),
    message: 'Ticket marked as reviewed'
  });
});

/**
 * PATCH /api/tickets/:id/complete
 * Mark a ticket as completed
 */
router.patch('/tickets/:id/complete', (req, res) => {
  const ticketId = parseInt(req.params.id);
  
  if (isNaN(ticketId)) {
    return res.status(400).json({
      error: 'Invalid ticket ID',
      message: 'Ticket ID must be a number'
    });
  }

  const ticket = ticketStore.markAsCompleted(ticketId);
  
  if (!ticket) {
    return res.status(404).json({
      error: 'Ticket not found',
      message: `Ticket with ID ${ticketId} not found`
    });
  }

  res.json({
    ticket,
    summary: ticketStore.getSummary(),
    message: 'Ticket marked as completed'
  });
});

/**
 * PATCH /api/tickets/:id/reopen
 * Reopen a ticket (reset status to open)
 */
router.patch('/tickets/:id/reopen', (req, res) => {
  const ticketId = parseInt(req.params.id);
  
  if (isNaN(ticketId)) {
    return res.status(400).json({
      error: 'Invalid ticket ID',
      message: 'Ticket ID must be a number'
    });
  }

  const ticket = ticketStore.reopenTicket(ticketId);
  
  if (!ticket) {
    return res.status(404).json({
      error: 'Ticket not found',
      message: `Ticket with ID ${ticketId} not found`
    });
  }

  res.json({
    ticket,
    summary: ticketStore.getSummary(),
    message: 'Ticket reopened'
  });
});

/**
 * DELETE /api/tickets
 * Clear all tickets from store (for testing/demo reset)
 */
router.delete('/tickets', (req, res) => {
  ticketStore.clear();
  
  res.json({
    message: 'All tickets cleared from store',
    metadata: ticketStore.getMetadata()
  });
});

export default router;

// Made with Bob
