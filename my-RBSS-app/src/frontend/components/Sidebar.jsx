import { useSidebar } from '../Sidebar/SidebarContext';
import './Sidebar.css';
import { Link } from 'react-router-dom';

const navItems = ['Dashboard', 'Browse Rooms', 'My Bookings', 'Log Out'];

export default function Sidebar() {
  const { isOpen } = useSidebar();

  return (
    <div className={`sidebar ${isOpen ? '' : 'sidebar-collapsed'}`}>
      <ul>
        <li>
            <Link to={`/dashboard`} className='nav-link'>Dashboard</Link>
        </li>
        <li>
            <Link to={`/browse`} className='nav-link'>Browse Rooms</Link>
        </li>
        <li>
            <Link to={`/bookings`} className='nav-link'>My Bookings</Link>
        </li>
        <li>
            <Link to={`/`} className='nav-link'>Logout</Link>
        </li>
      </ul>
    </div>
  );
}