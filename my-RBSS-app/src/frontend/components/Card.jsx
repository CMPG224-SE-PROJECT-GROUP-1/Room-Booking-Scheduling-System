import './Card.css';

export default function Card({ children, className = '', isLoading = false, ...props }) {
  return (
    <div 
        className={`card ${isLoading ? 'is-loading' : ''} ${className}`.trim()} 
        {...props}
      >
        {isLoading ? <div className="loader" role="status" aria-label="Loading" /> : children}
    </div>
  );
}