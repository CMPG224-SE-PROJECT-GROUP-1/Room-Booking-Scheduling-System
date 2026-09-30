import { useState } from "react";
import Field from "../components/Field";
import Button from "../components/Button";
import './LoginPage.css';
import { Link, useNavigate } from "react-router-dom";
import { authService } from '../../backend/User.js';

export function LoginPage() {
    const [uniNumber, setUniNumber] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSignIn = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        const cleanUniNumber = uniNumber.trim();
        if (!cleanUniNumber) {
            setErrorMsg("Please enter your university number.");
            return;
        }

        if (!password) {
            setErrorMsg("Please enter your password.");
            return;
        }

        const email = authService.formatStudentEmail(cleanUniNumber);

        setLoading(true);
        try {
            const data = await authService.authenticate(cleanUniNumber, password);

            if (data.session) {
                navigate('/dashboard');
            }
        } catch (err) {
            setErrorMsg(err.message || "Failed to sign in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <main className="login-page">
                <section className="login-left">
                    <form className="login-form" onSubmit={onSignIn}>
                        <h1>Sign In!</h1>

                        {errorMsg && (
                            <p style={{ color: "red", fontSize: "0.9rem" }}>{errorMsg}</p>
                        )}

                        <Field
                            id="university-number"
                            label="University Number"
                            placeholder="e.g. S123456"
                            value={uniNumber}
                            onChange={(e) => setUniNumber(e.target.value)}
                        />

                        <Field
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>

                        <div className="links">
                            <Link to="/forgotpassword" className="nav-link">
                                Forgot your password?
                            </Link>
                            <Link to="/signup" className="nav-link">
                                Create new account
                            </Link>
                        </div>
                    </form>
                </section>

                <section className="login-right">
                    <h3>HELLO</h3>
                </section>
            </main>
        </div>
    );
}