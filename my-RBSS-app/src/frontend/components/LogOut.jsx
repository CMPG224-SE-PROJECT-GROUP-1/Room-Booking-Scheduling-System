import './LogOut.css'
import { useNavigate } from 'react-router-dom';

export default function LogOut(){
    const navigate = useNavigate();

    const handleClick = () => {
        alert("Logout Clicked!");
        navigate('/');
    }

    return (
        <span className='logout' onClick={handleClick}>Log Out</span>
    )
}