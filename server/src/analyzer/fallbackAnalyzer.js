/**
 * Fallback AI Analyzer for QueuePilot
 * Uses keyword-based classification and rule-based logic
 * This serves as a working demo when watsonx.ai is not available
 */

// Keyword patterns for category detection
const categoryPatterns = {
  delivery: /\b(delivery|deliver|shipped|shipping|tracking|courier|package|arrived|arrive|late|delayed)\b/i,
  refund: /\b(refund|money back|return|reimburse|give back)\b/i,
  billing: /\b(charged|charge|billing|invoice|payment|paid|bill|duplicate charge|wrong amount)\b/i,
  bug: /\b(bug|error|broken|not working|doesn't work|crash|crashing|glitch|issue|problem|technical)\b/i,
  complaint: /\b(complaint|complain|unacceptable|terrible|awful|worst|horrible|scam|fraud)\b/i,
  general: /\b(question|info|information|help|support|how|what|where|when)\b/i
};

// Urgency indicators
const urgencyPatterns = {
  high: /\b(urgent|immediately|now|asap|emergency|critical|angry|unacceptable|scam|fraud|third time|nobody|never)\b/i,
  medium: /\b(soon|frustrated|disappointed|concerned|worried|issue|problem|broken)\b/i
};

// Sentiment indicators
const sentimentPatterns = {
  angry: /\b(angry|furious|outraged|unacceptable|scam|fraud|terrible|awful|worst|horrible|disgusting)\b/i,
  frustrated: /\b(frustrated|disappointed|annoyed|upset|concerned|worried|third time|again)\b/i,
  positive: /\b(thank|thanks|great|excellent|amazing|wonderful|perfect|happy|love|appreciate)\b/i
};

// Critical keywords for priority scoring
const criticalKeywords = /\b(scam|fraud|unacceptable|legal|lawyer|attorney|complaint|third time|nobody answers|refund now|never again|urgent|deadline|immediately|asap|emergency)\b/i;

// Repeated contact indicators
const repeatedContactKeywords = /\b(third time|again|still|yet|nobody|never|no response|no reply|ignored)\b/i;

/**
 * Analyze a single ticket
 */
function analyzeTicket(ticket) {
  const message = ticket.message.toLowerCase();
  
  // Detect category
  const category = detectCategory(message);
  
  // Detect urgency
  const urgency = detectUrgency(message, category);
  
  // Detect sentiment
  const sentiment = detectSentiment(message);
  
  // Calculate priority score
  const priorityScore = calculatePriorityScore(message, urgency, sentiment, category);
  const priorityLevel = getPriorityLevel(priorityScore);
  
  // Calculate customer risk
  const customerRiskScore = calculateCustomerRisk(message, sentiment, urgency, category);
  const churnRisk = getChurnRisk(customerRiskScore);
  
  // Determine team assignment
  const recommendedTeam = getRecommendedTeam(category, priorityLevel);
  
  // Determine escalation
  const { escalationLevel, escalationNeeded, escalationReason } = getEscalation(
    priorityLevel,
    customerRiskScore,
    category,
    message
  );
  
  // Calculate SLA
  const { responseTimeMinutes, slaRecommendation } = getSLA(priorityLevel);
  
  // Generate suggested reply
  const suggestedReply = generateReply(category, sentiment, urgency);
  
  // Generate internal action note
  const internalAction = generateActionNote(category, urgency, sentiment);
  
  return {
    ...ticket,
    category,
    urgency,
    sentiment,
    priorityScore,
    priorityLevel,
    customerRiskScore,
    churnRisk,
    recommendedTeam,
    escalationLevel,
    escalationNeeded,
    escalationReason,
    responseTimeMinutes,
    slaRecommendation,
    suggestedReply,
    internalAction
  };
}

/**
 * Detect ticket category based on keywords
 */
function detectCategory(message) {
  let maxScore = 0;
  let detectedCategory = 'general';
  
  for (const [category, pattern] of Object.entries(categoryPatterns)) {
    const matches = message.match(pattern);
    if (matches) {
      const score = matches.length;
      if (score > maxScore) {
        maxScore = score;
        detectedCategory = category;
      }
    }
  }
  
  return detectedCategory;
}

/**
 * Detect urgency level
 */
/**
 * Calculate priority score (0-100)
 * Higher score = higher priority
 */
function calculatePriorityScore(message, urgency, sentiment, category) {
  let score = 0;
  
  // Urgency weight (40 points)
  if (urgency === 'high') score += 40;
  else if (urgency === 'medium') score += 24;
  else score += 12;
  
  // Sentiment weight (30 points)
  if (sentiment === 'angry') score += 30;
  else if (sentiment === 'frustrated') score += 21;
  else if (sentiment === 'neutral') score += 12;
  // positive = 0
  
  // Category weight (20 points)
  if (category === 'complaint' || category === 'billing') score += 20;
  else if (category === 'bug' || category === 'refund') score += 14;
  else if (category === 'delivery') score += 10;
  else score += 4;
  
  // Critical keywords bonus (10 points max)
  const criticalMatches = message.match(criticalKeywords);
  if (criticalMatches) {
    score += Math.min(criticalMatches.length * 5, 10);
  }
  
  return Math.min(score, 100);
}

/**
 * Get priority level from score
 */
function getPriorityLevel(score) {
  if (score >= 90) return 'critical';
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

/**
 * Calculate customer risk score (0-100)
 * Higher score = higher churn risk
 */
function calculateCustomerRisk(message, sentiment, urgency, category) {
  let risk = 0;
  
  // Sentiment impact
  if (sentiment === 'angry') risk += 40;
  else if (sentiment === 'frustrated') risk += 25;
  
  // Urgency impact
  if (urgency === 'high') risk += 30;
  else if (urgency === 'medium') risk += 15;
  
  // Category impact
  if (category === 'complaint') risk += 20;
  else if (category === 'billing' || category === 'refund') risk += 15;
  
  // Critical keywords
  const criticalMatches = message.match(criticalKeywords);
  if (criticalMatches) {
    risk += Math.min(criticalMatches.length * 5, 10);
  }
  
  // Repeated contact indicator
  if (repeatedContactKeywords.test(message)) {
    risk += 15;
  }
  
  return Math.min(risk, 100);
}

/**
 * Get churn risk level
 */
function getChurnRisk(riskScore) {
  if (riskScore >= 70) return 'high';
  if (riskScore >= 40) return 'medium';
  return 'low';
}

/**
 * Get recommended team assignment
 */
function getRecommendedTeam(category, priorityLevel) {
  if (priorityLevel === 'critical') {
    return 'Senior Support';
  }
  
  const teamMap = {
    delivery: 'Logistics Team',
    billing: 'Finance Team',
    refund: 'Finance Team',
    bug: 'Technical Team',
    complaint: 'Senior Support',
    general: 'Support Team'
  };
  
  return teamMap[category] || 'Support Team';
}

/**
 * Determine escalation level and reason
 */
function getEscalation(priorityLevel, customerRiskScore, category, message) {
  let escalationLevel = 'none';
  let escalationNeeded = false;
  let escalationReason = '';
  
  // Critical priority or very high risk
  if (priorityLevel === 'critical' || customerRiskScore >= 80) {
    escalationLevel = 'executive';
    escalationNeeded = true;
    escalationReason = 'Critical priority with high customer churn risk';
  }
  // High priority or high risk
  else if (priorityLevel === 'high' || customerRiskScore >= 60) {
    escalationLevel = 'manager';
    escalationNeeded = true;
    escalationReason = 'High priority requiring management attention';
  }
  // Legal/fraud keywords
  else if (/\b(legal|lawyer|attorney|sue|court)\b/i.test(message)) {
    escalationLevel = 'manager';
    escalationNeeded = true;
    escalationReason = 'Legal threat detected';
  }
  // Medium risk
  else if (customerRiskScore >= 40 || priorityLevel === 'medium') {
    escalationLevel = 'supervisor';
    escalationNeeded = false;
    escalationReason = 'May require supervisor review';
  }
  
  return { escalationLevel, escalationNeeded, escalationReason };
}

/**
 * Get SLA response time
 */
function getSLA(priorityLevel) {
  const slaMap = {
    critical: { responseTimeMinutes: 15, slaRecommendation: 'Respond within 15 minutes' },
    high: { responseTimeMinutes: 30, slaRecommendation: 'Respond within 30 minutes' },
    medium: { responseTimeMinutes: 120, slaRecommendation: 'Respond within 2 hours' },
    low: { responseTimeMinutes: 1440, slaRecommendation: 'Respond within 24 hours' }
  };
  
  return slaMap[priorityLevel] || slaMap.low;
}

function detectUrgency(message, category) {
  if (urgencyPatterns.high.test(message)) {
    return 'high';
  }
  
  if (urgencyPatterns.medium.test(message)) {
    return 'medium';
  }
  
  // Certain categories default to higher urgency
  if (category === 'complaint' || category === 'billing') {
    return 'high';
  }
  
  if (category === 'bug' || category === 'refund') {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Detect sentiment
 */
function detectSentiment(message) {
  if (sentimentPatterns.angry.test(message)) {
    return 'angry';
  }
  
  if (sentimentPatterns.frustrated.test(message)) {
    return 'frustrated';
  }
  
  if (sentimentPatterns.positive.test(message)) {
    return 'positive';
  }
  
  return 'neutral';
}

/**
 * Generate suggested reply based on analysis
 */
function generateReply(category, sentiment, urgency) {
  const replies = {
    delivery: {
      angry: "We sincerely apologize for the delay with your order. This is not the experience we want for our customers. I'm escalating this to our shipping team immediately and will personally ensure you receive an update within the next hour. We'll also provide compensation for the inconvenience.",
      frustrated: "I understand your concern about the delivery delay. Let me check the status of your shipment right away and get back to you with a detailed update and estimated delivery time within the next 2 hours.",
      neutral: "Thank you for reaching out about your delivery. I'll look into the shipping status and provide you with tracking information and an updated delivery estimate shortly.",
      positive: "Thank you for your patience! I'm glad to help track your order. Let me get you the latest shipping information."
    },
    refund: {
      angry: "I completely understand your frustration and apologize for this situation. I'm processing your refund request immediately as a priority. You should see the refund in your account within 3-5 business days, and I'll send you a confirmation email within the hour.",
      frustrated: "I apologize for the inconvenience. I'll process your refund request right away. You can expect to see the refund within 3-5 business days, and I'll keep you updated on the status.",
      neutral: "Thank you for contacting us about your refund. I'll review your request and process it according to our refund policy. You should receive confirmation within 24 hours.",
      positive: "I'd be happy to help with your refund request. Let me process this for you right away."
    },
    billing: {
      angry: "I sincerely apologize for the billing error. This is unacceptable and I'm correcting it immediately. I'll process the refund for the incorrect charge right now and send you a corrected invoice within the hour. You'll also receive a courtesy credit for the inconvenience.",
      frustrated: "I apologize for the billing issue. Let me review your account and correct any errors immediately. I'll send you an updated invoice and process any necessary refunds within 24 hours.",
      neutral: "Thank you for bringing this billing matter to our attention. I'll review your account and invoice details and get back to you with a resolution within 24 hours.",
      positive: "I'd be happy to help review your billing. Let me check your account details and ensure everything is correct."
    },
    bug: {
      angry: "I sincerely apologize for the technical issues you're experiencing. This is clearly impacting your ability to use our service, and that's not acceptable. I'm escalating this to our technical team as a critical priority and will ensure you receive a solution or workaround within 2 hours.",
      frustrated: "I understand how frustrating technical issues can be. I'm reporting this bug to our development team as a priority and will work on getting you a solution or workaround as quickly as possible.",
      neutral: "Thank you for reporting this technical issue. I'll forward this to our development team and keep you updated on the progress. In the meantime, let me see if there's a workaround I can provide.",
      positive: "Thank you for letting us know about this issue. I'll make sure our technical team investigates this right away."
    },
    complaint: {
      angry: "I sincerely apologize for your experience. This is absolutely not the level of service we strive to provide. I'm escalating your case to our management team immediately, and someone will contact you within the hour to resolve this situation and make things right.",
      frustrated: "I'm very sorry for the issues you've experienced. Your feedback is important to us, and I want to make this right. Let me escalate this to ensure we address your concerns properly and provide a satisfactory resolution.",
      neutral: "Thank you for sharing your feedback. I take your concerns seriously and will ensure they're addressed appropriately. Let me look into this matter and get back to you with a resolution.",
      positive: "Thank you for your feedback. I appreciate you taking the time to share your thoughts with us."
    },
    general: {
      angry: "I apologize for any frustration. I'm here to help and will make sure your question is answered thoroughly and promptly.",
      frustrated: "I understand you need assistance. Let me help you with your question right away.",
      neutral: "Thank you for reaching out. I'd be happy to help answer your question.",
      positive: "Thank you for your question! I'm happy to help."
    }
  };
  
  return replies[category]?.[sentiment] || replies[category]?.neutral || "Thank you for contacting us. We'll review your message and respond as soon as possible.";
}

/**
 * Generate internal action note
 */
function generateActionNote(category, urgency, sentiment) {
  const actions = {
    delivery: {
      high: "URGENT: Check shipping status immediately. Contact courier if needed. Respond within 1 hour. Consider expedited shipping or refund.",
      medium: "Check tracking information and provide update within 2-4 hours. Investigate any delays.",
      low: "Provide tracking information and estimated delivery date within 24 hours."
    },
    refund: {
      high: "Process refund immediately. Verify transaction details. Send confirmation within 1 hour.",
      medium: "Review refund request and process within 24 hours. Verify return policy compliance.",
      low: "Review refund request according to standard policy. Respond within 48 hours."
    },
    billing: {
      high: "URGENT: Review account immediately. Correct any errors and process refunds if needed. Respond within 1 hour.",
      medium: "Review billing details and invoice. Correct any discrepancies within 24 hours.",
      low: "Review billing inquiry and provide clarification within 48 hours."
    },
    bug: {
      high: "CRITICAL: Escalate to technical team immediately. Provide workaround if possible. Update customer within 2 hours.",
      medium: "Report bug to development team. Investigate and provide update within 24 hours.",
      low: "Log bug report. Investigate and respond with timeline within 48 hours."
    },
    complaint: {
      high: "URGENT: Escalate to management immediately. Customer retention at risk. Respond within 1 hour with resolution plan.",
      medium: "Review complaint thoroughly. Escalate if needed. Provide resolution within 24 hours.",
      low: "Review feedback and respond professionally within 48 hours."
    },
    general: {
      high: "Respond to inquiry within 2 hours with complete information.",
      medium: "Provide helpful response within 24 hours.",
      low: "Respond to general inquiry within 48 hours."
    }
  };
  
  return actions[category]?.[urgency] || "Review and respond according to standard support procedures.";
}

/**
 * Generate summary statistics from analyzed tickets
 */
function generateSummary(analyzedTickets) {
  const total = analyzedTickets.length;
  const highUrgency = analyzedTickets.filter(t => t.urgency === 'high').length;
  const negativeSentiment = analyzedTickets.filter(t =>
    t.sentiment === 'angry' || t.sentiment === 'frustrated'
  ).length;
  
  // New metrics
  const criticalTickets = analyzedTickets.filter(t => t.priorityLevel === 'critical').length;
  const highRiskCustomers = analyzedTickets.filter(t => t.churnRisk === 'high').length;
  const escalationsNeeded = analyzedTickets.filter(t => t.escalationNeeded).length;
  
  // Calculate averages
  const totalPriorityScore = analyzedTickets.reduce((sum, t) => sum + t.priorityScore, 0);
  const averagePriorityScore = Math.round(totalPriorityScore / total);
  
  const totalRiskScore = analyzedTickets.reduce((sum, t) => sum + t.customerRiskScore, 0);
  const averageCustomerRiskScore = Math.round(totalRiskScore / total);
  
  // Calculate support health score
  const criticalPercent = (criticalTickets / total) * 100;
  const highUrgencyPercent = (highUrgency / total) * 100;
  const negativePercent = (negativeSentiment / total) * 100;
  const highRiskPercent = (highRiskCustomers / total) * 100;
  
  const supportHealthScore = Math.max(0, Math.round(
    100 - (criticalPercent * 0.4) - (highUrgencyPercent * 0.2) - (negativePercent * 0.2) - (highRiskPercent * 0.2)
  ));
  
  // Find most common category
  const categoryCounts = {};
  analyzedTickets.forEach(ticket => {
    categoryCounts[ticket.category] = (categoryCounts[ticket.category] || 0) + 1;
  });
  
  const topCategory = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'general';
  
  // Priority breakdown
  const priorityBreakdown = {
    critical: analyzedTickets.filter(t => t.priorityLevel === 'critical').length,
    high: analyzedTickets.filter(t => t.priorityLevel === 'high').length,
    medium: analyzedTickets.filter(t => t.priorityLevel === 'medium').length,
    low: analyzedTickets.filter(t => t.priorityLevel === 'low').length
  };
  
  // Risk breakdown
  const riskBreakdown = {
    high: analyzedTickets.filter(t => t.churnRisk === 'high').length,
    medium: analyzedTickets.filter(t => t.churnRisk === 'medium').length,
    low: analyzedTickets.filter(t => t.churnRisk === 'low').length
  };
  
  // Generate recommended action
  let recommendedAction = "Review all tickets and prioritize based on urgency.";
  let topIssuePattern = "Mixed support requests";
  
  if (criticalTickets > 0) {
    recommendedAction = `CRITICAL ALERT: ${criticalTickets} critical ticket(s) require immediate executive attention. Address within 15 minutes.`;
    topIssuePattern = "Critical escalations detected";
  } else if (highRiskCustomers > total * 0.3) {
    recommendedAction = `HIGH RISK: ${highRiskCustomers} customer(s) at high churn risk. Prioritize retention efforts immediately.`;
    topIssuePattern = "Customer retention crisis";
  } else if (highUrgency > total * 0.3) {
    recommendedAction = "HIGH ALERT: Multiple urgent tickets require immediate attention. Prioritize angry customers and billing issues first.";
    topIssuePattern = "High volume of urgent requests";
  } else if (negativeSentiment > total * 0.4) {
    recommendedAction = "Focus on addressing frustrated customers to prevent escalation. Prioritize response time.";
    topIssuePattern = "Negative sentiment trend";
  } else if (topCategory === 'delivery') {
    recommendedAction = "Prioritize delivery-related tickets. Check shipping status and provide proactive updates.";
    topIssuePattern = "Delivery delays";
  } else if (topCategory === 'bug') {
    recommendedAction = "Multiple technical issues reported. Escalate to development team and provide workarounds.";
    topIssuePattern = "Technical issues";
  } else if (supportHealthScore >= 80) {
    recommendedAction = "Support queue is healthy. Continue monitoring and maintain response times.";
    topIssuePattern = "Normal operations";
  }
  
  return {
    total,
    highUrgency,
    negativeSentiment,
    topCategory,
    recommendedAction,
    // New fields
    criticalTickets,
    highRiskCustomers,
    escalationsNeeded,
    averagePriorityScore,
    averageCustomerRiskScore,
    supportHealthScore,
    topIssuePattern,
    // Breakdowns
    categoryBreakdown: categoryCounts,
    urgencyBreakdown: {
      high: analyzedTickets.filter(t => t.urgency === 'high').length,
      medium: analyzedTickets.filter(t => t.urgency === 'medium').length,
      low: analyzedTickets.filter(t => t.urgency === 'low').length
    },
    sentimentBreakdown: {
      angry: analyzedTickets.filter(t => t.sentiment === 'angry').length,
      frustrated: analyzedTickets.filter(t => t.sentiment === 'frustrated').length,
      neutral: analyzedTickets.filter(t => t.sentiment === 'neutral').length,
      positive: analyzedTickets.filter(t => t.sentiment === 'positive').length
    },
    priorityBreakdown,
    riskBreakdown
  };
}

/**
 * Main analyze function - processes multiple tickets
 */
export function analyzeTickets(tickets) {
  if (!Array.isArray(tickets) || tickets.length === 0) {
    throw new Error('Invalid tickets array');
  }
  
  const analyzedTickets = tickets.map(ticket => analyzeTicket(ticket));
  const summary = generateSummary(analyzedTickets);
  
  // Sort by priority score (highest first), then by customer risk score
  analyzedTickets.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }
    return b.customerRiskScore - a.customerRiskScore;
  });
  
  return {
    tickets: analyzedTickets,
    summary
  };
}

export default { analyzeTickets };

// Made with Bob
