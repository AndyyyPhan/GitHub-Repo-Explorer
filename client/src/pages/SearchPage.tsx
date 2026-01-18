import { useState } from "react";
import { searchGitHubRepos, addFavorite, getFavorites } from "../services/api";
import RepoCard from "../components/RepoCard";
import { useAuth } from "../context/AuthContext";
import type { GitHubRepo, Favorite } from "../types";

export default function SearchPage() {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { isAuthenticated } = useAuth();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const results = await searchGitHubRepos(username);
      setRepos(results);

      // If logged in, fetch favorites to check which repos are saved
      if (isAuthenticated) {
        const userFavorites = await getFavorites();
        setFavorites(userFavorites);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setRepos([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(repo: GitHubRepo) {
    try {
      const newFavorite = await addFavorite(repo);
      setFavorites([...favorites, newFavorite]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save");
    }
  }

  function isFavorited(repoId: number): boolean {
    return favorites.some((fav) => Number(fav.repo_id) === repoId);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Explore GitHub Repositories
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Search for any GitHub user and discover their public repositories.
          Save your favorites to access them later.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="px-8 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-200 flex items-center gap-3">
            <svg
              className="w-5 h-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Results */}
      {repos.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Found {repos.length} repositories for{" "}
            <span className="text-gray-600">@{username}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                isFavorited={isFavorited(repo.id)}
                onSave={handleSave}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty Space */}
      {hasSearched && !isLoading && repos.length === 0 && !error && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No repositories found
          </h3>
          <p className="text-gray-500">
            This user doesn't have any public repositories.
          </p>
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Search for a GitHub user
          </h3>
          <p className="text-gray-500">
            Try searching for "AndyyyPhan", "facebook", "google", or "microsoft"
          </p>
        </div>
      )}
    </div>
  );
}
