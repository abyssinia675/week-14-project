import { useEffect, useState } from "react";
import {
  createItem,
  deleteItem,
  fetchCategories,
  fetchItemStats,
  fetchItems,
  updateItem,
} from "./api/items.js";
import CategoryStats from "./components/CategoryStats.jsx";
import ItemForm, { emptyForm } from "./components/ItemForm.jsx";
import ItemList from "./components/ItemList.jsx";
import Navbar from "./components/Navbar.jsx";
import SearchBar from "./components/SearchBar.jsx";
import StatusMessage from "./components/StatusMessage.jsx";

const THEME_STORAGE_KEY = "job-tracker-theme";
const BOOKMARKS_STORAGE_KEY = "job-tracker-bookmarks";

const defaultFilters = {
  search: "",
  categoryId: "",
  sort: "newest",
  bookmarkedOnly: false,
};

export default function App() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [filters, setFilters] = useState(defaultFilters);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || "light";
  });
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const savedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);

    if (!savedBookmarks) {
      return [];
    }

    try {
      return JSON.parse(savedBookmarks);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  async function loadInitialData() {
    setIsLoading(true);
    setError("");

    try {
      const [itemData, categoryData, statsData] = await Promise.all([
        fetchItems(defaultFilters),
        fetchCategories(),
        fetchItemStats(),
      ]);

      setItems(itemData);
      setCategories(categoryData);
      setStats(statsData);
      setStatus("Applications loaded successfully.");
    } catch (requestError) {
      setError(requestError.message);
      setStatus("");
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function handleFilterChange(event) {
    const { name, type, value, checked } = event.target;
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleToggleTheme() {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }

  function handleToggleBookmark(itemId) {
    setBookmarkedIds((currentIds) => {
      if (currentIds.includes(itemId)) {
        setStatus("Bookmark removed.");
        return currentIds.filter((id) => id !== itemId);
      }

      setStatus("Application bookmarked.");
      return [...currentIds, itemId];
    });
  }

  async function refreshStats() {
    const statsData = await fetchItemStats();
    setStats(statsData);
  }

  async function handleFilterSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const filteredItems = await fetchItems(filters);
      setItems(filteredItems);
      const visibleCount = filters.bookmarkedOnly
        ? filteredItems.filter((item) => bookmarkedIds.includes(item.id)).length
        : filteredItems.length;
      setStatus(`Showing ${visibleCount} application(s).`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFilterReset() {
    setFilters(defaultFilters);
    setIsLoading(true);
    setError("");

    try {
      const allItems = await fetchItems(defaultFilters);
      setItems(allItems);
      setStatus("Application filters cleared.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (editingItemId) {
        await updateItem(editingItemId, form);
        setStatus("Application updated successfully.");
      } else {
        await createItem(form);
        setStatus("Application created successfully.");
      }

      const refreshedItems = await fetchItems(filters);
      setItems(refreshedItems);
      await refreshStats();
      setForm(emptyForm);
      setEditingItemId(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(item) {
    setEditingItemId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      categoryId: String(item.categoryId),
    });
    setStatus(`Editing application #${item.id}`);
    setError("");
  }

  function handleCancelEdit() {
    setEditingItemId(null);
    setForm(emptyForm);
    setStatus("Application edit canceled.");
    setError("");
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this application permanently?");
    if (!confirmed) {
      return;
    }

    setError("");
    try {
      await deleteItem(id);
      const refreshedItems = await fetchItems(filters);
      setItems(refreshedItems);
      setBookmarkedIds((currentIds) =>
        currentIds.filter((savedId) => savedId !== id),
      );
      await refreshStats();
      setStatus("Application deleted successfully.");
      if (editingItemId === id) {
        handleCancelEdit();
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const visibleItems = filters.bookmarkedOnly
    ? items.filter((item) => bookmarkedIds.includes(item.id))
    : items;

  return (
    <main className="page">
      <Navbar
        theme={theme}
        bookmarkedCount={bookmarkedIds.length}
        onToggleTheme={handleToggleTheme}
      />

      <section className="grid">
        <ItemForm
          mode={editingItemId ? "edit" : "create"}
          form={form}
          categories={categories}
          error={error}
          isSubmitting={isSubmitting}
          isLoadingCategories={isLoading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />

        <article className="panel">
          <h2 id="browse-items">Browse applications</h2>
          <p className="panel-note">
            Search by role or company, filter by stage, and sort your job
            applications.
          </p>
          <SearchBar
            filters={filters}
            categories={categories}
            bookmarkedCount={bookmarkedIds.length}
            onChange={handleFilterChange}
            onApply={handleFilterSubmit}
            onReset={handleFilterReset}
            isLoading={isLoading}
          />

          {isLoading ? (
            <StatusMessage message="Loading applications..." />
          ) : null}
          <StatusMessage message={status} type="success" />
          <StatusMessage message={error} type="error" />

          <h2>Tracked applications</h2>
          <ItemList
            items={visibleItems}
            bookmarkedIds={bookmarkedIds}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleBookmark={handleToggleBookmark}
          />
        </article>
      </section>

      <CategoryStats stats={stats} />
    </main>
  );
}
