import { useState } from "react";
import Field from "../components/Field";
import Button from "../components/Button";

export function LoginPage() {
    const [uniNumber, setUniNumber] = useState('')
    const [password, setPassword] = useState('')

    function handleSubmit(event){
        event.preventDefault();
        alert("SIGNED IN!")
    }

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Sign In!</h1>

                <Field
                id="univeristy-number"
                label= "University Number"
                placeholder="S123456"
                value = {uniNumber}
                onChange = {(e) => setUniNumber(e.target.value)}
                />

                <Field
                id="password"
                label= "Password"
                type = "password"
                placeholder="••••••••"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
                />

                <Button>Sign In</Button>

            </form>
            
            
        </div>
    );
}
