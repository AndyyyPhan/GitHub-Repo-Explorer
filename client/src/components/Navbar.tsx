import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <nav className="bg-gray-900 text-white h-16 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto h-full px-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold flex items-center gap-2"
          onClick={closeMenu}
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="hidden sm:inline">GitHub Explorer</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <span className="text-gray-400 text-sm">{user?.email}</span>
              <Link
                to="/favorites"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Favorites
              </Link>
              <button
                onClick={logout}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <div className="text-gray-400 text-sm py-2 border-b border-gray-800">
                  {user?.email}
                </div>
                <Link
                  to="/favorites"
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={closeMenu}
                >
                  Favorites
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full text-left py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={closeMenu}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
