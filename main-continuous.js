import dotenv from 'dotenv';
import { authorize } from './gmailAuth.js';
import { readUnreadMessages } from './gmailReader.js';
import { extractInfo } from './extractor.js';
import { classifyIssue } from './classifier.js';
import { generateStartButtonIssueResponse, getStartButtonIssueSubject } from './templates.js';
import { sendReply, markAsRead } from './reply.js';

// Load environment variables from .env file
dotenv.config();

const INTERVAL_MINUTES = 10;

/**
 * Process emails - runs the automation once
 */
async function processEmails() {
  try {
    console.log(`\n[${new Date().toISOString()}] Starting email check...`);
    
    // Step 1: Authorize
    const auth = await authorize();
    
    // Step 2: Read unread emails
    const unreadMessages = await readUnreadMessages(auth);

    if (unreadMessages.length === 0) {
      console.log('No unread messages to process.');
      return;
    }

    console.log(`Found ${unreadMessages.length} unread message(s)`);

    // Step 3: Process each email
    for (const message of unreadMessages) {
      try {
        console.log(`\nProcessing message ID: ${message.id}`);

        // Extract info
        const extracted = extractInfo(message);
        console.log(`Candidate: ${extracted.candidateName}`);
        console.log(`Candidate Email: ${extracted.candidateEmail}`);
        console.log(`Issue: ${extracted.issue}`);

        // Classify issue
        const classification = await classifyIssue(extracted.subject, extracted.issue, extracted.body);

        if (classification === 'YES') {
          // Generate and send reply
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
        } else {
          console.log('Issue classified as: Other (no reply needed)');
        }

        // Mark as read
        await markAsRead(auth, message.id);
        console.log('Message marked as read');

      } catch (error) {
        console.error(`Error processing message ${message.id}:`, error.message);
        continue;
      }
    }

    console.log(`[${new Date().toISOString()}] Email check completed.`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in email processing:`, error.message);
  }
}

// Run immediately on start
console.log('Starting continuous email automation...');
console.log(`Will check emails every ${INTERVAL_MINUTES} minutes.`);
processEmails();

// Then run every 10 minutes
setInterval(processEmails, INTERVAL_MINUTES * 60 * 1000);

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

