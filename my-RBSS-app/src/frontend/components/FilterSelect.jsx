import React from 'react';
import './FilterSelect.css';

export default function FilterSelect({ label, value, options = [], onChange }) {
  return (
    <div className="fgroup">
      <label>{label}</label>
      <div className="select-wrapper">
        <select 
          className="real-select" 
          value={value} 
          onChange={(e) => onChange && onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <span className="select-arrow">⌄</span>
      </div>
    </div>
  );
}