import { useState } from "react";
import Field from "../components/Field";
import PasswordField from "../components/PasswordField";
import ConfirmField from "../components/ConfirmField";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
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

        const email = `${uniNumber}@university.ac.za`;

        setLoading(true);
        try {
            await authService.newSignUp(name, uniNumber, email, password);
            navigate('/verifyotp', { state: 'neomasebe9@gmail.com' });
        } catch (err) {
            setErrorMsg(err.message || "Failed to sign up.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="signup-page">
                <section className="signup-left">
                    <form className="signup-form" onSubmit={onSignUp}>
                        <h1>Create your account</h1>
                        <p className="sub">Takes about a minute -- use your University Number and Email</p>

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

                <section className="signup-right">
                    <h1>HI</h1>
                </section>
            </div>
        </div>
    );
}