const API_URL = "http://127.0.0.1:8001";

export async function getCategories() {
  const response = await fetch(`${API_URL}/category`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

export async function deleteCategory(id) {
  const response = await fetch(
    `${API_URL}/category/${id}`,
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete category");
  }

  return response.json();
}