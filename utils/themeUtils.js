// themeUtils.js - Theme utility functions using ES6 Arrow Functions & Callbacks

import { THEME_STORAGE_KEY, THEME_MODES, DEFAULT_THEME } from '../Constants/ThemeConstants.js';

// Get current theme from localStorage
export const getCurrentTheme = () => {
  return localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
};

// Save theme to localStorage
export const saveTheme = (theme) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

// Toggle between light and dark themes
export const toggleTheme = (callback) => {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
  saveTheme(newTheme);
  
  // Execute callback if provided
  if (callback && typeof callback === 'function') {
    callback(newTheme);
  }
  
  return newTheme;
};

// Apply theme to the document
export const applyTheme = (theme, callback) => {
  const body = document.body;
  const isDark = theme === THEME_MODES.DARK;
  
  if (isDark) {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
  } else {
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
  }
  
  // Update data attribute for CSS targeting
  body.setAttribute('data-theme', theme);
  
  // Execute callback after theme is applied
  if (callback && typeof callback === 'function') {
    callback(theme);
  }
};

// Initialize theme on page load with callback
export const initializeTheme = (callback) => {
  const theme = getCurrentTheme();
  applyTheme(theme, (appliedTheme) => {
    console.log(`Theme initialized: ${appliedTheme}`);
    
    // Execute additional callback if provided
    if (callback && typeof callback === 'function') {
      callback(appliedTheme);
    }
  });
};

// Update theme toggle button icon
export const updateToggleButton = (theme) => {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  const isDark = theme === THEME_MODES.DARK;
  const sunIcon = toggleBtn.querySelector('.sun-icon');
  const moonIcon = toggleBtn.querySelector('.moon-icon');
  
  if (sunIcon && moonIcon) {
    if (isDark) {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  }
};

// Setup theme toggle button with event listener
export const setupThemeToggle = () => {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  toggleBtn.addEventListener('click', () => {
    // Add transitioning class for animation
    toggleBtn.classList.add('transitioning');
    
    toggleTheme((newTheme) => {
      // Apply theme with callback
      applyTheme(newTheme, (appliedTheme) => {
        // Update button icon
        updateToggleButton(appliedTheme);
        console.log(`Theme switched to: ${appliedTheme}`);
        
        // Remove transitioning class after animation
        setTimeout(() => {
          toggleBtn.classList.remove('transitioning');
        }, 600);
      });
    });
  });
};
