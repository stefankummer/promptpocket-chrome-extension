// PromptPocket Chrome Extension - Content Script

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'PROMPT_SAVED') {
    showSaveIndicator(request.success);
    sendResponse({ received: true });
  }

  if (request.type === 'GET_SELECTION') {
    const selection = window.getSelection()?.toString() || '';
    sendResponse({ selection: selection.trim() });
  }

  return true;
});

// Show visual feedback when prompt is saved
function showSaveIndicator(success) {
  // Remove existing indicator if any
  const existing = document.getElementById('promptpocket-save-indicator');
  if (existing) {
    existing.remove();
  }

  // Create indicator element
  const indicator = document.createElement('div');
  indicator.id = 'promptpocket-save-indicator';
  indicator.className = `promptpocket-indicator ${success ? 'success' : 'error'}`;

  indicator.innerHTML = `
    <div class="promptpocket-indicator-content">
      ${success ? `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>Saved to PromptPocket!</span>
      ` : `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <span>Failed to save</span>
      `}
    </div>
  `;

  document.body.appendChild(indicator);

  // Animate in
  requestAnimationFrame(() => {
    indicator.classList.add('show');
  });

  // Remove after 3 seconds
  setTimeout(() => {
    indicator.classList.remove('show');
    setTimeout(() => {
      indicator.remove();
    }, 300);
  }, 3000);
}

// Keyboard shortcut handler (Alt + Shift + S)
document.addEventListener('keydown', async (e) => {
  if (e.altKey && e.shiftKey && e.key === 'S') {
    e.preventDefault();

    const selection = window.getSelection()?.toString()?.trim();
    if (!selection) {
      showSaveIndicator(false);
      return;
    }

    // Send to background script for quick save
    chrome.runtime.sendMessage({
      type: 'QUICK_SAVE',
      content: selection,
      tab: {
        url: window.location.href,
        title: document.title
      }
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error:', chrome.runtime.lastError);
        showSaveIndicator(false);
      }
    });
  }
});
