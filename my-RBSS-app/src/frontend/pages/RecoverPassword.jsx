import './VerifySignup.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Field from '../components/Field';
import Button from '../components/Button';
import {authService} from '../../backend/User.js';

export default function RecoverPassword(){

    const navigate = useNavigate();

    const [step, setStep] = useState('request');
    const [uniNumber, setUniNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [infoMsg, setInfoMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSendCode = async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        setInfoMsg(null);

        if (!uniNumber.trim()){
            setErrorMsg("Please enter your university number.");
            return;
        }

        setLoading(true);

        try {
            await authService.sendRecoveryOtp(uniNumber.trim());
            setInfoMsg("If that account exists, a 6-digit code has been sent to its email.");
            setStep('reset');
        } catch (err) {
            setErrorMsg(err.message || "Could not send the code. Please try again.");
        } finally {
            setLoading(false);
        }

    };

    const onReset = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        if (password !== confirm) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await authService.resetPasswordWithOtp(uniNumber.trim(), otp, password);
            navigate("/login", { replace: true });
        } catch (err) {
            setErrorMsg(err.message || "Invalid or expired code. Please try again.");
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="page-wrapper">
            <main className="otp-page">
                {step === 'request' ? (
                    <form className="otp-form" onSubmit={onSendCode}>
                        <h1>Recover Password</h1>
                        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
                            Enter your university number and we will email you a code.
                        </p>

                        {errorMsg && <p style={{ color: "red", fontSize: "0.9rem" }}>{errorMsg}</p>}

                        <Field
                            id="recover-uni"
                            label="University Number"
                            placeholder="e.g. S123456"
                            value={uniNumber}
                            onChange={(e) => setUniNumber(e.target.value)}
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Code"}
                        </Button>

                        <div className="links">
                            <Link to="/login" className="nav-link">Back to sign in</Link>
                        </div>
                    </form>
                ) : (
                    <form className="otp-form" onSubmit={onReset}>
                        <h1>Set a New Password</h1>

                        {infoMsg && <p style={{ color: "green", fontSize: "0.9rem" }}>{infoMsg}</p>}
                        {errorMsg && <p style={{ color: "red", fontSize: "0.9rem" }}>{errorMsg}</p>}

                        <Field
                            id="recover-otp"
                            label="6-Digit Code"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <Field
                            id="recover-password"
                            label="New Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Field
                            id="recover-confirm"
                            label="Confirm New Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Change Password"}
                        </Button>
                    </form>
                )}
            </main>
        </div>
    );
}