export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  repo_id: number;
  repo_name: string;
  repo_url: string;
  description: string | null;
  language: string | null;
  stars_count: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
}
