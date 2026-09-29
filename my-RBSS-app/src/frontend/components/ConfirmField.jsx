import Field from './Field';
import './ConfirmField.css';
import { useState } from 'react';

export default function ConfirmField({ value, onChange, passwordValue }) {
    const hasInput = value.length > 0;
    const matches = hasInput && value === passwordValue;

    let text = 'passwords will be checked here';
    if (hasInput) text = matches ? 'stamped — passwords match' : "doesn't match yet";


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
            <svg className="stamp" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M7.5 12.5l3 3 6-6.5" />
            </svg>
            <span className="match-text">{text}</span>
        </div>
        </div>
    );
}