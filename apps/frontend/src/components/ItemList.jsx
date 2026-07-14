export default function ItemList({ items }) {
  if (items.length === 0) {
    return <p>No items yet.</p>;
  }

  return (
    <ul className="item-list">
      {items.map((item) => (
        <li key={item.id} className="item-card">
          <div className="item-card__header">
            <h3>{item.name}</h3>
            <span>{item.category.name}</span>
          </div>
          <p>{item.description}</p>
        </li>
      ))}
    </ul>
  );
}
