import dotenv from 'dotenv';
import express from 'express';
import { authorize } from './gmailAuth.js';
import { readUnreadMessages } from './gmailReader.js';
import { extractInfo } from './extractor.js';
import { classifyIssue } from './classifier.js';
import { generateStartButtonIssueResponse, getStartButtonIssueSubject } from './templates.js';
import { sendReply, markAsRead } from './reply.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const INTERVAL_MINUTES = 10;

// Health check endpoint for Uptime Robot
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Candidate Support Automation',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Health check endpoint (alternative)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Process emails function
async function processEmails() {
  try {
    console.log(`\n[${new Date().toISOString()}] Starting email check...`);
    
    const auth = await authorize();
    const unreadMessages = await readUnreadMessages(auth);

    if (unreadMessages.length === 0) {
      console.log('No unread messages to process.');
      return { processed: 0, replied: 0 };
    }

    console.log(`Found ${unreadMessages.length} unread message(s)`);

    let processed = 0;
    let replied = 0;

    for (const message of unreadMessages) {
      try {
        console.log(`\nProcessing message ID: ${message.id}`);

        const extracted = extractInfo(message);
        console.log(`Candidate: ${extracted.candidateName}`);
        console.log(`Candidate Email: ${extracted.candidateEmail}`);
        console.log(`Issue: ${extracted.issue}`);

        const classification = await classifyIssue(extracted.subject, extracted.issue, extracted.body);

        if (classification === 'YES') {
          console.log('Issue classified as: Start Button Issue');
          const replyBody = generateStartButtonIssueResponse(extracted.candidateName);
          const replySubject = getStartButtonIssueSubject();

          console.log(`Sending reply to: ${extracted.candidateEmail}`);
          await sendReply(
            auth,
            extracted.candidateEmail,
            replySubject,
            replyBody,
            extracted.threadId,
            ['candidatesupport@otomeyt.ai', 'hello@otomeyt.ai']
          );
          console.log('Reply sent successfully');
          replied++;
        } else {
          console.log('Issue classified as: Other (no reply needed)');
        }

        await markAsRead(auth, message.id);
        console.log('Message marked as read');
        processed++;

      } catch (error) {
        console.error(`Error processing message ${message.id}:`, error.message);
        continue;
      }
    }

    console.log(`[${new Date().toISOString()}] Email check completed. Processed: ${processed}, Replied: ${replied}`);
    return { processed, replied };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in email processing:`, error.message);
    return { processed: 0, replied: 0, error: error.message };
  }
}

// Start email processing immediately
console.log('Starting email automation server...');
console.log(`Will check emails every ${INTERVAL_MINUTES} minutes.`);
processEmails();

// Then run every 10 minutes
setInterval(processEmails, INTERVAL_MINUTES * 60 * 1000);

// Start web server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`Uptime Robot can ping: http://your-app.onrender.com/`);
});

// Keep process alive
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

