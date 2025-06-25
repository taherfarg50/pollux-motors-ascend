import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to dark theme for Pollux Motors luxury feel
  const [theme, setTheme] = useState<Theme>('dark');

  // Update theme in localStorage and document
  const updateTheme = (newTheme: Theme) => {
    localStorage.setItem('pollux-theme', newTheme);
    
    // Update document class
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      updateTheme(newTheme);
      return newTheme;
    });
  };

  // Handle manual theme setting
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    updateTheme(newTheme);
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('pollux-theme') as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      updateTheme(savedTheme);
    } else {
      // If no saved preference, use system preference but default to dark if not available
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      setTheme(systemTheme);
      updateTheme(systemTheme);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only apply system preference if user hasn't set a preference
      if (!localStorage.getItem('pollux-theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        updateTheme(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 