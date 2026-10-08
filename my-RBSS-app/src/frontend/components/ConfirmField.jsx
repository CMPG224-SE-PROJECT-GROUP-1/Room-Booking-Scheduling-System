import Field from './Field';
import './ConfirmField.css';
import { useEffect } from 'react';

export default function ConfirmField({ value, onChange, onValidate, passwordValue }) {
    const hasInput = value.length > 0;
    const matches = hasInput && value === passwordValue;

    let text = '';
    if (hasInput) text = matches ? 'stamped — passwords match' : "doesn't match yet";

    useEffect(() => {
        const valid = matches;
        onValidate?.(valid);
    }, [value, passwordValue, onValidate]);


    return (
        <div>
        <Field
            id="confirm"
            label="Confirm password"
            type="password"
            placeholder="Type it again"
            value={value}
            onChange={onChange}
        />

        <div className={`match-row ${matches ? 'ok' : ''}`}>
            
            <span className="match-text">{text}</span>
        </div>
        </div>
    );
}