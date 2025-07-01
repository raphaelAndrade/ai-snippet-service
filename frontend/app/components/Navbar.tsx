import { Form, Link } from "@remix-run/react";
import { useAuth } from "~/context/AuthContext";

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="bg-emerald-700 text-white px-6 py-4 flex justify-between items-center shadow-md"
    >
      <Link to="/" className="text-2xl font-bold tracking-tight hover:text-white/90 transition">
        AI Snippets
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <span className="text-sm text-emerald-100">
              👋 Welcome, <span className="font-semibold">{user.email}</span>
            </span>
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="bg-white text-emerald-800 font-medium px-4 py-1.5 rounded hover:bg-slate-100 transition"
              >
                Logout
              </button>
            </Form>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-white text-emerald-800 font-medium px-4 py-1.5 rounded hover:bg-slate-100 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
