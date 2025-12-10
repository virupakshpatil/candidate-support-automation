import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * List of known Start Button Issue patterns (61 examples)
 */
const START_BUTTON_ISSUE_PATTERNS = [
  "Not open", "test is not starting", "Link not working properly", "Assessment exam not start",
  "start bottom is disable", "Not able to click on Start icon", "Assesment not starting",
  "not able to access Test", "Test is not starting", "Camera and location option not open",
  "can't attend the test", "permission not granted", "Site Not Open", "unable to start the Assessment",
  "camera and the location permission not granted", "Not connected", "assessment is not open",
  "START EXAM is not popping", "test is not start", "COUDNT START TEST", "Test will be not start",
  "location is not showing up", "start is not clickable", "location allow not showing",
  "test is that not open", "icon is not working", "lock icon which you provided, but it's not working",
  "Not stared test", "test is not getting start", "not able to click on start assessment",
  "START BUTTON DISABLE CONDITION", "test did not start", "start test' it is not working",
  "assessment is not starting", "Start nahi ho rahi hai", "Assessment is not able to start",
  "test exam link", "start test option is not visible", "start Test option is not enable",
  "unable to Attend the Test", "Start option not working", "location visible tab not shown",
  "test not started", "Not going into text step", "Not Working", "no option is showing in for gps location",
  "Session Not starting", "Session Not Opening", "Page not open", "Unable to continue with the test",
  "Test does not starts", "location access", "Location is not ticked", "Not started",
  "can't start the screening test", "can't start the Test", "test is not starting",
  "can't start the test because", "unable to click on the start test"
];

/**
 * Classify email issue using GPT with comprehensive training examples
 * @param {string} emailSubject The email subject line
 * @param {string} issueDescription The issue description from the email body
 * @param {string} emailBody The full email body text (fallback)
 * @returns {Promise<string>} "YES" or "NO"
 */
export async function classifyIssue(emailSubject, issueDescription, emailBody = '') {
  try {
    // First, do a quick keyword check for common patterns
    const searchText = `${issueDescription} ${emailSubject} ${emailBody}`.toLowerCase();
    
    // Quick check for obvious keywords
    const quickKeywords = [
      'start', 'not starting', 'not start', 'unable to start', 'can\'t start', 'cannot start',
      'start button', 'start test', 'start exam', 'start assessment', 'start icon', 'start option',
      'button disable', 'button not working', 'not clickable', 'not enable', 'not open',
      'test not', 'assessment not', 'exam not', 'session not', 'page not open'
    ];
    
    const hasQuickMatch = quickKeywords.some(keyword => searchText.includes(keyword));
    
    if (!hasQuickMatch) {
      console.log('No quick keyword match - classified as Other');
      return 'NO';
    }

    // If quick match found, use GPT for more accurate classification
    const apiKey = process.env.OPENAI_API_KEY || process.env.CURSOR_API_KEY;
    
    if (!apiKey) {
      // Fallback to keyword matching if no API key
      console.log('No API key - using keyword matching');
      return hasQuickMatch ? 'YES' : 'NO';
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Create comprehensive prompt with all examples
    const examplesText = START_BUTTON_ISSUE_PATTERNS.slice(0, 20).join(', '); // Show first 20 examples
    
    const prompt = `You are classifying candidate support emails. Determine if the issue is a "Start Button/Test Not Starting" issue.

ISSUE TO CLASSIFY:
Subject: "${emailSubject}"
Issue: "${issueDescription}"
Body: "${emailBody.substring(0, 500)}"

A "Start Button/Test Not Starting" issue includes problems where:
- The test/assessment/exam cannot be started
- Start button is disabled, not clickable, or not working
- Start option/icon/button is not visible or not working
- Test/assessment/exam is not opening or starting
- Location/camera/microphone permissions are granted but test still won't start
- User cannot click on start button/icon/option
- Start button is in disabled condition
- Test link is not working or not opening

EXAMPLES OF START BUTTON ISSUES (these should return YES):
${START_BUTTON_ISSUE_PATTERNS.map((ex, i) => `${i + 1}. "${ex}"`).join('\n')}

EXAMPLES OF OTHER ISSUES (these should return NO):
- "Didn't receive email after completing assessment"
- "Results not received"
- "Certificate not received"
- "Payment issue"
- "Login problem"
- "Forgot password"
- "Account locked"
- "Technical error during test"
- "Questions not loading"
- "Submission failed"

Reply ONLY with "YES" if it's a Start Button/Test Not Starting issue, or "NO" if it's any other issue.`;

    const response = await openai.chat.completions.create({
      model: process.env.GPT_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a classifier for technical support emails. Classify whether an email describes a "Start Button" or "Test Not Starting" issue. These issues involve problems where candidates cannot begin their assessment because the start button/option is not working, disabled, not clickable, or the test/assessment will not start/open. Reply ONLY with "YES" if it is a Start Button issue, or "NO" if it is any other type of issue.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 10,
    });

    const classification = response.choices[0]?.message?.content?.trim().toUpperCase() || 'NO';
    
    console.log(`GPT Classification result: "${classification}"`);
    
    // Ensure we only return YES or NO
    if (classification.includes('YES')) {
      return 'YES';
    } else {
      return 'NO';
    }
  } catch (error) {
    console.error('Error classifying issue:', error.message);
    // Fallback to keyword matching on error
    const searchText = `${issueDescription} ${emailSubject} ${emailBody}`.toLowerCase();
    const hasStart = /start|not starting|not start|unable to start|can't start|cannot start|button disable|not clickable|not open/i.test(searchText);
    return hasStart ? 'YES' : 'NO';
  }
}

