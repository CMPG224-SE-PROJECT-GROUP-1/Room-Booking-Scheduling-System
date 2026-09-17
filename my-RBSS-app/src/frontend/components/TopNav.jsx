import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import LogOut from './LogOut';
import './TopNav.css';

export default function TopNav() {
  return (
    <div className="topnav">
      <div className="nav-left">
        <div className="hamburger"><span /><span /><span /></div>
        <Logo />
      </div>
      <div className="nav-right">
        <ThemeToggle />
        <LogOut />
      </div>
    </div>
  );
}