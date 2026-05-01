/**
 * Demo imported ticket data for Connected Inbox feature
 * Simulates tickets imported from various support sources
 */

const importedTickets = {
  'website-form': {
    id: 'website-form',
    name: 'Website Contact Form',
    description: 'Import messages from a website contact form or support widget.',
    tickets: [
      {
        customerName: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        subject: 'Product inquiry',
        message: 'Hi, I would like to know more about your premium subscription plans and pricing options.'
      },
      {
        customerName: 'Michael Chen',
        email: 'mchen@company.com',
        subject: 'Technical issue',
        message: 'I am unable to log into my account. I keep getting an error message saying "Invalid credentials" even though I am sure my password is correct.'
      },
      {
        customerName: 'Emma Williams',
        email: 'emma.w@mail.com',
        subject: 'Feature request',
        message: 'It would be great if you could add dark mode to the application. Many users including myself prefer dark themes.'
      },
      {
        customerName: 'David Martinez',
        email: 'david.m@email.com',
        subject: 'Billing question',
        message: 'I was charged twice for my subscription this month. Can you please check and refund the duplicate charge?'
      },
      {
        customerName: 'Lisa Anderson',
        email: 'lisa.a@company.com',
        subject: 'Account deletion',
        message: 'I would like to delete my account and all associated data. Please confirm when this is done.'
      },
      {
        customerName: 'James Wilson',
        email: 'jwilson@email.com',
        subject: 'Urgent: Service down',
        message: 'Your service has been down for the past 2 hours. This is affecting our business operations. Please fix this ASAP!'
      }
    ]
  },

  'ecommerce-support': {
    id: 'ecommerce-support',
    name: 'E-commerce Support Plugin',
    description: 'Import order, delivery, refund, and product support requests.',
    tickets: [
      {
        customerName: 'Maria Rodriguez',
        email: 'maria.r@email.com',
        subject: 'Order #12345 - Late delivery',
        message: 'My order was supposed to arrive 5 days ago but I still have not received it. The tracking shows it is stuck in transit. This is unacceptable!'
      },
      {
        customerName: 'Robert Taylor',
        email: 'rtaylor@company.com',
        subject: 'Refund request - Order #12346',
        message: 'I received the wrong item. I ordered a blue shirt size M but got a red shirt size L. I want a full refund immediately.'
      },
      {
        customerName: 'Jennifer Lee',
        email: 'jlee@email.com',
        subject: 'Damaged product - Order #12347',
        message: 'The laptop I received has a cracked screen. The packaging was damaged when it arrived. I need a replacement or refund.'
      },
      {
        customerName: 'William Brown',
        email: 'wbrown@business.com',
        subject: 'Bulk order inquiry - Urgent',
        message: 'We are a business customer looking to place a bulk order of 500 units. We need priority shipping and volume discount. Please contact me ASAP.'
      },
      {
        customerName: 'Patricia Davis',
        email: 'pdavis@email.com',
        subject: 'Wrong item received - Order #12348',
        message: 'I ordered a phone case but received headphones instead. Please send the correct item and arrange pickup of the wrong item.'
      },
      {
        customerName: 'Christopher Garcia',
        email: 'cgarcia@company.com',
        subject: 'Billing error - Order #12349',
        message: 'I was charged $299 but the price shown at checkout was $249. Please refund the difference of $50.'
      },
      {
        customerName: 'Amanda Martinez',
        email: 'amartinez@email.com',
        subject: 'Missing tracking number',
        message: 'My order was placed 3 days ago but I have not received any tracking information. Can you please provide the tracking number?'
      },
      {
        customerName: 'Daniel Wilson',
        email: 'dwilson@business.com',
        subject: 'Urgent: Business order delayed',
        message: 'Our business order #12350 is delayed by 2 weeks. This is causing major issues for our operations. We need immediate resolution or we will cancel and request full refund.'
      }
    ]
  },

  'helpdesk-csv': {
    id: 'helpdesk-csv',
    name: 'Helpdesk CSV/API Export',
    description: 'Import tickets from helpdesk tools using CSV or API payloads.',
    tickets: [
      {
        customerName: 'Thomas Anderson',
        email: 'tanderson@company.com',
        subject: 'Software bug report',
        message: 'The application crashes when I try to export reports. This happens consistently on both Chrome and Firefox browsers.'
      },
      {
        customerName: 'Jessica Moore',
        email: 'jmoore@email.com',
        subject: 'Password reset not working',
        message: 'I requested a password reset but I am not receiving the email. I have checked spam folder. Please help.'
      },
      {
        customerName: 'Matthew Jackson',
        email: 'mjackson@business.com',
        subject: 'API integration issue',
        message: 'We are trying to integrate your API but getting 401 authentication errors. Our API key seems to be invalid. Please verify.'
      },
      {
        customerName: 'Ashley White',
        email: 'awhite@email.com',
        subject: 'Data export request',
        message: 'I need to export all my data from your platform. Please provide instructions or send me a data export file.'
      },
      {
        customerName: 'Joshua Harris',
        email: 'jharris@company.com',
        subject: 'Performance issues',
        message: 'The application has been very slow for the past week. Pages take 10-15 seconds to load. This is affecting our productivity.'
      },
      {
        customerName: 'Stephanie Clark',
        email: 'sclark@email.com',
        subject: 'Mobile app not syncing',
        message: 'The mobile app is not syncing with the web version. Changes I make on mobile do not appear on desktop and vice versa.'
      }
    ]
  }
};

export default importedTickets;

// Made with Bob