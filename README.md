# Candidate Support Email Automation

Automated system for handling candidate support emails using Node.js, Gmail API, and GPT classification.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Gmail API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API
4. Create OAuth 2.0 credentials (Desktop app type)
5. Download the credentials and save as `credentials.json` in the project root

### 3. First-Time Authorization

Run the authorization script once to generate `token.json`:

```bash
node -e "import('./gmailAuth.js').then(m => m.authorize().then(auth => console.log('Auth successful')).catch(e => console.error(e)))"
```

Or manually authorize by visiting the URL shown in the error message and saving the token.

### 4. OpenAI API Key (for GPT Classification)

Set your OpenAI API key as an environment variable:

```bash
# Windows PowerShell
$env:OPENAI_API_KEY="your-api-key-here"

# Linux/Mac
export OPENAI_API_KEY="your-api-key-here"
```

Or create a `.env` file:
```
OPENAI_API_KEY=your-api-key-here
```

### 5. Run the Automation

The automation is scheduled to run every 10 minutes via `.cursor/task.json`.

To run manually:
```bash
node main.js
```

## How It Works

1. **Reads** unread emails from Gmail
2. **Extracts** candidate name, sender email, and body text
3. **Classifies** the issue using GPT (Start Button Issue vs Other)
4. **Sends reply** only for Start Button Issues
5. **Marks** all processed emails as read

## Features

- ✅ Automatic email processing
- ✅ GPT-powered issue classification
- ✅ Template-based responses
- ✅ Prevents duplicate replies
- ✅ Error handling and logging
- ✅ Scheduled execution (every 10 minutes)

## File Structure

```
candidate-support-automation/
├── main.js              # Main automation logic
├── gmailAuth.js         # Gmail OAuth2 authentication
├── gmailReader.js       # Read unread messages
├── extractor.js         # Extract candidate info
├── classifier.js        # GPT-based issue classification
├── templates.js         # Email response templates
├── reply.js             # Send replies and mark as read
├── .cursor/
│   └── task.json        # Scheduling configuration
└── package.json         # Dependencies
```

