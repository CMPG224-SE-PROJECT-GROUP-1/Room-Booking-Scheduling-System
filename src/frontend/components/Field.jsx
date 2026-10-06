import { useState } from "react";
import './Field.css';

export default function Field({id, label, type = 'text', placeholder, value, onChange}){
    const [focused, setFocused] = useState(false);

    return(
        <div className={`field ${focused ? 'focused': ''}`}>

            <label htmlFor={id}>{label}</label>
            <div className="input-wrap">
                <input
                id = {id}
                type = {type}
                placeholder={placeholder}
                value = {value}
                onChange = {onChange}
                onFocus ={() => setFocused(true)}
                onBlur ={() => setFocused(false)}
                
                />
                <div className="underline"/>
                <div className="underline-fill"/>

            </div>
        {hint !== undefined && <div className="field-hint">{hint}</div>}

        </div>
    )
}