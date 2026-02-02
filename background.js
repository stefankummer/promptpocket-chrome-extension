// PromptPocket Chrome Extension - Background Service Worker

// Default settings
const DEFAULT_SETTINGS = {
    apiEndpoint: 'https://promptpocket.app/api/v1',
    defaultStatus: 'published',
    autoGetSelection: true,
};

// Create context menu on install
// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
    // Clear existing menus to avoid duplicates and ensure clean state
    chrome.contextMenus.removeAll(async () => {
        // Check initial auth state
        const { apiKey } = await chrome.storage.local.get(['apiKey']);
        const enabled = !!apiKey;

        chrome.contextMenus.create({
            id: 'saveToPromptPocket',
            title: chrome.i18n.getMessage('contextMenuSave'),
            contexts: ['selection'],
            enabled: enabled,
        });

        chrome.contextMenus.create({
            id: 'quickSaveToPromptPocket',
            title: chrome.i18n.getMessage('contextMenuQuickSave'),
            contexts: ['selection'],
            enabled: enabled,
        });
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'saveToPromptPocket') {
        // Store selected text and open popup
        await chrome.storage.local.set({
            pendingSelection: info.selectionText,
            sourceUrl: tab.url,
            sourceTitle: tab.title,
        });

        // Open the popup
        chrome.action.openPopup();
    } else if (info.menuItemId === 'quickSaveToPromptPocket') {
        // Quick save directly
        await quickSavePrompt(info.selectionText, tab);
    }
});

// Quick save function
async function quickSavePrompt(content, tab) {
    try {
        // Get API key from local storage (secure, not synced)
        const localData = await chrome.storage.local.get(['apiKey']);
        const syncData = await chrome.storage.sync.get(['settings']);

        const apiKey = localData.apiKey;
        const mergedSettings = { ...DEFAULT_SETTINGS, ...syncData.settings };

        if (!apiKey) {
            // Notify user to connect first
            await sendNotification(
                chrome.i18n.getMessage('notificationConnect'),
                'error',
            );
            chrome.action.openPopup();
            return;
        }

        // Create a title from the content (first 50 chars or first line)
        const firstLine = content.split('\n')[0].trim();
        const title =
            firstLine.length > 50
                ? firstLine.substring(0, 47) + '...'
                : firstLine;

        // Make API request
        const response = await fetch(`${mergedSettings.apiEndpoint}/prompts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                title: title || 'Quick Save',
                content: content,
                status: mergedSettings.defaultStatus,
                is_public: false,
                notes: `Saved from: ${tab.url}`,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to save');
        }

        // Send success notification
        await sendNotification(
            chrome.i18n.getMessage('notificationSaved'),
            'success',
        );

        // Send message to content script to show visual feedback
        // Send message to content script to show visual feedback
        const sendMessage = async () => {
            console.log(
                'PromptPocket: Sending PROMPT_SAVED message to tab',
                tab.id,
            );
            return chrome.tabs.sendMessage(tab.id, {
                type: 'PROMPT_SAVED',
                success: true,
            });
        };

        try {
            await sendMessage();
            console.log('PromptPocket: Message sent successfully');
        } catch (e) {
            console.warn(
                'PromptPocket: First attempt failed, trying to inject script and retry',
                e,
            );
            // If failed, try to inject the script first
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js'],
                });
                // Wait a small moment for script to initialize
                await new Promise((resolve) => setTimeout(resolve, 100));
                await sendMessage();
                console.log(
                    'PromptPocket: Message sent successfully after injection',
                );
            } catch (retryError) {
                console.error(
                    'PromptPocket: Failed to send message even after injection',
                    retryError,
                );
            }
        }
    } catch (error) {
        console.error('Quick save error:', error);
        await sendNotification(
            error.message || chrome.i18n.getMessage('notificationFailed'),
            'error',
        );
    }
}

// Send notification helper
async function sendNotification(message, type = 'info') {
    // Use chrome notifications API
    const iconPath =
        type === 'success' ? 'icons/icon48.png' : 'icons/icon48.png';

    chrome.notifications.create({
        type: 'basic',
        iconUrl: iconPath,
        title: 'PromptPocket',
        message: message,
        priority: 1,
    });
}

// Listen for keyboard shortcuts
chrome.commands?.onCommand?.addListener(async (command) => {
    if (command === 'quick-save') {
        // Get current tab and selection
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        if (!tab?.id) return;

        try {
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => window.getSelection()?.toString() || '',
            });

            const selectedText = results?.[0]?.result?.trim();
            if (selectedText) {
                // Ensure content script is injected before saving
                try {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js'],
                    });
                } catch (e) {
                    // Ignore if already injected or other error, we try to save anyway
                    console.log('Script injection attempted', e);
                }
                await quickSavePrompt(selectedText, tab);
            } else {
                await sendNotification(
                    chrome.i18n.getMessage('notificationSelectText'),
                    'error',
                );
            }
        } catch (error) {
            console.error('Failed to get selection:', error);
        }
    }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_PENDING_SELECTION') {
        chrome.storage.local.get(
            ['pendingSelection', 'sourceUrl', 'sourceTitle'],
            (data) => {
                sendResponse(data);
                // Clear pending selection
                chrome.storage.local.remove([
                    'pendingSelection',
                    'sourceUrl',
                    'sourceTitle',
                ]);
            },
        );
        return true; // Keep channel open for async response
    }

    if (request.type === 'QUICK_SAVE') {
        quickSavePrompt(request.content, request.tab)
            .then(() => {
                sendResponse({ success: true });
            })
            .catch((error) => {
                sendResponse({ success: false, error: error.message });
            });
        return true;
    }
});

// Update context menu based on auth status
async function updateContextMenu() {
    // API key stored in local storage (not synced for security)
    const { apiKey } = await chrome.storage.local.get(['apiKey']);

    chrome.contextMenus.update('saveToPromptPocket', {
        enabled: !!apiKey,
    });

    chrome.contextMenus.update('quickSaveToPromptPocket', {
        enabled: !!apiKey,
    });
}

// Listen for storage changes to update context menu
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.apiKey) {
        updateContextMenu();
    }
});

// Initial context menu update
// Initial context menu update not needed as onInstalled handles creation with correct state
// and menus persist across restarts. Checks will happen via on storage change.
