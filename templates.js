import { getLogo } from './logoUtils.js';

/**
 * Generate response template for Start Button Issue
 * @param {string} candidateName The candidate's name
 * @returns {Object} Object with plain text and HTML versions
 */
export function generateStartButtonIssueResponse(candidateName) {
  // Clean the candidate name - remove any extra text that might have been captured
  const cleanName = candidateName.split(/\s+(?:Candidate|Email|Phone|Assessment|Subject|Issue)/i)[0].trim();
  
  // Plain text version
  const plainText = `Hi ${cleanName},

Please ensure you enabled the camera and microphone permissions for the Google Chrome browser to be able to click on the Start button.

If you encounter any issues, kindly enable all necessary permissions and reload the page.

If the issue persists, try the following steps:
- Take the test in incognito mode, or
- Switch to a different device.

Regards,
Otomeyt Support Team
www.otomeyt.ai`;

  // Get logo (base64 embedded or URL)
  const logo = getLogo();
  
  // HTML version with logo
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>Hi ${cleanName},</p>
  
  <p>Please ensure you enabled the camera and microphone permissions for the Google Chrome browser to be able to click on the Start button.</p>
  
  <p>If you encounter any issues, kindly enable all necessary permissions and reload the page.</p>
  
  <p>If the issue persists, try the following steps:</p>
  <ul>
    <li>Take the test in incognito mode, or</li>
    <li>Switch to a different device.</li>
  </ul>
  
  <p>Regards,<br>
  Otomeyt Support Team<br>
  <a href="https://www.otomeyt.ai" style="color: #0066cc;">www.otomeyt.ai</a></p>
  
  ${logo ? `<div style="margin-top: 20px;">
    <img src="${logo}" alt="Otomeyt AI" style="max-width: 200px; height: auto;" />
  </div>` : ''}
</body>
</html>`;

  return {
    plainText,
    html
  };
}

/**
 * Get the subject line for Start Button Issue replies
 * @returns {string} Subject line
 */
export function getStartButtonIssueSubject() {
  return 'Regarding Your Assessment Start Issue';
}

