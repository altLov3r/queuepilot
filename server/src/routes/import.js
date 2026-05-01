/**
 * Import Routes - Connected Inbox Feature
 * Handles webhook imports and demo connector imports
 */

import express from 'express';
import importedTickets from '../data/importedTickets.js';
import ticketStore from '../store/ticketStore.js';

const router = express.Router();

// Counter for generating unique IDs for imported tickets
let importIdCounter = 10000;

/**
 * GET /api/import/sources
 * Returns available demo connector types
 */
router.get('/sources', (req, res) => {
  try {
    const sources = [
      {
        id: 'website-form',
        name: 'Website Contact Form',
        description: 'Import messages from a website contact form or support widget.'
      },
      {
        id: 'ecommerce-support',
        name: 'E-commerce Support Plugin',
        description: 'Import order, delivery, refund, and product support requests.'
      },
      {
        id: 'helpdesk-csv',
        name: 'Helpdesk CSV/API Export',
        description: 'Import tickets from helpdesk tools using CSV or API payloads.'
      }
    ];

    res.json(sources);
  } catch (error) {
    console.error('Error fetching import sources:', error);
    res.status(500).json({ error: 'Failed to fetch import sources' });
  }
});

/**
 * POST /api/import/webhook
 * Accepts webhook payloads from external sources
 */
router.post('/webhook', (req, res) => {
  try {
    const { source, tickets } = req.body;

    // Validate payload
    if (!source || typeof source !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid payload: "source" field is required and must be a string' 
      });
    }

    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid payload: "tickets" field is required and must be a non-empty array' 
      });
    }

    // Normalize and validate each ticket
    const normalizedTickets = [];
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      
      // Validate required message field
      if (!ticket.message || typeof ticket.message !== 'string') {
        return res.status(400).json({ 
          error: `Invalid ticket at index ${i}: "message" field is required and must be a string` 
        });
      }

      // Normalize ticket with safe defaults
      const normalizedTicket = {
        id: ++importIdCounter,
        message: ticket.message.trim(),
        source: source,
        customerName: ticket.customerName || 'Unknown',
        email: ticket.email || '',
        subject: ticket.subject || 'No subject',
        importedAt: new Date().toISOString()
      };

      normalizedTickets.push(normalizedTicket);
    }

    // Store imported tickets in backend memory
    ticketStore.setImportedTickets(normalizedTickets, source);

    console.log(`${new Date().toISOString()} - Imported ${normalizedTickets.length} tickets from ${source}`);

    res.json({
      success: true,
      source: source,
      importedCount: normalizedTickets.length,
      tickets: normalizedTickets
    });

  } catch (error) {
    console.error('Error processing webhook import:', error);
    res.status(500).json({ 
      error: 'Failed to process webhook import',
      details: error.message 
    });
  }
});

/**
 * POST /api/import/demo
 * Loads demo imported tickets from a specific connector type
 */
router.post('/demo', (req, res) => {
  try {
    const { sourceId } = req.body;

    // Validate sourceId
    if (!sourceId || typeof sourceId !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request: "sourceId" field is required and must be a string' 
      });
    }

    // Check if source exists
    const sourceData = importedTickets[sourceId];
    if (!sourceData) {
      return res.status(404).json({ 
        error: `Source not found: "${sourceId}". Available sources: website-form, ecommerce-support, helpdesk-csv` 
      });
    }

    // Normalize demo tickets with IDs
    const normalizedTickets = sourceData.tickets.map(ticket => ({
      id: ++importIdCounter,
      message: ticket.message,
      source: sourceData.name,
      customerName: ticket.customerName || 'Unknown',
      email: ticket.email || '',
      subject: ticket.subject || 'No subject',
      importedAt: new Date().toISOString()
    }));

    // Store imported tickets in backend memory
    ticketStore.setImportedTickets(normalizedTickets, sourceData.name);

    console.log(`${new Date().toISOString()} - Loaded ${normalizedTickets.length} demo tickets from ${sourceData.name}`);

    res.json({
      success: true,
      source: sourceData.name,
      sourceId: sourceId,
      importedCount: normalizedTickets.length,
      tickets: normalizedTickets
    });

  } catch (error) {
    console.error('Error loading demo import:', error);
    res.status(500).json({ 
      error: 'Failed to load demo import',
      details: error.message 
    });
  }
});

/**
 * GET /api/import/tickets
 * Returns currently imported tickets (not yet analyzed)
 */
router.get('/tickets', (req, res) => {
  try {
    const importedTickets = ticketStore.getImportedTickets();
    res.json({
      success: true,
      count: importedTickets.length,
      tickets: importedTickets
    });
  } catch (error) {
    console.error('Error fetching imported tickets:', error);
    res.status(500).json({ 
      error: 'Failed to fetch imported tickets',
      details: error.message 
    });
  }
});

export default router;

// Made with Bob