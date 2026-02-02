// Content script for PromptPocket
// Create a container for notifications if it doesn't exist
let notificationContainer = null;

function getNotificationContainer() {
    if (notificationContainer) return notificationContainer;

    const container = document.createElement('div');
    container.id = 'promptpocket-notification-root';

    // Attach to shadow DOM to isolate styles
    const shadow = container.attachShadow({ mode: 'open' });

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification-wrapper {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            pointer-events: none;
        }
        
        .toast {
            background: #1f2937;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 10px;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3sease;
            font-size: 14px;
            font-weight: 500;
            border: 1px solid #374151;
            pointer-events: auto;
        }
        
        .toast.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .toast.success {
            border-left: 4px solid #10b981;
        }
        
        .toast.error {
            border-left: 4px solid #ef4444;
        }
        
        .icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'notification-wrapper';

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    document.body.appendChild(container); // Append to body, not document

    notificationContainer = { shadow, wrapper };
    return notificationContainer;
}

function showNotification(message, type = 'success') {
    const { wrapper } = getNotificationContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // SVG Icons
    const successIcon = `<svg class="icon" fill="none" stroke="#10b981" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
    const errorIcon = `<svg class="icon" fill="none" stroke="#ef4444" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;

    toast.innerHTML = `
        ${type === 'success' ? successIcon : errorIcon}
        <span>${message}</span>
    `;

    wrapper.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('visible');
    });

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => {
            if (wrapper.contains(toast)) {
                wrapper.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'PROMPT_SAVED') {
        if (request.success) {
            showNotification(
                chrome.i18n.getMessage('notificationSaved'),
                'success',
            );
        } else {
            // Although currently background.js might not send error here, we support it
            showNotification(
                request.error || chrome.i18n.getMessage('notificationFailed'),
                'error',
            );
        }
    }
});
