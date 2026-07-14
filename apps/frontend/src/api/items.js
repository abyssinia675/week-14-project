const API_BASE_URL = "http://localhost:3001/api";

export async function fetchItems() {
  const response = await fetch(`${API_BASE_URL}/items`);

  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }

  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

export async function createItem(item) {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  });

  if (!response.ok) {
    throw new Error("Failed to create item");
  }

  return response.json();
}
