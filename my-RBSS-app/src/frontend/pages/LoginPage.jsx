import { useState } from "react";
import Field from "../components/Field";
import Button from "../components/Button";
import './LoginPage.css';
import { Link, useNavigate } from "react-router-dom";
import { authService } from '../../backend/User.js';
import { MAX_LOGIN_ATTEMPTS, LOGIN_LOCK_SECONDS } from '../../backend/slots.js';

export function LoginPage() {
    const [uniNumber, setUniNumber] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [lockedUntil, setLockedUntil] = useState(0);
    const navigate = useNavigate();

    const onSignIn = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        // locked after too many wrong attempts
        if (Date.now() < lockedUntil) {
            const secondsLeft = Math.ceil((lockedUntil - Date.now()) / 1000);
            setErrorMsg(`Too many failed attempts. Please wait ${secondsLeft} seconds.`);
            return;
        }

        const cleanUniNumber = uniNumber.trim();
        if (!cleanUniNumber) {
            setErrorMsg("Please enter your university number.");
            return;
        }

        if (!password) {
            setErrorMsg("Please enter your password.");
            return;
        }

        setLoading(true);
        try {
            const data = await authService.authenticate(cleanUniNumber, password);

            if (data.session) {
                setFailedAttempts(0);

                const role = authService.getRole;
                if (role === 'admin') {
                    navigate('/admin');
                } else if (role === 'manager') {
                    navigate('/reports');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            const attempts = failedAttempts + 1;
            if (attempts >= MAX_LOGIN_ATTEMPTS) {
                setLockedUntil(Date.now() + LOGIN_LOCK_SECONDS * 1000);
                setFailedAttempts(0);
                setErrorMsg(`Too many failed attempts. Please wait ${LOGIN_LOCK_SECONDS} seconds.`);
            } else {
                setFailedAttempts(attempts);
                setErrorMsg(`${err.message || "Failed to sign in."} (${MAX_LOGIN_ATTEMPTS - attempts} attempts left)`);
            }
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
    <div className="login-welcome">
        <span className="welcome-tag">Welcome to UniSpace</span>
        <h3>Find your space.<br />Book it in minutes.</h3>
        <p className="welcome-desc">
            UniSpace is the campus room booking system. Reserve study rooms
            and meeting spaces across the university, any day of the week.
        </p>

        <ol className="welcome-steps">
            <li>Sign in with your university number and password.</li>
            <li>Browse rooms and pick a time slot.</li>
            <li>Check in with your 4-digit code when you arrive.</li>
        </ol>

        <p className="welcome-note">New here? Create an account with your university number.</p>
    </div>
                </section>
            </main>
        </div>
    );
}