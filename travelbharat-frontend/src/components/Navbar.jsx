import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar({ onAddContent }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleAddContent = () => {
    if (onAddContent) {
      onAddContent();
    } else {
      navigate("/admin");
    }
  };

  return (
    <header className="navbar">
      <div className="nav-brand">TravelBharat</div>
      <nav className="nav-links">
        {isAuthenticated && !isAuthPage && (
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
          >
            Home
          </NavLink>
        )}

        {isAuthenticated && isAdmin && !isAuthPage && (
          <button
            className="btn btn-primary nav-plus-btn"
            type="button"
            onClick={handleAddContent}
            title="Add States & Places"
          >
            +
          </button>
        )}

        {!isAuthenticated && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              Sign up
            </NavLink>
          </>
        )}

        {isAuthenticated && (
          <button className="btn btn-ghost" type="button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

