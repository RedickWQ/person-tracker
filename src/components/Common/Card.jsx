import './Card.css';

export function Card({ children, className = '', onClick }) {
  if (onClick) {
    return (
      <button type="button" className={`card ${className}`} onClick={onClick}>
        {children}
      </button>
    );
  }
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}
