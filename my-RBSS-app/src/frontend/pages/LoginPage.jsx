import { useState } from "react";
import Field from "../components/Field";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export function LoginPage() {
    const [uniNumber, setUniNumber] = useState('')
    const [password, setPassword] = useState('')

    function handleSubmit(event){
        event.preventDefault();
        alert("SIGNED IN!")
    }

    return (
            <div className="login-page">

                <div>
                    <TopNav />
                    <Sidebar />
                </div>

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

                    <div className="links">
                        <Link to="/forgotpassword">Forgot your password?    </Link>
                        <Link to="/signup">Create new account</Link>
                    </div>

                </form>
            
            
        </div>
        
    );
}
