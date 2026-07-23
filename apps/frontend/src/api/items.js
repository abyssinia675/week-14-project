const API_BASE_URL = "http://localhost:3001/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}

export async function fetchItems(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.search) {
    searchParams.set("search", params.search);
  }
  if (params.categoryId) {
    searchParams.set("categoryId", params.categoryId);
  }
  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  const queryString = searchParams.toString();
  const url = queryString ? `/items?${queryString}` : "/items";
  const payload = await request(url, { method: "GET" });
  return payload.data;
}

export async function fetchItem(id) {
  const payload = await request(`/items/${id}`, { method: "GET" });
  return payload.data;
}

export async function fetchItemStats() {
  const payload = await request("/items/stats", { method: "GET" });
  return payload.data;
}

export async function fetchCategories() {
  const payload = await request("/categories", { method: "GET" });
  return payload.data;
}

export async function createItem(item) {
  const payload = await request("/items", {
    method: "POST",
    body: JSON.stringify(item),
  });

  return payload.data;
}

export async function updateItem(id, item) {
  const payload = await request(`/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(item),
  });

  return payload.data;
}

export async function deleteItem(id) {
  const payload = await request(`/items/${id}`, {
    method: "DELETE",
  });

  return payload.data;
}
