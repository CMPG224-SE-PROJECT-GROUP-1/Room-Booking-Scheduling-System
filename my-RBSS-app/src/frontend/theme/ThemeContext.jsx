import { createContext, useEffect, useState, useContext } from "react";

const ThemeContext = createContext(null);

const DEFAULT_THEME = 'dark';

export function ThemeProvider({children}){
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || DEFAULT_THEME);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    function toggleTheme(){
        setTheme(t => (t === 'dark' ? 'light' : 'dark'))
    }

    return(
        <ThemeContext.Provider value = {{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(){
    return useContext(ThemeContext);
}