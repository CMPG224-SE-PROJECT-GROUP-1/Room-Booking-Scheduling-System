import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import LogOut from './LogOut';
import './TopNav.css';
import { useSidebar } from '../Sidebar/SidebarContext';

export default function TopNav() {
  const {toggleSidebar} = useSidebar()
  return (
    <div className="topnav">
      <div className="nav-left">
        <div className="hamburger" onClick={toggleSidebar}>
          <span /><span /><span />
        </div>
        <Logo active={true} />
      </div>
      <div className="nav-right">
        <ThemeToggle />
        <LogOut />
      </div>
    </div>
  );
}


