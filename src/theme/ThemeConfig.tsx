import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React, { useState, useEffect, createContext, useContext } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDarkMode: false,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<string>(
    () => localStorage.getItem(storageKey) || defaultTheme
  );
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove the old theme class
    root.classList.remove('light', 'dark');
    
    // Add the new theme class
    let newTheme = theme;
    if (theme === 'system') {
      newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    root.classList.add(newTheme);
    setIsDarkMode(newTheme === 'dark');
    
    // Save to localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme={defaultTheme}
        enableSystem
        {...props}
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
}
