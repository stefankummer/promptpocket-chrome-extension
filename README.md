# PromptPocket Chrome Extension

Save prompts from any website directly to your PromptPocket account.

## Features

- **API Key Authentication**: Securely connect to your PromptPocket account using your API key
- **Save Prompts**: Add prompts with all fields (title, content, description, notes, status, visibility)
- **AI Tools Selection**: Choose from public and your private AI tools
- **Tags Selection**: Add public and private tags to your prompts
- **Quick Save**: Right-click selected text to quickly save as a prompt
- **Keyboard Shortcut**: Use `Alt+Shift+S` to instantly save selected text
- **Auto-fill**: Automatically capture selected text when opening the extension

## Installation

### From Source (Developer Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. The PromptPocket extension icon should appear in your toolbar

### From Chrome Extension Store

Extension is actually not present in store, but will be soon.

## Usage

### Initial Setup

1. Click the PromptPocket icon in your browser toolbar
2. Enter your API key (find it at https://promptpocket.app/settings/api-key)
3. Click "Connect"

### Saving a Prompt

#### Method 1: Full Form

1. Click the PromptPocket icon
2. Fill in the prompt details:
    - **Title** (required): A descriptive title
    - **Content** (required): The prompt text
    - **Description**: A brief summary
    - **AI Tools**: Select relevant AI tools
    - **Tags**: Categorize your prompt
    - **Notes**: Private notes only you can see
    - **Status**: Draft, Published, or Archived
    - **Make public**: Share with the community
3. Click "Save Prompt"

#### Method 2: Quick Save (Right-click)

1. Select text on any webpage
2. Right-click and choose "Quick Save to PromptPocket"
3. The prompt is saved automatically with the selected text

#### Method 3: Keyboard Shortcut

1. Select text on any webpage
2. Press `Alt+Shift+S`
3. The prompt is saved instantly

### Getting Selected Text

When the popup opens, click "Get selected text" to automatically fill the content field with text you've selected on the page.

## Settings

Access settings by clicking the gear icon:

- **API Endpoint**: Customize the API URL (default: https://promptpocket.app/api/v1)
- **Default Status**: Set the default status for new prompts
- **Auto-fill**: Automatically capture selected text when opening the popup
- **Clear All Data**: Reset the extension and log out

## Files Structure

```
chrome-extension/
├── LICENCE             # Apache Licence 2.0
├── README.md           # This file
├── manifest.json       # Extension configuration
├── popup.html          # Popup UI
├── popup.css           # Popup styles
├── popup.js            # Popup logic
├── background.js       # Service worker for context menu & shortcuts
├── content.js          # Content script for page interaction
├── content.css         # Content script styles
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## API Endpoints Used

- `GET /api/v1/user` - Verify API key and get user info
- `POST /api/v1/prompts` - Create a new prompt
- `GET /api/v1/tools` - Fetch available AI tools
- `GET /api/v1/tags` - Fetch available tags

## Privacy

- Your API key is stored securely in Chrome's sync storage
- The extension only communicates with promptpocket.app
- No data is collected or sent to third parties

## Troubleshooting

### "Invalid API key" error

- Ensure you've copied the full API key including the `ppk_` prefix
- Generate a new API key in your account settings if needed

### Context menu not showing

- Reload the extension from chrome://extensions/
- Make sure the extension has the necessary permissions

### Quick save not working

- Ensure you're connected (API key entered)
- Select some text before using the shortcut

## License

MIT License - Part of the PromptPocket application.
