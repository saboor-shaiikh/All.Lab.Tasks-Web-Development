// ThemeConstants.js - Theme configuration constants using ES6

// Theme storage key for localStorage
export const THEME_STORAGE_KEY = 'stridegear-theme';

// Theme modes
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Default theme
export const DEFAULT_THEME = THEME_MODES.LIGHT;

// Theme classes for styling
export const THEME_CLASSES = {
  LIGHT: {
    body: 'bg-gray-50 text-gray-900',
    navbar: 'bg-white text-gray-900 border-gray-200',
    card: 'bg-white text-gray-900',
    footer: 'bg-gray-900 text-white'
  },
  DARK: {
    body: 'bg-gray-900 text-white',
    navbar: 'bg-gray-800 text-white border-gray-700',
    card: 'bg-gray-800 text-white',
    footer: 'bg-black text-gray-300'
  }
};
