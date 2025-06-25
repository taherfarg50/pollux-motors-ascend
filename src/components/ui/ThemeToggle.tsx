import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Theme = 'light' | 'dark' | 'system';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme('system');
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const applyTheme = (themeToApply: string) => {
    const root = document.documentElement;
    if (themeToApply === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    } else {
      applyTheme(newTheme);
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'system':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Moon className="w-4 h-4" />;
    }
  };

  const getDescription = () => {
    switch (theme) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'system':
        return 'System';
      default:
        return 'Dark Mode';
    }
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <Moon className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-9 h-9 hover:bg-white/10 transition-all duration-200 relative overflow-hidden group"
        >
          <motion.div
            key={theme}
            initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 180 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {getIcon()}
          </motion.div>
          
          {/* Hover effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          <span className="sr-only">{getDescription()}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-black/90 backdrop-blur-md border-gray-700"
      >
        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className="cursor-pointer hover:bg-white/10 flex items-center gap-3"
        >
          <div className="relative">
            <Sun className="w-4 h-4" />
            {theme === 'light' && (
              <motion.div
                className="absolute -inset-1 bg-yellow-500/20 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </div>
          <span>Light Mode</span>
          {theme === 'light' && (
            <motion.div
              className="ml-auto w-2 h-2 bg-yellow-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleThemeChange('dark')}
          className="cursor-pointer hover:bg-white/10 flex items-center gap-3"
        >
          <div className="relative">
            <Moon className="w-4 h-4" />
            {theme === 'dark' && (
              <motion.div
                className="absolute -inset-1 bg-blue-500/20 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </div>
          <span>Dark Mode</span>
          {theme === 'dark' && (
            <motion.div
              className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleThemeChange('system')}
          className="cursor-pointer hover:bg-white/10 flex items-center gap-3"
        >
          <div className="relative">
            <Monitor className="w-4 h-4" />
            {theme === 'system' && (
              <motion.div
                className="absolute -inset-1 bg-purple-500/20 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </div>
          <span>System</span>
          {theme === 'system' && (
            <motion.div
              className="ml-auto w-2 h-2 bg-purple-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle; 