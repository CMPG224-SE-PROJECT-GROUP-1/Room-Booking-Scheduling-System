import './Logo.css';

export default function Logo(){

    const handleClick = () =>{
        alert("LOGO CLICKED!");
    }

    return (
        <div className='logo' onClick={handleClick}>
            Uni<span>Space</span>
        </div>
    )
}