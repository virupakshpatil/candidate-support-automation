/**
 * Extract candidate information from Gmail message
 * @param {Object} email Gmail message object
 * @returns {Object} Extracted information { candidateName, senderEmail, body }
 */
export function extractInfo(email) {
  try {
    // Extract sender email and name from headers
    const headers = email.payload.headers || [];
    const fromHeader = headers.find(h => h.name.toLowerCase() === 'from')?.value || '';
    const subjectHeader = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '';

    // Parse sender email
    let senderEmail = '';
    let candidateName = '';

    // Extract email from "Name <email@example.com>" or just "email@example.com"
    const emailMatch = fromHeader.match(/<(.+?)>/) || fromHeader.match(/([\w\.-]+@[\w\.-]+\.\w+)/);
    if (emailMatch) {
      senderEmail = emailMatch[1] || emailMatch[0];
    }

    // Extract name from "Name <email>" format
    const nameMatch = fromHeader.match(/^(.+?)\s*</);
    if (nameMatch) {
      candidateName = nameMatch[1].trim().replace(/['"]/g, '');
    } else {
      // Fallback: use email username as name
      candidateName = senderEmail.split('@')[0] || 'Candidate';
    }

    // Extract body text
    let body = '';
    
    if (email.payload.body && email.payload.body.data) {
      // Simple text/plain body
      body = decodeBase64(email.payload.body.data);
    } else if (email.payload.parts) {
      // Multipart message - find text/plain or text/html
      for (const part of email.payload.parts) {
        if (part.mimeType === 'text/plain' && part.body && part.body.data) {
          body = decodeBase64(part.body.data);
          break;
        } else if (part.mimeType === 'text/html' && part.body && part.body.data) {
          // Fallback to HTML if plain text not available
          const htmlBody = decodeBase64(part.body.data);
          // Better HTML tag removal - preserve structure
          // Remove script and style tags completely
          let cleanBody = htmlBody.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
          cleanBody = cleanBody.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
          // Replace line breaks and divs with newlines
          cleanBody = cleanBody.replace(/<br\s*\/?>/gi, '\n');
          cleanBody = cleanBody.replace(/<\/div>/gi, '\n');
          cleanBody = cleanBody.replace(/<\/p>/gi, '\n');
          // Remove all other HTML tags
          cleanBody = cleanBody.replace(/<[^>]*>/g, ' ');
          // Clean up whitespace
          cleanBody = cleanBody.replace(/\s+/g, ' ').trim();
          body = cleanBody;
          break;
        } else if (part.parts) {
          // Nested parts - check both plain text and HTML
          for (const nestedPart of part.parts) {
            if (nestedPart.mimeType === 'text/plain' && nestedPart.body && nestedPart.body.data) {
              body = decodeBase64(nestedPart.body.data);
              break;
            } else if (nestedPart.mimeType === 'text/html' && nestedPart.body && nestedPart.body.data && !body) {
              // Use HTML if plain text not available
              const htmlBody = decodeBase64(nestedPart.body.data);
              let cleanBody = htmlBody.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
              cleanBody = cleanBody.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
              cleanBody = cleanBody.replace(/<br\s*\/?>/gi, '\n');
              cleanBody = cleanBody.replace(/<\/div>/gi, '\n');
              cleanBody = cleanBody.replace(/<\/p>/gi, '\n');
              cleanBody = cleanBody.replace(/<[^>]*>/g, ' ');
              cleanBody = cleanBody.replace(/\s+/g, ' ').trim();
              body = cleanBody;
            }
          }
          if (body) break;
        }
      }
    }

    body = body.trim();

    // Extract candidate email from body (look for "Candidate Email ID:" pattern)
    let candidateEmail = '';
    // Try multiple patterns to match email
    const emailPatterns = [
      /Candidate\s+Email\s+ID[:\s]+([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,})/i,
      /Candidate\s+Email[:\s]+([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,})/i,
      /Email\s+ID[:\s]+([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,})/i,
    ];
    
    for (const pattern of emailPatterns) {
      const emailIdMatch = body.match(pattern);
      if (emailIdMatch) {
        candidateEmail = emailIdMatch[1].trim();
        break;
      }
    }

    // Extract candidate name from body (look for "Candidate Full Name:" pattern)
    // Stop at the next field (Candidate Email ID, Candidate Phone, etc.)
    let extractedCandidateName = candidateName;
    const bodyNameMatch = body.match(/Candidate\s+Full\s+Name[:\s]+(.+?)(?=\s*(?:Candidate\s+(?:Email\s+ID|Phone|Assessment\s+Key)|Subject|Issue)|$)/i);
    if (bodyNameMatch) {
      extractedCandidateName = bodyNameMatch[1].trim();
    }

    // Extract issue description from body (look for "Issue:" pattern)
    // Stop at "Thank you" or end of string
    let issueDescription = '';
    const issueMatch = body.match(/Issue[:\s]+(.+?)(?=\s*(?:Thank\s+you|$))/i);
    if (issueMatch) {
      issueDescription = issueMatch[1].trim();
    }

    return {
      candidateName: extractedCandidateName || candidateName || 'Candidate',
      candidateEmail: candidateEmail || senderEmail, // Fallback to sender email if not found in body
      senderEmail: senderEmail,
      subject: subjectHeader,
      body: body,
      issue: issueDescription,
      messageId: email.id,
      threadId: email.threadId,
    };
  } catch (error) {
    console.error('Error extracting info from email:', error.message);
    throw error;
  }
}

/**
 * Decode base64 string
 * @param {string} data Base64 encoded string
 * @returns {string} Decoded string
 */
function decodeBase64(data) {
  try {
    return Buffer.from(data, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Error decoding base64:', error.message);
    return '';
  }
}

