import './QuoteCard.css';

export function QuoteCard({ content, variant = 'dashboard' }) {
  if (!content) return null;

  return (
    <div className={`quote-card quote-card--${variant}`}>
      <div className="quote-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M10 8C10 5.79086 8.20914 4 6 4C3.79086 4 2 5.79086 2 8C2 10.2091 3.79086 12 6 12C6.21243 12 6.41602 11.9806 6.61002 11.9443C6.57253 11.8295 6.55402 11.7082 6.55402 11.5833C6.55402 10.4945 7.33696 9.58333 8.33333 9.58333C8.81987 9.58333 9.26034 9.78505 9.56718 10.1103C9.63317 10.0514 9.70302 9.99906 9.77636 9.95402C9.55302 9.70283 9.43002 9.36862 9.43002 9C9.43002 8.08333 10.2475 7.33333 11.25 7.33333C12.2525 7.33333 13.07 8.08333 13.07 9C13.07 11 11.25 12.5 11.25 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 8C18 5.79086 16.2091 4 14 4C11.7909 4 10 5.79086 10 8C10 10.2091 11.7909 12 14 12C14.2124 12 14.416 11.9806 14.61 11.9443C14.5725 11.8295 14.554 11.7082 14.554 11.5833C14.554 10.4945 15.337 9.58333 16.3333 9.58333C16.8199 9.58333 17.2603 9.78505 17.5672 10.1103C17.6332 10.0514 17.703 9.99906 17.7764 9.95402C17.553 9.70283 17.43 9.36862 17.43 9C17.43 8.08333 18.2475 7.33333 19.25 7.33333C20.2525 7.33333 21.07 8.08333 21.07 9C21.07 11 19.25 12.5 19.25 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <blockquote className="quote-text">
        {content}
      </blockquote>
    </div>
  );
}
