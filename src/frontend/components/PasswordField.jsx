import { scorePassword, STRENGTH_LABELS } from "../utils/passwordScore";
import Field from "./Field";
import './PasswordField.css';


export default function PasswordField({value, onChange}){
    const score = value.length === 0 ? 0: scorePassword(value);
    const pct = value.length === 0 ? 0: Math.max(14, (score / 5) * 100);
    const label = value.length === 0 ? 'needs more ink': STRENGTH_LABELS[score];
    const strong = score >= 4;

    return(
        <div>

            <Field
                id = "pass"
                label = "Password"
                type = "password"
                placeholder = "At least 8 characters"
                value = {value}
                onChange = {onChange}
            />

            <div className="meter-row">
                <span className={`meter-label ${strong ? 'strong' : ''}`}>{label}</span>
            </div>


        </div>
    )

    // <div className="meter-track">
    //                <div className="meter-fill" style={{ width: `${pct}%`}}/>
    //            </div>
}