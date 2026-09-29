import { useState } from "react";
import Field from "../components/Field";
import PasswordField from "../components/PasswordField";
import ConfirmField from "../components/ConfirmField";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import './SignUp.css'

export default function SignUp(){

    const [name, setName] = useState('');
    const [uniNumber, setUniNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [passMatch, setPassMatch] = useState(false);

    function handleSubmit(event){
        event.preventDefault();
        alert("CREATED NEW ACCOUNT!");
    }


    return (
        <div className="page-wrapper">

            <div className="signup-page">
                <section className="signup-left">
                <form className="signup-form" onSubmit={handleSubmit}>

                <h1>Create your account</h1>
                <p className="sub">Takes about a minute -- use your University Number and Email</p>

                <Field
                    id="name"
                    label="Name and Surname"
                    placeholder="e.g Neo Masebe"
                    value = {name}
                    onChange={(e) => setName(e.target.value)}
    
                />

                <Field
                    id="uni"
                    label="University Number"
                    placeholder="e.g S123456"
                    value = {uniNumber}
                    onChange={(e) => setUniNumber(e.target.value)}
    
                />

                <PasswordField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <ConfirmField
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onValidate={(valid) => setPassMatch(valid)}
                    passwordValue={password}
                    
                />

                <Button active={passMatch} type="submit">Create Account</Button>

            </form>
                </section>
                
                <section className="signup-right">
                    <h1>HI</h1>
                </section>
            </div>
            

        </div>
    )
}