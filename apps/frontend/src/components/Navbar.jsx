export default function Navbar({ theme, bookmarkedCount, onToggleTheme }) {
  return (
    <header className="navbar">
      <div>
        <p className="eyebrow">Job Application Tracker</p>
        <h1>Career Pipeline Dashboard</h1>
      </div>
      <div className="navbar__side">
        <nav className="navbar__links" aria-label="Main sections">
          <a href="#create-item">Add Application</a>
          <a href="#browse-items">Browse</a>
          <a href="#category-stats">Stages</a>
        </nav>
        <div className="navbar__actions">
          <span
            className="navbar__count"
            aria-label={`${bookmarkedCount} saved applications`}
            title={`${bookmarkedCount} saved applications`}
          >
            ★ {bookmarkedCount}
          </span>
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
            title={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? "🌙" : "☀"}
          </button>
        </div>
      </div>
    </header>
  );
}
