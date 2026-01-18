import { useState, useEffect } from "react";
import { getFavorites, removeFavorite } from "../services/api";
import type { Favorite } from "../types";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch favorites on page load
  useEffect(() => {
    async function loadFavorites() {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load favorites",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, []);

  async function handleRemove(id: string) {
    try {
      await removeFavorite(id);
      setFavorites(favorites.filter((fav) => fav.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove");
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <svg
            className="animate-spin h-10 w-10 text-gray-400 mb-4"
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
          <p className="text-gray-500">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-200 flex items-center gap-3 max-w-md mx-auto">
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
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Favorites
        </h1>
        <p className="text-gray-600">
          {favorites.length > 0
            ? `You have ${favorites.length} saved ${favorites.length === 1 ? "repository" : "repositories"}`
            : "Repositories you save will appear here"}
        </p>
      </div>

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <FavoriteCard key={fav.id} favorite={fav} onRemove={handleRemove} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <svg
            className="w-20 h-20 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start exploring and save repositories you like!
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-5 h-5"
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
            Explore Repositories
          </a>
        </div>
      )}
    </div>
  );
}

interface FavoriteCardProps {
  favorite: Favorite;
  onRemove: (id: string) => Promise<void>;
}

function FavoriteCard({ favorite, onRemove }: FavoriteCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const languageColors: Record<string, string> = {
    TypeScript: "bg-blue-500",
    JavaScript: "bg-yellow-400",
    Python: "bg-green-500",
    Java: "bg-orange-500",
    Ruby: "bg-red-500",
    Go: "bg-cyan-500",
    Rust: "bg-orange-700",
    PHP: "bg-purple-500",
    CSS: "bg-pink-500",
    HTML: "bg-orange-600",
    Swift: "bg-orange-500",
    Kotlin: "bg-purple-600",
    C: "bg-gray-600",
    "C++": "bg-pink-600",
    "C#": "bg-green-600",
  };

  async function handleRemove() {
    setIsLoading(true);
    try {
      await onRemove(favorite.id);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <a
          href={favorite.repo_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          {favorite.repo_name}
        </a>

        {/* Star Count */}
        <div className="flex items-center gap-1 text-gray-500 text-sm shrink-0">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
          </svg>
          {favorite.stars_count.toLocaleString()}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {favorite.description || "No description provided"}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* :anguage */}
        <div className="flex items-center gap-2">
          {favorite.language && (
            <>
              <span
                className={`w-3 h-3 rounded-full ${
                  languageColors[favorite.language] || "bg-gray-400"
                }`}
              />
              <span className="text-sm text-gray-600">{favorite.language}</span>
            </>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4"
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
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          Remove
        </button>
      </div>
    </div>
  );
}
