import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import './Banner.css';
import { useSidebar } from '../Sidebar/SidebarContext';

export default function TopNav() {
  const {toggleSidebar} = useSidebar()
  return (
    <div className="banner">
      <div className="banner-left">
        <Logo />
      </div>
      <div className="banner-right">
        <ThemeToggle />
      </div>
    </div>
  );
}


