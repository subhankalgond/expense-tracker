import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext(undefined);
export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        try {
            const saved = localStorage.getItem('ledger_theme');
            if (saved === 'light' || saved === 'dark')
                return saved;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        catch {
            return 'light';
        }
    });
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        }
        else {
            root.classList.remove('dark');
        }
        try {
            localStorage.setItem('ledger_theme', theme);
        }
        catch {
            // ignore
        }
    }, [theme]);
    const toggleTheme = () => {
        setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
    };
    const setTheme = (t) => {
        setThemeState(t);
    };
    return (_jsx(ThemeContext.Provider, { value: { theme, toggleTheme, setTheme }, children: children }));
};
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
