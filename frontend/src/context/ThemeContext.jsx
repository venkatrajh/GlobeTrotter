import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // 'light', 'dark', 'system'
  const [glassEnabled, setGlassEnabled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (glassEnabled) {
      root.classList.add('glass-mode');
    } else {
      root.classList.remove('glass-mode');
    }
  }, [theme, glassEnabled]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleGlass = (enabled) => {
    setGlassEnabled(enabled);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, glassEnabled, toggleGlass }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
