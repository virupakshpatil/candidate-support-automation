# Logo Setup Instructions

The email template now includes support for the Otomeyt AI logo. You have three options to add the logo:

## Option 1: Place Logo File in Project (Easiest - Recommended)

1. Place your logo file (`logo.png` or `logo.jpg`) in the `candidate-support-automation` folder
2. The system will automatically detect and embed it as base64
3. No configuration needed!

**Supported locations:**
- `candidate-support-automation/logo.png`
- `candidate-support-automation/logo.jpg`
- `candidate-support-automation/assets/logo.png`

## Option 2: Embed Logo as Base64 in .env File

1. Convert your logo image to base64:
   
   **Windows PowerShell:**
   ```powershell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("logo.png"))
   ```
   
   **Linux/Mac:**
   ```bash
   base64 -i logo.png
   ```

2. Add to your `.env` file:
   ```
   OTOMEYT_LOGO_BASE64=iVBORw0KGgoAAAANSUhEUgAA... (your base64 string)
   ```
   
   Or with data URI prefix:
   ```
   OTOMEYT_LOGO_BASE64=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
   ```

## Option 3: Use a Hosted URL (Less Reliable)

Many email clients block external images. If you must use a URL:

1. Upload your logo to a publicly accessible URL
2. Add to your `.env` file:
   ```
   OTOMEYT_LOGO_URL=https://www.otomeyt.ai/logo.png
   ```

## Priority Order

The system checks in this order:
1. `OTOMEYT_LOGO_BASE64` from `.env` file
2. Logo file in project root (`logo.png` or `logo.jpg`)
3. `OTOMEYT_LOGO_URL` from `.env` file
4. Default: `https://www.otomeyt.ai/logo.png`

## Testing

After adding your logo, run the automation and check the email. The logo should appear at the bottom of the HTML email.

