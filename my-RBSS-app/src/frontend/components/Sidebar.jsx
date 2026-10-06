import { useSidebar } from '../Sidebar/SidebarContext';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../backend/User';
import { useMyRole } from '../hooks/useMyRole';

export default function Sidebar() {
  const { isOpen } = useSidebar();
  const navigate = useNavigate();
  const role = useMyRole();

  const onLogout = async (e) => {
    e.preventDefault();
    try {
      await authService.signOut();
    } finally {
      navigate('/', { replace: true });
    }
  };

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
            <Link to={`/mybookings`} className='nav-link'>My Bookings</Link>
        </li>

        {(role === "admin" || role === "manager") &&
          <li>
            <Link to={`/reports`} className='nav-link'>Reports</Link>
          </li>
        }

        {role === "admin" &&
          <li>
            <Link to={`/admin`} className='nav-link'>Admin</Link>
          </li>
        }

        <li>
            <Link to={`/`} className='nav-link' onClick={onLogout}>Logout</Link>
        </li>
      </ul>
    </div>
  );
}