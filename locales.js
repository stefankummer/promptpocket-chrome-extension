// PromptPocket Chrome Extension - Localization

const LOCALES = {
  en: {
    // Header
    appName: 'PromptPocket',
    settings: 'Settings',

    // Login
    connectTitle: 'Connect to PromptPocket',
    connectDescription: 'Enter your API key to start saving prompts from any website.',
    apiKey: 'API Key',
    apiKeyPlaceholder: 'ppk_XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX',
    connect: 'Connect',
    findApiKey: 'Find your API key in your',
    accountSettings: 'account settings',

    // Main view
    logout: 'Logout',
    addPrompt: 'Add Prompt',
    quickSave: 'Quick Save',

    // Form
    title: 'Title',
    titlePlaceholder: 'Enter prompt title',
    content: 'Content',
    contentPlaceholder: 'Enter your prompt content...',
    getSelectedText: 'Get selected text',
    description: 'Description',
    descriptionPlaceholder: 'Brief description (optional)',
    folder: 'Folder',
    searchFolder: 'Search or create folder...',
    noFolder: 'No folder',
    createFolder: 'Create folder',
    aiTools: 'AI Tools',
    searchTools: 'Search or add tools...',
    tags: 'Tags',
    searchTags: 'Search or add tags...',
    notes: 'Notes (private)',
    notesPlaceholder: 'Personal notes, only visible to you...',
    status: 'Status',
    published: 'Published',
    draft: 'Draft',
    visibility: 'Visibility',
    private: 'Private',
    publicVisibility: 'Public',
    savePrompt: 'Save Prompt',

    // Quick save tab
    quickSaveTitle: 'Quick Save',
    quickSaveDescription: 'Select text on any webpage and right-click to quickly save it as a prompt.',
    keyboardShortcut: 'Or use the keyboard shortcut:',

    // Settings
    settingsTitle: 'Settings',
    apiEndpoint: 'API Endpoint',
    defaultStatus: 'Default Status',
    language: 'Language',
    theme: 'Theme',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    autoFill: 'Auto-fill with selected text',
    saveSettings: 'Save Settings',
    dangerZone: 'Danger Zone',
    clearAllData: 'Clear All Data',
    clearDataConfirm: 'Are you sure you want to clear all data? This will log you out and reset all settings.',
    clearDataHint: 'This only removes local data and disconnects the extension. Your PromptPocket account is not affected.',

    // Multi-select
    public: 'Public',
    private: 'Private',
    create: 'Create',
    noItemsFound: 'No items found',

    // Messages
    connectedSuccess: 'Connected successfully!',
    loggedOut: 'Logged out',
    settingsSaved: 'Settings saved',
    dataCleaned: 'All data cleared',
    promptSaved: 'Prompt saved successfully!',
    enterApiKey: 'Please enter your API key',
    invalidApiKey: 'Invalid API key',
    sessionExpired: 'Session expired. Please reconnect.',
    failedToLoad: 'Failed to load data',
    titleContentRequired: 'Title and content are required',
    failedToSave: 'Failed to save prompt',
    remove: 'Remove',
    privacyPolicy: 'Privacy Policy'
  },

  fr: {
    // Header
    appName: 'PromptPocket',
    settings: 'Paramètres',

    // Login
    connectTitle: 'Connexion à PromptPocket',
    connectDescription: 'Entrez votre clé API pour commencer à enregistrer des prompts depuis n\'importe quel site.',
    apiKey: 'Clé API',
    apiKeyPlaceholder: 'ppk_XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX',
    connect: 'Connexion',
    findApiKey: 'Trouvez votre clé API dans vos',
    accountSettings: 'paramètres de compte',

    // Main view
    logout: 'Déconnexion',
    addPrompt: 'Ajouter un prompt',
    quickSave: 'Sauvegarde rapide',

    // Form
    title: 'Titre',
    titlePlaceholder: 'Entrez le titre du prompt',
    content: 'Contenu',
    contentPlaceholder: 'Entrez le contenu de votre prompt...',
    getSelectedText: 'Récupérer le texte sélectionné',
    description: 'Description',
    descriptionPlaceholder: 'Brève description (optionnel)',
    folder: 'Dossier',
    searchFolder: 'Rechercher ou créer un dossier...',
    noFolder: 'Aucun dossier',
    createFolder: 'Créer le dossier',
    aiTools: 'Outils IA',
    searchTools: 'Rechercher ou ajouter des outils...',
    tags: 'Tags',
    searchTags: 'Rechercher ou ajouter des tags...',
    notes: 'Notes (privées)',
    notesPlaceholder: 'Notes personnelles, visibles uniquement par vous...',
    status: 'Statut',
    published: 'Publié',
    draft: 'Brouillon',
    visibility: 'Visibilité',
    private: 'Privé',
    publicVisibility: 'Public',
    savePrompt: 'Enregistrer le prompt',

    // Quick save tab
    quickSaveTitle: 'Sauvegarde rapide',
    quickSaveDescription: 'Sélectionnez du texte sur n\'importe quelle page et faites un clic droit pour l\'enregistrer rapidement comme prompt.',
    keyboardShortcut: 'Ou utilisez le raccourci clavier :',

    // Settings
    settingsTitle: 'Paramètres',
    apiEndpoint: 'Point d\'accès API',
    defaultStatus: 'Statut par défaut',
    language: 'Langue',
    theme: 'Thème',
    themeSystem: 'Système',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    autoFill: 'Remplir automatiquement avec le texte sélectionné',
    saveSettings: 'Enregistrer',
    dangerZone: 'Zone de danger',
    clearAllData: 'Effacer toutes les données',
    clearDataConfirm: 'Êtes-vous sûr de vouloir effacer toutes les données ? Cela vous déconnectera et réinitialisera tous les paramètres.',
    clearDataHint: 'Cela supprime uniquement les données locales et déconnecte l\'extension. Votre compte PromptPocket n\'est pas affecté.',

    // Multi-select
    public: 'Public',
    private: 'Privé',
    create: 'Créer',
    noItemsFound: 'Aucun élément trouvé',

    // Messages
    connectedSuccess: 'Connecté avec succès !',
    loggedOut: 'Déconnecté',
    settingsSaved: 'Paramètres enregistrés',
    dataCleaned: 'Toutes les données effacées',
    promptSaved: 'Prompt enregistré avec succès !',
    enterApiKey: 'Veuillez entrer votre clé API',
    invalidApiKey: 'Clé API invalide',
    sessionExpired: 'Session expirée. Veuillez vous reconnecter.',
    failedToLoad: 'Échec du chargement des données',
    titleContentRequired: 'Le titre et le contenu sont requis',
    failedToSave: 'Échec de l\'enregistrement du prompt',
    remove: 'Supprimer',
    privacyPolicy: 'Politique de confidentialité'
  },

  de: {
    // Header
    appName: 'PromptPocket',
    settings: 'Einstellungen',

    // Login
    connectTitle: 'Mit PromptPocket verbinden',
    connectDescription: 'Geben Sie Ihren API-Schlüssel ein, um Prompts von jeder Website zu speichern.',
    apiKey: 'API-Schlüssel',
    apiKeyPlaceholder: 'ppk_XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX',
    connect: 'Verbinden',
    findApiKey: 'Finden Sie Ihren API-Schlüssel in Ihren',
    accountSettings: 'Kontoeinstellungen',

    // Main view
    logout: 'Abmelden',
    addPrompt: 'Prompt hinzufügen',
    quickSave: 'Schnellspeichern',

    // Form
    title: 'Titel',
    titlePlaceholder: 'Prompt-Titel eingeben',
    content: 'Inhalt',
    contentPlaceholder: 'Geben Sie Ihren Prompt-Inhalt ein...',
    getSelectedText: 'Ausgewählten Text abrufen',
    description: 'Beschreibung',
    descriptionPlaceholder: 'Kurze Beschreibung (optional)',
    folder: 'Ordner',
    searchFolder: 'Ordner suchen oder erstellen...',
    noFolder: 'Kein Ordner',
    createFolder: 'Ordner erstellen',
    aiTools: 'KI-Tools',
    searchTools: 'Tools suchen oder hinzufügen...',
    tags: 'Tags',
    searchTags: 'Tags suchen oder hinzufügen...',
    notes: 'Notizen (privat)',
    notesPlaceholder: 'Persönliche Notizen, nur für Sie sichtbar...',
    status: 'Status',
    published: 'Veröffentlicht',
    draft: 'Entwurf',
    visibility: 'Sichtbarkeit',
    private: 'Privat',
    publicVisibility: 'Öffentlich',
    savePrompt: 'Prompt speichern',

    // Quick save tab
    quickSaveTitle: 'Schnellspeichern',
    quickSaveDescription: 'Wählen Sie Text auf einer beliebigen Webseite aus und klicken Sie mit der rechten Maustaste, um ihn schnell als Prompt zu speichern.',
    keyboardShortcut: 'Oder verwenden Sie die Tastenkombination:',

    // Settings
    settingsTitle: 'Einstellungen',
    apiEndpoint: 'API-Endpunkt',
    defaultStatus: 'Standardstatus',
    language: 'Sprache',
    theme: 'Design',
    themeSystem: 'System',
    themeLight: 'Hell',
    themeDark: 'Dunkel',
    autoFill: 'Automatisch mit ausgewähltem Text ausfüllen',
    saveSettings: 'Speichern',
    dangerZone: 'Gefahrenzone',
    clearAllData: 'Alle Daten löschen',
    clearDataConfirm: 'Sind Sie sicher, dass Sie alle Daten löschen möchten? Dies meldet Sie ab und setzt alle Einstellungen zurück.',
    clearDataHint: 'Dies entfernt nur lokale Daten und trennt die Erweiterung. Ihr PromptPocket-Konto ist nicht betroffen.',

    // Multi-select
    public: 'Öffentlich',
    private: 'Privat',
    create: 'Erstellen',
    noItemsFound: 'Keine Elemente gefunden',

    // Messages
    connectedSuccess: 'Erfolgreich verbunden!',
    loggedOut: 'Abgemeldet',
    settingsSaved: 'Einstellungen gespeichert',
    dataCleaned: 'Alle Daten gelöscht',
    promptSaved: 'Prompt erfolgreich gespeichert!',
    enterApiKey: 'Bitte geben Sie Ihren API-Schlüssel ein',
    invalidApiKey: 'Ungültiger API-Schlüssel',
    sessionExpired: 'Sitzung abgelaufen. Bitte erneut verbinden.',
    failedToLoad: 'Laden der Daten fehlgeschlagen',
    titleContentRequired: 'Titel und Inhalt sind erforderlich',
    failedToSave: 'Speichern des Prompts fehlgeschlagen',
    remove: 'Entfernen',
    privacyPolicy: 'Datenschutzrichtlinie'
  }
};

// Detect browser language
function detectLanguage() {
  const browserLang = navigator.language.split('-')[0];
  return LOCALES[browserLang] ? browserLang : 'en';
}

// Get translation
function t(key, lang = null) {
  const locale = lang || detectLanguage();
  return LOCALES[locale]?.[key] || LOCALES.en[key] || key;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LOCALES, detectLanguage, t };
}
