import type { AuthResponse, Favorite, GitHubRepo } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}

export async function registerUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

export async function getFavorites(): Promise<Favorite[]> {
  const response = await fetchWithAuth("/me/favorites");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch favorites");
  }

  return data.favorites;
}

export async function addFavorite(repo: GitHubRepo): Promise<Favorite> {
  const response = await fetchWithAuth("/me/favorites", {
    method: "POST",
    body: JSON.stringify({
      repo_id: repo.id,
      repo_name: repo.name,
      repo_url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars_count: repo.stargazers_count,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to add to favorites");
  }

  return data.favorite;
}

export async function removeFavorite(id: string): Promise<void> {
  const response = await fetchWithAuth(`/me/favorites/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to remove favorite");
  }
}

export async function searchGitHubRepos(
  username: string,
): Promise<GitHubRepo[]> {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=30`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error("Failed to fetch repos");
  }

  return response.json();
}
