import './LogOut.css'

export default function LogOut(){
    const handleClick = () => {
        alert("Logout Clicked!");
    }

    return (
        <span className='logout' onClick={handleClick}>Log Out</span>
    )
}