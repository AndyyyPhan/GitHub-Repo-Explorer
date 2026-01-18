import { useState } from "react";
import type { GitHubRepo } from "../types";
import { useAuth } from "../context/AuthContext";

interface RepoCardProps {
  repo: GitHubRepo;
  isFavorited?: boolean;
  onSave?: (repo: GitHubRepo) => Promise<void>;
  onRemove?: (id: string) => Promise<void>;
  favoriteId?: string;
}

export default function RepoCard({
  repo,
  isFavorited,
  onSave,
  onRemove,
  favoriteId,
}: RepoCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  async function handleSave() {
    if (!onSave) return;

    setIsLoading(true);

    try {
      await onSave(repo);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemove() {
    if (!onRemove || !favoriteId) return;

    setIsLoading(true);

    try {
      await onRemove(favoriteId);
    } finally {
      setIsLoading(false);
    }
  }

  // Language color mapping
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <a
          href={repo.html_url}
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
          {repo.name}
        </a>

        {/* Star Count */}
        <div className="flex items-center gap-1 text-gray-500 text-sm shrink-0">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
          </svg>
          {repo.stargazers_count.toLocaleString()}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp 2">
        {repo.description || "No description provided"}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Language */}
        <div className="flex items-center gap-2">
          {repo.language && (
            <>
              <span
                className={`w-3 h-3 rounded-full ${
                  languageColors[repo.language] || "bg-gray-400"
                }`}
              />
              <span className="text-sm text-gray-600">{repo.language}</span>
            </>
          )}
        </div>

        {/* Action Button */}
        {isAuthenticated && (
          <>
            {isFavorited ? (
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
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                )}
                Saved
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
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
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
                Save
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
