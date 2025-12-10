import dotenv from 'dotenv';
import { authorize } from './gmailAuth.js';
import { readUnreadMessages } from './gmailReader.js';
import { extractInfo } from './extractor.js';
import { classifyIssue } from './classifier.js';
import { generateStartButtonIssueResponse, getStartButtonIssueSubject } from './templates.js';
import { sendReply, markAsRead } from './reply.js';

// Load environment variables from .env file
dotenv.config();

/**
 * Main automation function
 */
async function main() {
  try {
    console.log('Starting candidate support email automation...');
    console.log(new Date().toISOString());

    // Step 1: Authorize
    console.log('Authorizing Gmail API...');
    const auth = await authorize();
    console.log('Authorization successful');

    // Step 2: Read unread emails
    console.log('Reading unread emails...');
    const unreadMessages = await readUnreadMessages(auth);

    if (unreadMessages.length === 0) {
      console.log('No unread messages to process. Exiting.');
      return;
    }

    // Step 3: Process each email
    for (const message of unreadMessages) {
      try {
        console.log(`\nProcessing message ID: ${message.id}`);

        // Step 3a: Extract info
        const extracted = extractInfo(message);
        console.log(`Candidate: ${extracted.candidateName}`);
        console.log(`Candidate Email: ${extracted.candidateEmail}`);
        console.log(`Sender: ${extracted.senderEmail}`);
        console.log(`Subject: ${extracted.subject}`);
        console.log(`Issue: ${extracted.issue}`);
        console.log(`Body preview: ${extracted.body.substring(0, 300)}...`);
        
        // Validate that candidate email was extracted
        if (!extracted.candidateEmail || extracted.candidateEmail === extracted.senderEmail) {
          console.warn('⚠️  WARNING: Candidate email not properly extracted from body. Using sender email as fallback.');
          console.warn(`   Extracted candidate email: "${extracted.candidateEmail}"`);
          console.warn(`   This may cause replies to be sent to the wrong address.`);
        }

        // Step 3b: Classify issue
        console.log('Classifying issue...');
        console.log(`Issue field: "${extracted.issue}"`);
        const classification = await classifyIssue(extracted.subject, extracted.issue, extracted.body);

        if (classification === 'YES') {
          // Step 3c: Generate and send reply for Start Button Issue
          console.log('Issue classified as: Start Button Issue');
          const replyBody = generateStartButtonIssueResponse(extracted.candidateName);
          const replySubject = getStartButtonIssueSubject();

          // Log the exact body being sent
          console.log('\n--- Email Body Being Sent (Plain Text) ---');
          console.log(replyBody.plainText || replyBody);
          console.log('--- End of Email Body ---\n');

          // Send TO candidate email, CC both candidatesupport@otomeyt.ai and hello@otomeyt.ai
          console.log('Sending reply...');
          console.log(`To: ${extracted.candidateEmail}`);
          console.log(`CC: candidatesupport@otomeyt.ai, hello@otomeyt.ai`);
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

        // Step 3d: Mark as read (always, regardless of classification)
        console.log('Marking message as read...');
        await markAsRead(auth, message.id);
        console.log('Message marked as read');

      } catch (error) {
        console.error(`Error processing message ${message.id}:`, error.message);
        // Continue processing other messages even if one fails
        continue;
      }
    }

    console.log('\nAutomation completed successfully');
    console.log(new Date().toISOString());

  } catch (error) {
    console.error('Fatal error in automation:', error.message);
    process.exit(1);
  }
}

// Run the automation
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

