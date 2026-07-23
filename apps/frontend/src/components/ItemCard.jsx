export default function ItemCard({
  item,
  isBookmarked,
  onEdit,
  onDelete,
  onToggleBookmark,
}) {
  return (
    <li className="item-card">
      <div className="item-card__header">
        <div>
          <h3>{item.name}</h3>
          <span>{item.category.name}</span>
        </div>
        <button
          type="button"
          className={
            isBookmarked ? "bookmark-button is-active" : "bookmark-button"
          }
          onClick={() => onToggleBookmark(item.id)}
          aria-label={
            isBookmarked ? "Remove saved application" : "Save application"
          }
          title={isBookmarked ? "Remove saved application" : "Save application"}
        >
          {isBookmarked ? "★" : "☆"}
        </button>
      </div>
      <p>{item.description}</p>
      <div className="item-card__meta">
        <small>Application ID: {item.id}</small>
        <small>{new Date(item.createdAt).toLocaleDateString()}</small>
      </div>
      <div className="item-card__actions">
        <button
          type="button"
          className="button-secondary"
          onClick={() => onEdit(item)}
        >
          Edit
        </button>
        <button
          type="button"
          className="button-danger"
          onClick={() => onDelete(item.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
