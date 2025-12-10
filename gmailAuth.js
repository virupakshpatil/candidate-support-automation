import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

/**
 * Load or request authorization for Gmail API
 * Supports both local file-based and environment variable-based credentials (for cloud deployment)
 * @returns {Promise<Object>} OAuth2 client
 */
export async function authorize() {
  try {
    let credentials;
    let tokenData = null;
    
    // Check if running on cloud (Render, etc.) with environment variables
    if (process.env.GMAIL_CREDENTIALS && process.env.GMAIL_TOKEN) {
      console.log('Using credentials from environment variables (cloud deployment)');
      try {
        // Decode base64 credentials
        credentials = JSON.parse(Buffer.from(process.env.GMAIL_CREDENTIALS, 'base64').toString('utf8'));
        tokenData = JSON.parse(Buffer.from(process.env.GMAIL_TOKEN, 'base64').toString('utf8'));
      } catch (error) {
        throw new Error('Failed to parse credentials from environment variables. Ensure they are valid base64 JSON.');
      }
    } else {
      // Local file-based authentication
      console.log('Using credentials from local files');
      const content = await fs.readFile(CREDENTIALS_PATH, 'utf8');
      credentials = JSON.parse(content);
      
      // Try to load token from file
      try {
        const tokenContent = await fs.readFile(TOKEN_PATH, 'utf8');
        tokenData = JSON.parse(tokenContent);
      } catch (err) {
        // Token file doesn't exist, will need to get new token
        console.log('No token file found, will need to authorize');
      }
    }
    
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // If we have token data, use it
    if (tokenData) {
      oAuth2Client.setCredentials(tokenData);
      
      // Check if token needs refresh
      if (oAuth2Client.isTokenExpiring()) {
        console.log('Token expiring, refreshing...');
        try {
          const { credentials: newCredentials } = await oAuth2Client.refreshAccessToken();
          oAuth2Client.setCredentials(newCredentials);
          
          // Store token (only if not using env vars)
          if (!process.env.GMAIL_TOKEN) {
            await storeToken(newCredentials);
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError.message);
          // If refresh fails and we're using env vars, we can't update them
          // The token might need to be regenerated manually
          throw new Error('Token refresh failed. Please update GMAIL_TOKEN environment variable with a new token.');
        }
      }
      
      return oAuth2Client;
    } else {
      // No token found, get new token (only works locally)
      if (process.env.GMAIL_TOKEN) {
        throw new Error('GMAIL_TOKEN environment variable is set but invalid. Please provide a valid token.');
      }
      return await getNewToken(oAuth2Client);
    }
  } catch (error) {
    console.error('Error loading credentials:', error.message);
    if (process.env.GMAIL_CREDENTIALS) {
      throw new Error('Please ensure GMAIL_CREDENTIALS and GMAIL_TOKEN environment variables are set correctly (valid base64 JSON).');
    } else {
      throw new Error('Please ensure credentials.json exists in the project root');
    }
  }
}

/**
 * Get and store new token after prompting for user authorization
 * @param {google.auth.OAuth2Client} oAuth2Client The OAuth2 client to get token for
 * @returns {Promise<Object>} OAuth2 client with credentials
 */
async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:');
  console.log(authUrl);
  console.log('\nAfter authorization, you will be redirected. Copy the code from the URL.');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question('Enter the code from that page here: ', async (code) => {
      rl.close();
      try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        await storeToken(tokens);
        console.log('Token stored successfully!');
        resolve(oAuth2Client);
      } catch (error) {
        reject(new Error(`Error retrieving access token: ${error.message}`));
      }
    });
  });
}

/**
 * Store token to disk for later program executions
 * @param {Object} token The token to store
 */
export async function storeToken(token) {
  try {
    await fs.writeFile(TOKEN_PATH, JSON.stringify(token, null, 2));
    console.log('Token stored to', TOKEN_PATH);
  } catch (error) {
    console.error('Error storing token:', error.message);
    throw error;
  }
}

