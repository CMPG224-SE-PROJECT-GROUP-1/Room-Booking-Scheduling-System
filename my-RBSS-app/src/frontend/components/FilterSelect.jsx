export default function FilterSelect({label, value}){
    return (
        <div>
            <label>{label}</label>
            <div className="fake-select">
                {value} <span>⌄</span>
            </div>
        </div>
    )
}