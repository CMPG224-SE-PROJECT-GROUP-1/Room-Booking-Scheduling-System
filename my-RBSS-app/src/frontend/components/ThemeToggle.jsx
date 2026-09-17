import './ThemeToggle.css';
import { useTheme } from '../theme/ThemeContext';

export default function ThemeToggle(){
    const {theme, toggleTheme} = useTheme(); // from ThemeContext

    return (

        <div className="theme-switch-group">
            <span className="mode-tag">Light</span>
            
            <div className={`toggle ${theme === 'light' ? 'is-light' : ''}`} onClick={toggleTheme}>
            <div className="knob" />
            </div>
            <span className="mode-tag">Dark</span>
        </div>

    )

}