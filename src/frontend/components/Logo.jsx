import { useNavigate } from 'react-router-dom';
import './Logo.css';

export default function Logo({active = false}){
    const navigate = useNavigate();

    const handleClick = () =>{
        if (active) {navigate("/dashboard")};
    }

    return (
        <div className='logo' onClick={handleClick}>
            Uni<span>Space</span>
        </div>
    )
}