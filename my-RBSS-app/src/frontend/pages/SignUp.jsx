import { useState } from "react";
import Field from "../components/Field";
import PasswordField from "../components/PasswordField";
import ConfirmField from "../components/ConfirmField";
import Button from "../components/Button";
import './SignUp.css';
import { authService } from "../../backend/User";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const [name, setName] = useState('');
    const [uniNumber, setUniNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [passMatch, setPassMatch] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSignUp = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        const cleanUni = uniNumber.trim();
        const email = authService.formatStudentEmail(cleanUni);

        if (!name.trim()) {
            setErrorMsg("Please enter your name and surname.");
            return;
        }
        // S, T or P followed by 6 digits.
        if (!/^[STP]\d{6}$/i.test(cleanUni)) {
            setErrorMsg("University number must start with S, T or P followed by 6 digits, e.g. S123456.");
            return;
        }

        setLoading(true);
        try {
            const result = await authService.newSignUp(name, cleanUni, password);

            if (result.session) {
                // "Confirm email" is OFF in Supabase: they are already logged in
                navigate('/dashboard', { replace: true });
            } else {
                // "Confirm email" is ON: they still need to enter the code
                navigate('/verifyotp', { state: { email } });
            }
        } catch (err) {
            setErrorMsg(err.message || "Failed to sign up.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="signup-page">
                <section className="signup-right">

    <div className="signup-welcome">
        <span className="signup-tag">Join UniSpace</span>
        <h2>Your campus rooms,<br />one account away.</h2>
        <p className="signup-desc">
            Create an account to reserve study rooms and meeting spaces
            across the university.
        </p>

        <ol className="signup-steps">
            <li>Enter your name and university number (e.g. S123456).</li>
            <li>Choose a password of at least 8 characters.</li>
            <li>Enter the 6-digit code we email to your university address.</li>
        </ol>

        <p className="signup-note">
            Already registered? Go back to the sign-in page and log in with your university number.
        </p>
    </div>
        </section> 
                <section className="signup-left">
                    <form className="signup-form" onSubmit={onSignUp}>
                        <h1>Create your account</h1>
                        <p className="sub">Takes about a minute -- use your University Number</p>

                        {errorMsg && (
                            <p className="error-text" style={{ color: "red", fontSize: "0.9rem" }}>
                                {errorMsg}
                            </p>
                        )}

                        <Field
                            id="name"
                            label="Name and Surname"
                            placeholder="e.g Neo Masebe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Field
                            id="uni"
                            label="University Number"
                            placeholder="e.g S123456"
                            value={uniNumber}
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

                        <Button
                            active={passMatch && !loading}
                            disabled={!passMatch || loading}
                            type="submit"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>
                </section>

    
            </div>
        </div>
    );
}