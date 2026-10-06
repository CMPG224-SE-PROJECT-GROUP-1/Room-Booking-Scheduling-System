import './LogOut.css'
import { useNavigate } from 'react-router-dom';
import { authService } from '../../backend/User.js';

export default function LogOut(){
    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await authService.signOut();

            const session = await authService.getCurrentSession?.(); 

            window.alert("Successfully logged out! Active session: " + session);
            navigate('/');
        } catch (err) {
            window.alert("Logout failed: " + err.message);
        }
        
    }

    

    return (
        <span className='logout' onClick={handleClick}>Log Out</span>
    )
}