export default function CategoryStats({ stats }) {
  return (
    <section className="panel" id="category-stats">
      <h2>Applications by stage</h2>
      {stats.length === 0 ? (
        <p>No application stats available yet.</p>
      ) : (
        <ul className="stats-list">
          {stats.map((row) => (
            <li key={row.id} className="stats-list__item">
              <span>{row.name}</span>
              <strong>{row.item_count}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
