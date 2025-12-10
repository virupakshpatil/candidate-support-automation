import { google } from 'googleapis';

/**
 * Send a reply email via Gmail API
 * @param {Object} auth OAuth2 client
 * @param {string} to Recipient email address
 * @param {string} subject Email subject
 * @param {string} body Email body text
 * @param {string} threadId Optional thread ID to reply in thread
 * @param {string|Array<string>} cc Optional CC email address(es) - can be string or array
 * @returns {Promise<string>} Message ID of sent email
 */
export async function sendReply(auth, to, subject, body, threadId = null, cc = null) {
  try {
    const gmail = google.gmail({ version: 'v1', auth });

    // Check if body is an object with plainText and html, or just a string
    const isHtmlEmail = typeof body === 'object' && body.plainText && body.html;
    const plainTextBody = isHtmlEmail ? body.plainText : body;
    const htmlBody = isHtmlEmail ? body.html : null;

    // Create email message headers
    const headers = [
      `To: ${to}`,
      `Subject: ${subject}`,
    ];

    // Add CC if provided (support both string and array)
    if (cc) {
      if (Array.isArray(cc)) {
        headers.push(`Cc: ${cc.join(', ')}`);
      } else {
        headers.push(`Cc: ${cc}`);
      }
    }

    let messageBody;
    
    if (htmlBody) {
      // Create multipart/alternative message with both plain text and HTML
      const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      headers.push('MIME-Version: 1.0');
      headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
      headers.push('');
      
      messageBody = [
        `--${boundary}`,
        'Content-Type: text/plain; charset=utf-8',
        'Content-Transfer-Encoding: 7bit',
        '',
        plainTextBody,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset=utf-8',
        'Content-Transfer-Encoding: 7bit',
        '',
        htmlBody,
        '',
        `--${boundary}--`
      ].join('\n');
    } else {
      // Plain text email
      headers.push('Content-Type: text/plain; charset=utf-8');
      headers.push('');
      messageBody = plainTextBody.trim() + '\n';
    }

    const message = headers.join('\n') + '\n' + messageBody;
    
    // Log the message being sent for debugging (first 500 chars)
    console.log('Message preview (first 500 chars):');
    console.log(message.substring(0, 500));

    // Encode message in base64url format
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const messageParams = {
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    };

    // If replying to a thread, include threadId
    if (threadId) {
      messageParams.requestBody.threadId = threadId;
    }

    const response = await gmail.users.messages.send(messageParams);
    console.log(`Reply sent successfully. Message ID: ${response.data.id}`);
    return response.data.id;
  } catch (error) {
    console.error('Error sending reply:', error.message);
    throw error;
  }
}

/**
 * Mark an email as read
 * @param {Object} auth OAuth2 client
 * @param {string} messageId Gmail message ID
 */
export async function markAsRead(auth, messageId) {
  try {
    const gmail = google.gmail({ version: 'v1', auth });

    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        removeLabelIds: ['UNREAD'],
      },
    });

    console.log(`Message ${messageId} marked as read`);
  } catch (error) {
    console.error(`Error marking message ${messageId} as read:`, error.message);
    throw error;
  }
}

