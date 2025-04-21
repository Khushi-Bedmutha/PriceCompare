import React, { createContext, useContext, useState } from 'react';

// Create the context for dark mode
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode); // Toggle the dark mode
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  return useContext(ThemeContext);
};
