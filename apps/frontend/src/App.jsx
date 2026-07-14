import { useEffect, useState } from "react";
import { createItem, fetchCategories, fetchItems } from "./api/items.js";
import ItemList from "./components/ItemList.jsx";

const emptyForm = {
  name: "",
  description: "",
  categoryId: ""
};

export default function App() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("Loading items...");

  useEffect(() => {
    async function loadData() {
      try {
        const [itemData, categoryData] = await Promise.all([
          fetchItems(),
          fetchCategories()
        ]);

        setItems(itemData);
        setCategories(categoryData);
        setStatus("");
      } catch (error) {
        setStatus(error.message);
      }
    }

    loadData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Saving item...");

    try {
      const savedItem = await createItem(form);
      setItems((currentItems) => [...currentItems, savedItem]);
      setForm(emptyForm);
      setStatus("Item created successfully.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <main className="page">
      <section className="panel">
        <p className="eyebrow">React + Express + PostgreSQL + Prisma</p>
        <h1>Student Full Stack Template</h1>
        <p>
          This starter includes a small example with categories and items so
          students can see how the frontend, backend, and database connect.
        </p>
      </section>

      <section className="grid">
        <article className="panel">
          <h2>Create an item</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Item name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Build a new feature"
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the task"
                rows="4"
                required
              />
            </label>

            <label>
              Category
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <button type="submit">Create item</button>
          </form>
        </article>

        <article className="panel">
          <h2>Example items</h2>
          {status ? <p className="status">{status}</p> : null}
          <ItemList items={items} />
        </article>
      </section>
    </main>
  );
}
