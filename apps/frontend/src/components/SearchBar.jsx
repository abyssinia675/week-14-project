const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name_asc", label: "Name A-Z" },
  { value: "name_desc", label: "Name Z-A" },
];

export default function SearchBar({
  filters,
  categories,
  bookmarkedCount,
  onChange,
  onApply,
  onReset,
  isLoading,
}) {
  return (
    <form className="searchbar" onSubmit={onApply}>
      <label>
        Search
        <input
          name="search"
          value={filters.search}
          onChange={onChange}
          placeholder="Search role, company, or notes"
        />
      </label>

      <label>
        Stage
        <select
          name="categoryId"
          value={filters.categoryId}
          onChange={onChange}
        >
          <option value="">All stages</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Sort
        <select name="sort" value={filters.sort} onChange={onChange}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="searchbar__checkbox">
        <input
          type="checkbox"
          name="bookmarkedOnly"
          checked={filters.bookmarkedOnly}
          onChange={onChange}
        />
        <span
          aria-label={`Show only saved applications. ${bookmarkedCount} currently saved.`}
        >
          ★ only ({bookmarkedCount})
        </span>
      </label>

      <div className="searchbar__actions">
        <button type="submit" disabled={isLoading}>
          Apply
        </button>
        <button type="button" className="button-secondary" onClick={onReset}>
          Reset
        </button>
      </div>
    </form>
  );
}
