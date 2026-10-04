import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Field from "../components/Field";
import Button from "../components/Button";
import './VerifySignup.css';
import { authService } from "../../backend/User.js";

export default function VerifySignup() {
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    const [resendMsg, setResendMsg] = useState(null);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const onResend = async () => {
        setErrorMsg(null);
        setResendMsg(null);
        try {
            await authService.resendSignUpOtp(email);
            setResendMsg("A new code has been sent.");
            setCooldown(60);
        } catch (err) {
            setErrorMsg(err.message || "Could not resend the code.");
        }
    };


    useEffect(() => {
        if (!email) {
            navigate("/signup", { replace: true });
        }
    }, [email, navigate]);

    const onVerifyOtp = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        const cleanToken = String(otp ?? '').trim();
        if (cleanToken.length < 6) {
            setErrorMsg("Please enter the complete 6-digit verification code.");
            return;
        }

        setLoading(true);
        try {
            await authService.verifySignUpOtp(email, cleanToken);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setErrorMsg(err.message || "Invalid or expired code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <main className="otp-page">
                <form className="otp-form" onSubmit={onVerifyOtp}>
                    <h1>Verify Your Email</h1>
                    <p style={{ color: "#666", marginBottom: "1.5rem" }}>
                        Enter the 6-digit code sent to: <br />
                        <strong>{email}</strong>
                    </p>

                    {errorMsg && (
                        <p style={{ color: "red", fontSize: "0.9rem" }}>{errorMsg}</p>
                    )}

                    <Field
                        id="otp"
                        label="6-Digit Verification Code"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />

                    <Button type="submit" disabled={loading}>
                        {loading ? "Verifying..." : "Confirm & Sign In"}
                    </Button>

                    {resendMsg && <p style={{ color: "green", fontSize: "0.9rem" }}>{resendMsg}</p>}

                    <Button type="button" variant="outline" disabled={cooldown > 0} onClick={onResend}>
                        {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                    </Button>

                </form>
            </main>
        </div>
    );
}