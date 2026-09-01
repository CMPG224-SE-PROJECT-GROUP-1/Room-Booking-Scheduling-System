import React from "react";
import './SectionList.css'


const sections = [
        { id: '01', label: 'Preamble' },
        { id: '02', label: 'Description' },
        { id: '03', label: 'Updates' },
        { id: '04', label: 'Log-in guidelines' },
        ];
    
const SectionList = () => {
    return (
        <ul className="section-list">
            {sections.map((item) => (
                <li key={item.id}>
                    <span className="mk">§{item.id}</span>
                    {item.label}
                </li>
            ))}
        </ul>
    )
    

}

export default SectionList