import { google } from 'googleapis';

/**
 * Read all unread messages from Gmail
 * @param {Object} auth OAuth2 client
 * @returns {Promise<Array>} Array of message objects with full content
 */
export async function readUnreadMessages(auth) {
  try {
    const gmail = google.gmail({ version: 'v1', auth });

    // List unread messages
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
      maxResults: 50,
    });

    const messages = response.data.messages || [];
    
    if (messages.length === 0) {
      console.log('No unread messages found');
      return [];
    }

    console.log(`Found ${messages.length} unread message(s)`);

    // Fetch full message details for each unread message
    const fullMessages = await Promise.all(
      messages.map(async (message) => {
        try {
          const fullMessage = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'full',
          });
          return fullMessage.data;
        } catch (error) {
          console.error(`Error fetching message ${message.id}:`, error.message);
          return null;
        }
      })
    );

    // Filter out any null results
    return fullMessages.filter(msg => msg !== null);
  } catch (error) {
    console.error('Error reading unread messages:', error.message);
    throw error;
  }
}

