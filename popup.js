// PromptPocket Chrome Extension - Popup Script

class PromptPocketExtension {
    constructor() {
        this.apiKey = null;
        this.user = null;
        this.settings = {
            apiEndpoint: 'https://promptpocket.app/api/v1',
            defaultStatus: 'published',
            autoGetSelection: true,
            language: 'en',
            theme: 'system',
        };
        this.tools = [];
        this.tags = [];
        this.selectedTools = [];
        this.selectedTags = [];
        this.currentLang = 'en';

        this.init();
    }

    async init() {
        await this.loadSettings();
        this.applyTheme();
        this.applyLanguage();
        await this.loadApiKey();
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    // Localization Methods
    t(key) {
        return LOCALES[this.currentLang]?.[key] || LOCALES.en[key] || key;
    }

    applyLanguage() {
        this.currentLang = this.settings.language || detectLanguage();

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });

        // Update all elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });

        // Update all elements with data-i18n-title attribute
        document.querySelectorAll('[data-i18n-title]').forEach((el) => {
            const key = el.getAttribute('data-i18n-title');
            el.title = this.t(key);
        });

        // Update select options
        document.querySelectorAll('option[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });

        // Update API key link with correct language
        const apiKeyLink = document.getElementById('apiKeyLink');
        if (apiKeyLink) {
            apiKeyLink.href = `https://promptpocket.app/${this.currentLang}/settings/api-key`;
        }

        // Set language selector value
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.value = this.currentLang;
        }
    }

    // Theme Methods
    applyTheme() {
        const theme = this.settings.theme || 'system';
        let effectiveTheme = theme;

        if (theme === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)')
                .matches
                ? 'dark'
                : 'light';
        }

        if (effectiveTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }

        // Set theme selector value
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = theme;
        }
    }

    // Storage Methods
    async loadSettings() {
        const result = await chrome.storage.sync.get(['settings']);
        if (result.settings) {
            this.settings = { ...this.settings, ...result.settings };
        }
    }

    async saveSettings() {
        await chrome.storage.sync.set({ settings: this.settings });
    }

    async loadApiKey() {
        // API key stored locally only (not synced to other devices for security)
        const result = await chrome.storage.local.get(['apiKey']);
        this.apiKey = result.apiKey || null;
    }

    async saveApiKey(key) {
        // Store locally only - more secure than sync
        await chrome.storage.local.set({ apiKey: key });
        this.apiKey = key;
    }

    async clearAllData() {
        await chrome.storage.sync.clear();
        await chrome.storage.local.clear();
        this.apiKey = null;
        this.user = null;
        this.settings = {
            apiEndpoint: 'https://promptpocket.app/api/v1',
            defaultStatus: 'published',
            autoGetSelection: true,
            language: 'en',
            theme: 'system',
        };
    }

    // API Methods
    async apiRequest(endpoint, options = {}) {
        const url = `${this.settings.apiEndpoint}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers: { ...headers, ...options.headers },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || `HTTP error ${response.status}`,
                );
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async validateApiKey(key) {
        const originalKey = this.apiKey;
        this.apiKey = key;

        try {
            const response = await this.apiRequest('/user');
            return response.data;
        } catch (error) {
            this.apiKey = originalKey;
            throw error;
        }
    }

    async fetchTools() {
        try {
            const response = await this.apiRequest('/tools');
            this.tools = response.data || [];
            return this.tools;
        } catch (error) {
            console.error('Failed to fetch tools:', error);
            return [];
        }
    }

    async fetchTags() {
        try {
            const response = await this.apiRequest('/tags');
            this.tags = response.data || [];
            return this.tags;
        } catch (error) {
            console.error('Failed to fetch tags:', error);
            return [];
        }
    }

    async createPrompt(data) {
        return await this.apiRequest('/prompts', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // UI Methods
    showView(viewId) {
        document.querySelectorAll('.view').forEach((view) => {
            view.classList.add('hidden');
        });
        document.getElementById(viewId).classList.remove('hidden');
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        toast.className = 'toast';
        toast.classList.add(type);
        toastMessage.textContent = message;

        // Show toast
        setTimeout(() => toast.classList.add('show'), 10);

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 3000);
    }

    updateUserInfo() {
        if (this.user) {
            const avatar = document.getElementById('userAvatar');
            const name = document.getElementById('userName');

            avatar.textContent = (this.user.name || this.user.pseudo || 'U')
                .charAt(0)
                .toUpperCase();
            name.textContent = this.user.name || this.user.pseudo || 'User';
        }
    }

    // Multi-select handlers
    setupMultiSelect(type) {
        const items = type === 'tools' ? this.tools : this.tags;
        const selected =
            type === 'tools' ? this.selectedTools : this.selectedTags;
        const searchInput = document.getElementById(`${type}Search`);
        const dropdown = document.getElementById(`${type}Dropdown`);
        const list = document.getElementById(`${type}List`);
        const selectedContainer = document.getElementById(
            `selected${type.charAt(0).toUpperCase() + type.slice(1)}`,
        );

        const renderSelected = () => {
            selectedContainer.innerHTML = selected
                .map(
                    (item) => `
        <span class="selected-item ${item.is_public ? 'public' : ''}">
          ${this.escapeHtml(item.name)}
          <button type="button" data-name="${this.escapeHtml(item.name)}" title="${this.t('remove')}">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </span>
      `,
                )
                .join('');

            // Add remove handlers
            selectedContainer.querySelectorAll('button').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const name = btn.dataset.name;
                    const index = selected.findIndex((i) => i.name === name);
                    if (index > -1) {
                        selected.splice(index, 1);
                        renderSelected();
                        renderDropdown();
                    }
                });
            });
        };

        const renderDropdown = (filter = '') => {
            const filterLower = filter.toLowerCase();
            const filtered = items.filter(
                (item) =>
                    item.name.toLowerCase().includes(filterLower) &&
                    !selected.some((s) => s.name === item.name),
            );

            let html = '';

            // Show filtered items
            filtered.slice(0, 10).forEach((item) => {
                html += `
          <div class="dropdown-item" data-name="${this.escapeHtml(item.name)}" data-public="${item.is_public}">
            <span>${this.escapeHtml(item.name)}</span>
            <span class="badge ${item.is_public ? 'public' : ''}">${item.is_public ? this.t('public') : this.t('private')}</span>
          </div>
        `;
            });

            // Show "create new" option if filter doesn't match any item exactly
            if (
                filter &&
                !items.some((i) => i.name.toLowerCase() === filterLower) &&
                !selected.some((s) => s.name.toLowerCase() === filterLower)
            ) {
                html += `
          <div class="dropdown-item create-new" data-create="${this.escapeHtml(filter)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            ${this.t('create')} "${this.escapeHtml(filter)}"
          </div>
        `;
            }

            if (!html) {
                html = `<div class="dropdown-empty">${this.t('noItemsFound')}</div>`;
            }

            list.innerHTML = html;

            // Add click handlers
            list.querySelectorAll(
                '.dropdown-item:not(.dropdown-empty)',
            ).forEach((item) => {
                item.addEventListener('click', () => {
                    if (item.dataset.create) {
                        // Create new item
                        selected.push({
                            name: item.dataset.create,
                            is_public: false,
                            isNew: true,
                        });
                    } else {
                        // Select existing item
                        const existingItem = items.find(
                            (i) => i.name === item.dataset.name,
                        );
                        if (existingItem) {
                            selected.push(existingItem);
                        }
                    }
                    searchInput.value = '';
                    renderSelected();
                    renderDropdown();
                    searchInput.focus();
                });
            });
        };

        // Input events
        searchInput.addEventListener('focus', () => {
            dropdown.classList.remove('hidden');
            renderDropdown(searchInput.value);
        });

        searchInput.addEventListener('input', () => {
            renderDropdown(searchInput.value);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = searchInput.value.trim();
                if (value) {
                    const existing = items.find(
                        (i) => i.name.toLowerCase() === value.toLowerCase(),
                    );
                    if (
                        existing &&
                        !selected.some((s) => s.name === existing.name)
                    ) {
                        selected.push(existing);
                    } else if (
                        !selected.some(
                            (s) => s.name.toLowerCase() === value.toLowerCase(),
                        )
                    ) {
                        selected.push({
                            name: value,
                            is_public: false,
                            isNew: true,
                        });
                    }
                    searchInput.value = '';
                    renderSelected();
                    renderDropdown();
                }
            } else if (
                e.key === 'Backspace' &&
                !searchInput.value &&
                selected.length > 0
            ) {
                selected.pop();
                renderSelected();
                renderDropdown();
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!document.getElementById(`${type}Select`).contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });

        // Initial render
        renderSelected();
        renderDropdown();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Auth & State Management
    async checkAuthStatus() {
        if (!this.apiKey) {
            this.showView('loginView');
            return;
        }

        this.showLoading();

        try {
            this.user = await this.validateApiKey(this.apiKey);
            await this.loadDataAndShowMain();
        } catch (error) {
            console.error('Auth check failed:', error);
            this.apiKey = null;
            await chrome.storage.local.remove(['apiKey']);
            this.showView('loginView');
            this.showToast(this.t('sessionExpired'), 'error');
        } finally {
            this.hideLoading();
        }
    }

    async loadDataAndShowMain() {
        this.showLoading();

        try {
            // Fetch tools and tags in parallel
            await Promise.all([this.fetchTools(), this.fetchTags()]);

            this.updateUserInfo();
            this.showView('mainView');

            // Setup multi-selects
            this.selectedTools = [];
            this.selectedTags = [];
            this.setupMultiSelect('tools');
            this.setupMultiSelect('tags');

            // Apply default settings
            document.getElementById('promptStatus').value =
                this.settings.defaultStatus;

            // Check for pending selection (from context menu)
            const pending = await chrome.storage.local.get([
                'pendingSelection',
            ]);
            if (pending.pendingSelection) {
                document.getElementById('promptContent').value =
                    pending.pendingSelection;
                // Clear it
                await chrome.storage.local.remove(['pendingSelection']);
            } else if (this.settings.autoGetSelection) {
                // Auto-get selection from active tab if enabled
                this.getSelectedText();
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            this.showToast(this.t('failedToLoad'), 'error');
        } finally {
            this.hideLoading();
        }
    }

    async getSelectedText() {
        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });
            if (tab?.id) {
                const results = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => window.getSelection()?.toString() || '',
                });

                if (results?.[0]?.result) {
                    const selectedText = results[0].result.trim();
                    if (selectedText) {
                        document.getElementById('promptContent').value =
                            selectedText;
                    }
                }
            }
        } catch (error) {
            console.error('Failed to get selection:', error);
        }
    }

    resetForm() {
        document.getElementById('promptForm').reset();
        document.getElementById('promptStatus').value =
            this.settings.defaultStatus;
        this.selectedTools = [];
        this.selectedTags = [];
        this.setupMultiSelect('tools');
        this.setupMultiSelect('tags');
    }

    // Event Listeners
    setupEventListeners() {
        // Listen for system theme changes
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', () => {
                if (this.settings.theme === 'system') {
                    this.applyTheme();
                }
            });

        // Connect button
        document
            .getElementById('connectBtn')
            .addEventListener('click', async () => {
                const apiKeyInput = document.getElementById('apiKeyInput');
                const key = apiKeyInput.value.trim();

                if (!key) {
                    this.showToast(this.t('enterApiKey'), 'error');
                    return;
                }

                this.showLoading();

                try {
                    this.user = await this.validateApiKey(key);
                    await this.saveApiKey(key);
                    await this.loadDataAndShowMain();
                    this.showToast(this.t('connectedSuccess'), 'success');
                } catch (error) {
                    this.showToast(
                        error.message || this.t('invalidApiKey'),
                        'error',
                    );
                } finally {
                    this.hideLoading();
                }
            });

        // API key input - Enter to submit
        document
            .getElementById('apiKeyInput')
            .addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('connectBtn').click();
                }
            });

        // Logout button
        document
            .getElementById('logoutBtn')
            .addEventListener('click', async () => {
                await chrome.storage.local.remove(['apiKey']);
                this.apiKey = null;
                this.user = null;
                this.showView('loginView');
                document.getElementById('apiKeyInput').value = '';
                this.showToast(this.t('loggedOut'), 'success');
            });

        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            // Load current settings into form
            document.getElementById('apiEndpoint').value =
                this.settings.apiEndpoint;
            document.getElementById('defaultStatus').value =
                this.settings.defaultStatus;
            document.getElementById('autoGetSelection').checked =
                this.settings.autoGetSelection;
            document.getElementById('languageSelect').value =
                this.settings.language || 'en';
            document.getElementById('themeSelect').value =
                this.settings.theme || 'system';
            this.showView('settingsView');
        });

        // Back button
        document.getElementById('backBtn').addEventListener('click', () => {
            if (this.apiKey) {
                this.showView('mainView');
            } else {
                this.showView('loginView');
            }
        });

        // Save settings
        document
            .getElementById('saveSettingsBtn')
            .addEventListener('click', async () => {
                this.settings.apiEndpoint = document
                    .getElementById('apiEndpoint')
                    .value.trim()
                    .replace(/\/$/, '');
                this.settings.defaultStatus =
                    document.getElementById('defaultStatus').value;
                this.settings.autoGetSelection =
                    document.getElementById('autoGetSelection').checked;
                this.settings.language =
                    document.getElementById('languageSelect').value;
                this.settings.theme =
                    document.getElementById('themeSelect').value;

                await this.saveSettings();

                // Apply changes immediately
                this.applyTheme();
                this.applyLanguage();

                this.showToast(this.t('settingsSaved'), 'success');

                if (this.apiKey) {
                    this.showView('mainView');
                } else {
                    this.showView('loginView');
                }
            });

        // Clear data
        document
            .getElementById('clearDataBtn')
            .addEventListener('click', async () => {
                if (confirm(this.t('clearDataConfirm'))) {
                    await this.clearAllData();
                    this.applyTheme();
                    this.applyLanguage();
                    this.showView('loginView');
                    document.getElementById('apiKeyInput').value = '';
                    this.showToast(this.t('dataCleaned'), 'success');
                }
            });

        // Tab switching
        document.querySelectorAll('.tab').forEach((tab) => {
            tab.addEventListener('click', () => {
                document
                    .querySelectorAll('.tab')
                    .forEach((t) => t.classList.remove('active'));
                document
                    .querySelectorAll('.tab-content')
                    .forEach((c) => c.classList.remove('active'));

                tab.classList.add('active');
                document
                    .getElementById(`${tab.dataset.tab}Tab`)
                    .classList.add('active');
            });
        });

        // Get selection button
        document
            .getElementById('getSelectionBtn')
            .addEventListener('click', () => {
                this.getSelectedText();
            });

        // Prompt form submission
        document
            .getElementById('promptForm')
            .addEventListener('submit', async (e) => {
                e.preventDefault();

                const title = document
                    .getElementById('promptTitle')
                    .value.trim();
                const content = document
                    .getElementById('promptContent')
                    .value.trim();
                const description = document
                    .getElementById('promptDescription')
                    .value.trim();
                const notes = document
                    .getElementById('promptNotes')
                    .value.trim();
                const status = document.getElementById('promptStatus').value;
                const isPublic =
                    document.getElementById('promptPublic').checked;

                if (!title || !content) {
                    this.showToast(this.t('titleContentRequired'), 'error');
                    return;
                }

                this.showLoading();

                try {
                    const data = {
                        title,
                        content,
                        status,
                        is_public: isPublic,
                    };

                    if (description) data.description = description;
                    if (notes) data.notes = notes;
                    if (this.selectedTools.length > 0) {
                        data.ai_tools = this.selectedTools.map((t) => t.name);
                    }
                    if (this.selectedTags.length > 0) {
                        data.tags = this.selectedTags.map((t) => t.name);
                    }

                    const response = await this.createPrompt(data);

                    this.showToast(this.t('promptSaved'), 'success');
                    this.resetForm();

                    // Refresh tools and tags to include newly created ones
                    await Promise.all([this.fetchTools(), this.fetchTags()]);
                } catch (error) {
                    this.showToast(
                        error.message || this.t('failedToSave'),
                        'error',
                    );
                } finally {
                    this.hideLoading();
                }
            });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PromptPocketExtension();
});
