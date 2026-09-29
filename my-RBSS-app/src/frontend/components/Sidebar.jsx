import { useSidebar } from '../Sidebar/SidebarContext';
import './Sidebar.css';

const navItems = ['Dashboard', 'Browse Rooms', 'My Bookings', 'Log Out'];

export default function Sidebar() {
  const { isOpen } = useSidebar();

  return (
    <div className={`sidebar ${isOpen ? '' : 'sidebar-collapsed'}`}>
      <ul>
        {navItems.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}