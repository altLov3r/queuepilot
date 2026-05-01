/**
 * Demo support ticket data for QueuePilot
 * Organized by scenario with metadata
 */

// Export scenarios with proper structure
export const demoScenarios = {
  normal: {
    id: 'normal',
    name: 'Normal Day',
    description: 'Balanced mix of ticket types and urgencies - typical support day',
    tickets: [
      {
        id: 1,
        message: "My order was supposed to arrive 3 days ago and I still haven't received it! Nobody is answering my emails. This is completely unacceptable. I need my package NOW or I want a full refund!"
      },
      {
        id: 2,
        message: "Hi there! I just wanted to say thank you for the amazing customer service. My issue was resolved quickly and the team was very helpful. Keep up the great work!"
      },
      {
        id: 3,
        message: "I was charged twice for my last order. Can you please check my account and process a refund for the duplicate charge? My order number is #12345."
      },
      {
        id: 4,
        message: "The product I received is broken. The screen doesn't turn on at all. I've tried everything in the manual but nothing works. Can I get a replacement?"
      },
      {
        id: 5,
        message: "I can't log into my account. Every time I try to reset my password, I don't receive the email. I've checked my spam folder too. Please help."
      },
      {
        id: 6,
        message: "I'd like to return this item and get my money back. It's not what I expected based on the description. How do I start the return process?"
      },
      {
        id: 7,
        message: "Where is my tracking number? I ordered 5 days ago and haven't received any shipping confirmation. Is my order even being processed?"
      },
      {
        id: 8,
        message: "This is a scam! You took my money and never sent anything. I'm reporting you to consumer protection and posting negative reviews everywhere. Absolutely terrible company!"
      },
      {
        id: 9,
        message: "Quick question - do you ship to Canada? I couldn't find this information on your website. Thanks!"
      },
      {
        id: 10,
        message: "I'm very frustrated. This is the third time I'm contacting support about the same issue and nobody has helped me yet. The app keeps crashing when I try to checkout."
      },
      {
        id: 11,
        message: "My invoice shows the wrong amount. I was supposed to get a 20% discount but it wasn't applied. Can you fix this and send me a corrected invoice?"
      },
      {
        id: 12,
        message: "The delivery driver left my package outside in the rain and now everything is damaged. This is not acceptable. I want a replacement sent immediately with proper packaging."
      },
      {
        id: 13,
        message: "I accidentally ordered the wrong size. Can I exchange it for a larger one? The item hasn't shipped yet according to my account."
      },
      {
        id: 14,
        message: "Your website has a bug - when I add items to cart and go to checkout, the cart shows as empty. This has happened multiple times. Please fix this!"
      },
      {
        id: 15,
        message: "Just wanted to let you know that I received my order and everything looks perfect. The packaging was great and delivery was faster than expected. Thanks!"
      }
    ]
  },
  
  crisis: {
    id: 'crisis',
    name: 'Crisis Mode',
    description: 'High urgency tickets with angry customers - emergency situation',
    tickets: [
      {
        id: 1,
        message: "This is a SCAM! I paid $500 and received NOTHING. I'm contacting my lawyer and filing a complaint with consumer protection. You have 24 hours to refund me or face legal action!"
      },
      {
        id: 2,
        message: "THIRD TIME contacting you about my missing refund! This is fraud! I want my money back NOW and I'm reporting you to the BBB. Absolutely unacceptable!"
      },
      {
        id: 3,
        message: "My business is losing thousands because your app keeps crashing! This is an emergency! I need this fixed IMMEDIATELY or I'm switching to your competitor!"
      },
      {
        id: 4,
        message: "You charged my credit card 5 TIMES for one order! This is theft! Fix this NOW or I'm disputing all charges and posting everywhere about this scam!"
      },
      {
        id: 5,
        message: "Package was supposed to arrive for my daughter's birthday YESTERDAY. She's crying and you ruined everything! I want a full refund AND compensation!"
      },
      {
        id: 6,
        message: "Your customer service is the WORST I've ever experienced. Nobody responds, nobody helps. This is completely unacceptable. I'm never buying from you again!"
      },
      {
        id: 7,
        message: "URGENT: My account was hacked and someone made unauthorized purchases. I need this resolved IMMEDIATELY before more damage is done!"
      },
      {
        id: 8,
        message: "This is the third defective product in a row! Your quality control is terrible! I demand a full refund for all three orders plus compensation for my time!"
      },
      {
        id: 9,
        message: "You promised delivery in 2 days, it's been 2 WEEKS! This is false advertising! I'm reporting you and demanding a full refund plus shipping costs!"
      },
      {
        id: 10,
        message: "Your billing system is broken and keeps charging me! I've been overcharged by $300! Fix this NOW or I'm taking legal action!"
      }
    ]
  },
  
  smooth: {
    id: 'smooth',
    name: 'Smooth Operations',
    description: 'Mostly positive feedback and simple questions - ideal support day',
    tickets: [
      {
        id: 1,
        message: "Just received my order and it's perfect! Thank you for the fast shipping and excellent packaging. Very impressed with your service!"
      },
      {
        id: 2,
        message: "Quick question about product specifications - what's the warranty period? Thanks!"
      },
      {
        id: 3,
        message: "I'd like to update my shipping address for my next order. How can I do that in my account settings?"
      },
      {
        id: 4,
        message: "Great experience! The product exceeded my expectations. Will definitely order again. Keep up the good work!"
      },
      {
        id: 5,
        message: "Do you offer gift wrapping? I'd like to send this as a present. Let me know, thanks!"
      },
      {
        id: 6,
        message: "Just wanted to say your customer service team was amazing! They helped me choose the right product. Very satisfied!"
      },
      {
        id: 7,
        message: "Can I get a copy of my invoice for tax purposes? Order #12345. Thank you!"
      },
      {
        id: 8,
        message: "Product arrived early and in perfect condition. Really appreciate the care you put into packaging. Excellent service!"
      },
      {
        id: 9,
        message: "I have a question about your return policy. What's the timeframe for returns? Thanks for your help!"
      },
      {
        id: 10,
        message: "Everything was great! Fast delivery, good quality, fair price. Will recommend to friends. Thank you!"
      }
    ]
  },
  
  delivery: {
    id: 'delivery',
    name: 'Delivery Crisis',
    description: 'Shipping and delivery issues - logistics problems',
    tickets: [
      {
        id: 1,
        message: "My package shows delivered but I never received it! This is the third time this happened. I need this resolved immediately!"
      },
      {
        id: 2,
        message: "Tracking hasn't updated in 5 days. Where is my order? I paid for express shipping and it's already late!"
      },
      {
        id: 3,
        message: "The courier left my package in the rain and everything is ruined! I want a replacement sent with proper packaging NOW!"
      },
      {
        id: 4,
        message: "I've been waiting 3 weeks for my order. This is unacceptable! I need it urgently for a gift. Where is it?!"
      },
      {
        id: 5,
        message: "Wrong address on my package! It was delivered to someone else. I need this fixed immediately and a new package sent!"
      },
      {
        id: 6,
        message: "Package arrived damaged. The box was crushed and the product is broken. I need a replacement ASAP!"
      },
      {
        id: 7,
        message: "Still no tracking number after 5 days. Is my order even being processed? This is very frustrating!"
      },
      {
        id: 8,
        message: "Delivery was scheduled for today but nobody showed up. I took time off work for this! Very disappointed!"
      },
      {
        id: 9,
        message: "The courier claims they attempted delivery but I was home all day. This is the second failed attempt. Please help!"
      },
      {
        id: 10,
        message: "My order is stuck in customs for 2 weeks. Can you help expedite this? I need it urgently!"
      }
    ]
  },
  
  billing: {
    id: 'billing',
    name: 'Billing Complaints',
    description: 'Payment and billing issues - financial problems',
    tickets: [
      {
        id: 1,
        message: "I was charged twice for the same order! This is unacceptable. I need a refund immediately!"
      },
      {
        id: 2,
        message: "My discount code wasn't applied and I was overcharged by $50. Please fix this and refund the difference!"
      },
      {
        id: 3,
        message: "I cancelled my subscription but you're still charging me! This is the third month. Stop charging me and refund!"
      },
      {
        id: 4,
        message: "The invoice amount doesn't match what I was quoted. I'm being overcharged by $100. This needs to be corrected!"
      },
      {
        id: 5,
        message: "I returned the product 2 weeks ago but still haven't received my refund. Where is my money?!"
      },
      {
        id: 6,
        message: "Your system charged my card 4 times for one purchase! This is a serious error. Refund me immediately!"
      },
      {
        id: 7,
        message: "I was promised a price match but was charged full price. I have proof of the lower price. Please honor your policy!"
      },
      {
        id: 8,
        message: "Unauthorized charge on my account! I never made this purchase. This needs to be investigated and refunded NOW!"
      },
      {
        id: 9,
        message: "The tax calculation on my invoice is wrong. I'm being overcharged. Please send a corrected invoice and refund!"
      },
      {
        id: 10,
        message: "I paid for express shipping but was charged for standard. I want a refund for the shipping difference!"
      }
    ]
  }
};

// Export default scenario for backward compatibility
export default demoScenarios.normal.tickets;

// Made with Bob
