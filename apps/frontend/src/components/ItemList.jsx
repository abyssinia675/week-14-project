import ItemCard from "./ItemCard.jsx";

export default function ItemList({
  items,
  bookmarkedIds,
  onEdit,
  onDelete,
  onToggleBookmark,
}) {
  if (items.length === 0) {
    return <p>No applications match this filter yet.</p>;
  }

  return (
    <ul className="item-list">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          isBookmarked={bookmarkedIds.includes(item.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </ul>
  );
}
