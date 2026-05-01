/**
 * OpenRouter.ai Analyzer
 * Uses OpenRouter.ai API for real AI-powered ticket analysis
 * Free tier available - no credit card required!
 */

/**
 * Check if OpenRouter is configured
 */
export function isOpenRouterAvailable() {
  return !!(process.env.OPENROUTER_API_KEY);
}

/**
 * Analyze tickets using OpenRouter.ai
 */
export async function analyzeTicketsWithOpenRouter(tickets) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  try {
    // Analyze each ticket
    const analyzedTickets = await Promise.all(
      tickets.map(ticket => analyzeTicketWithAI(ticket, apiKey))
    );

    // Calculate summary
    const summary = calculateSummary(analyzedTickets);

    return {
      tickets: analyzedTickets,
      summary,
      metadata: {
        analyzer: 'OpenRouter.ai (Real AI)',
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('OpenRouter analysis error:', error);
    throw error;
  }
}

/**
 * Analyze single ticket with OpenRouter AI
 */
async function analyzeTicketWithAI(ticket, apiKey) {
  const prompt = `Analyze this customer support ticket and provide a JSON response with the following fields:

Ticket: "${ticket.message}"

Provide analysis in this exact JSON format:
{
  "category": "delivery|refund|billing|bug|complaint|general",
  "urgency": "low|medium|high",
  "sentiment": "positive|neutral|frustrated|angry",
  "priorityLevel": "low|medium|high|critical",
  "priorityScore": 0-100,
  "churnRisk": "low|medium|high",
  "customerRiskScore": 0-100,
  "suggestedReply": "professional response to customer",
  "internalAction": "specific action for support team",
  "escalation": "none|manager|technical|billing",
  "assignedTeam": "frontline|technical|billing|management",
  "slaRecommendation": "response time recommendation",
  "estimatedResolutionTime": "time estimate"
}

Analyze the urgency, sentiment, and provide helpful suggestions.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/altLov3r/queuepilot',
        'X-Title': 'QueuePilot'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free', // Free model!
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse AI response
    const analysis = parseAIResponse(aiResponse);

    // Merge with original ticket
    return {
      ...ticket,
      ...analysis,
      aiGenerated: true
    };
  } catch (error) {
    console.error('Error analyzing ticket with AI:', error);
    // Fallback to basic analysis if AI fails
    return {
      ...ticket,
      category: 'general',
      urgency: 'medium',
      sentiment: 'neutral',
      priorityLevel: 'medium',
      priorityScore: 50,
      churnRisk: 'low',
      customerRiskScore: 30,
      suggestedReply: 'Thank you for contacting us. We will review your message and respond shortly.',
      internalAction: 'Review and respond to customer inquiry.',
      escalation: 'none',
      assignedTeam: 'frontline',
      slaRecommendation: 'Respond within 24 hours',
      estimatedResolutionTime: '1-2 business days',
      aiGenerated: false,
      error: 'AI analysis failed, using fallback'
    };
  }
}

/**
 * Parse AI response (handles JSON or text)
 */
function parseAIResponse(response) {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        category: parsed.category || 'general',
        urgency: parsed.urgency || 'medium',
        sentiment: parsed.sentiment || 'neutral',
        priorityLevel: parsed.priorityLevel || 'medium',
        priorityScore: parsed.priorityScore || 50,
        churnRisk: parsed.churnRisk || 'low',
        customerRiskScore: parsed.customerRiskScore || 30,
        suggestedReply: parsed.suggestedReply || 'Thank you for your message.',
        internalAction: parsed.internalAction || 'Review and respond.',
        escalation: parsed.escalation || 'none',
        assignedTeam: parsed.assignedTeam || 'frontline',
        slaRecommendation: parsed.slaRecommendation || 'Respond within 24 hours',
        estimatedResolutionTime: parsed.estimatedResolutionTime || '1-2 business days'
      };
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
  }

  // Fallback if parsing fails
  return {
    category: 'general',
    urgency: 'medium',
    sentiment: 'neutral',
    priorityLevel: 'medium',
    priorityScore: 50,
    churnRisk: 'low',
    customerRiskScore: 30,
    suggestedReply: 'Thank you for contacting us. We will review your message and respond shortly.',
    internalAction: 'Review and respond to customer inquiry.',
    escalation: 'none',
    assignedTeam: 'frontline',
    slaRecommendation: 'Respond within 24 hours',
    estimatedResolutionTime: '1-2 business days'
  };
}

/**
 * Calculate summary statistics
 */
function calculateSummary(tickets) {
  const total = tickets.length;
  const highUrgency = tickets.filter(t => t.urgency === 'high').length;
  const negativeSentiment = tickets.filter(t => 
    t.sentiment === 'angry' || t.sentiment === 'frustrated'
  ).length;
  
  // Count categories
  const categories = {};
  tickets.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + 1;
  });
  
  const topCategory = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'general';

  // Calculate health score
  const urgencyScore = (highUrgency / total) * 100;
  const sentimentScore = (negativeSentiment / total) * 100;
  const supportHealthScore = Math.max(0, 100 - urgencyScore - sentimentScore);

  return {
    total,
    highUrgency,
    negativeSentiment,
    topCategory,
    supportHealthScore: Math.round(supportHealthScore),
    recommendedAction: highUrgency > total * 0.3
      ? 'High volume of urgent tickets - prioritize immediate response'
      : 'Maintain current response pace and monitor for escalations'
  };
}

// Made with Bob
