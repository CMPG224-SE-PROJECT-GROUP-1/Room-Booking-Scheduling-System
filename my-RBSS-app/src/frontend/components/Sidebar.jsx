import { useEffect, useRef } from 'react';
import { useSidebar } from '../Sidebar/SidebarContext';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../backend/User';
import { useMyRole } from '../hooks/useMyRole';

export default function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const navigate = useNavigate();
  const role = useMyRole();
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeSidebar]);

  const onLogout = async (e) => {
    e.preventDefault();
    if (closeSidebar) closeSidebar();
    try {
      await authService.signOut();
    } finally {
      navigate('/', { replace: true });
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`sidebar ${isOpen ? '' : 'sidebar-collapsed'}`}
    >
      <ul>
        <li>
          <Link to="/dashboard" className="nav-link" onClick={closeSidebar}>Dashboard</Link>
        </li>
        <li>
          <Link to="/browse" className="nav-link" onClick={closeSidebar}>Browse Rooms</Link>
        </li>
        <li>
          <Link to="/mybookings" className="nav-link" onClick={closeSidebar}>My Bookings</Link>
        </li>

        {(role === 'admin' || role === 'manager') && (
          <li>
            <Link to="/reports" className="nav-link" onClick={closeSidebar}>Reports</Link>
          </li>
        )}

        {role === 'admin' && (
          <li>
            <Link to="/admin" className="nav-link" onClick={closeSidebar}>Admin</Link>
          </li>
        )}

        <li>
          <Link to="/" className="nav-link" onClick={onLogout}>Logout</Link>
        </li>
      </ul>
    </div>
  );
}