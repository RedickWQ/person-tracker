import './Header.css';

export function Header({ title }) {
  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
    </header>
  );
}
