import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@skin_cancer_app_theme';

// Light theme colors
const lightColors = {
    primary: '#2E86DE',
    secondary: '#54A0FF',
    success: '#26DE81',
    danger: '#FC5C65',
    warning: '#FD9644',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    border: '#E1E8ED',
    overlay: 'rgba(0, 0, 0, 0.5)',
};

// Dark theme colors
const darkColors = {
    primary: '#54A0FF',
    secondary: '#2E86DE',
    success: '#26DE81',
    danger: '#FC5C65',
    warning: '#FD9644',
    background: '#1A1A2E',
    surface: '#16213E',
    text: '#EAEAEA',
    textSecondary: '#A0A0A0',
    border: '#2D3748',
    overlay: 'rgba(0, 0, 0, 0.7)',
};

// Static values that don't change with theme
const staticTheme = {
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 999,
    },
    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 24,
        xxl: 32,
    },
    fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
        },
    },
};

// Create theme object based on dark mode
export const getTheme = (isDark) => ({
    colors: isDark ? darkColors : lightColors,
    ...staticTheme,
});

// Context
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState('auto'); // 'auto', 'light', 'dark'
    const [isLoading, setIsLoading] = useState(true);

    // Load saved preference
    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedMode) {
                setThemeMode(savedMode);
            }
        } catch (error) {
            console.error('Failed to load theme preference:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveThemePreference = async (mode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    // Determine if dark mode is active
    const isDark = themeMode === 'auto'
        ? systemColorScheme === 'dark'
        : themeMode === 'dark';

    const theme = getTheme(isDark);

    const setTheme = (mode) => {
        setThemeMode(mode);
        saveThemePreference(mode);
    };

    const toggleTheme = () => {
        const newMode = isDark ? 'light' : 'dark';
        setTheme(newMode);
    };

    const setAutoMode = () => {
        setTheme('auto');
    };

    const value = {
        theme,
        isDark,
        themeMode,
        toggleTheme,
        setTheme,
        setAutoMode,
        isLoading,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

// Export default theme for backward compatibility during initial render
export const theme = getTheme(false);
