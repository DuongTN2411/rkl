import { useState, createContext, useContext } from "react";
import type { CSSProperties } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

function ProtectedRoute() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/classroom";

  const handleLogin = () => {
    login();
    navigate(from, { replace: true });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "48px",
          borderRadius: "12px",
          width: "360px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "24px" }}>🔐 Đăng nhập</h2>
        <p style={{ color: "#666", marginBottom: "24px", fontSize: "0.9rem" }}>
          Vui lòng đăng nhập để vào Phòng học ảo
        </p>
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "14px",
            background: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Đăng nhập (Giả lập)
        </button>
      </div>
    </div>
  );
}

function ClassroomPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ marginBottom: "16px" }}>🎓 Phòng học ảo</h2>
      <p style={{ color: "#555", marginBottom: "24px" }}>
        Nội dung độc quyền — chỉ dành cho học viên đã đăng nhập.
      </p>
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 24px",
          background: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}

function HomePage() {
  return (
    <div style={{ padding: "40px" }}>
      <h2>🏠 Trang chủ</h2>
      <p style={{ marginTop: "12px", color: "#555" }}>
        Chào mừng đến trang chủ.
      </p>
    </div>
  );
}

function Navbar() {
  const { isLoggedIn } = useAuth();
  const linkStyle = ({
    isActive,
  }: {
    isActive: boolean;
  }): CSSProperties => ({
    padding: "8px 16px",
    background: isActive ? "#0d6efd" : "transparent",
    color: isActive ? "#fff" : "#0d6efd",
    border: "1px solid #0d6efd",
    borderRadius: "6px",
    textDecoration: "none",
  });
  return (
    <nav
      style={{
        background: "#fff",
        padding: "16px 32px",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <NavLink to="/" end style={linkStyle}>
        Trang chủ
      </NavLink>
      <NavLink to="/classroom" style={linkStyle}>
        Phòng học ảo 🔒
      </NavLink>
      {!isLoggedIn && (
        <NavLink to="/login" style={linkStyle}>
          Đăng nhập
        </NavLink>
      )}
      <span
        style={{
          marginLeft: "auto",
          fontSize: "0.9rem",
          color: isLoggedIn ? "#198754" : "#dc3545",
        }}
      >
        {isLoggedIn ? "✅ Đã đăng nhập" : "❌ Chưa đăng nhập"}
      </span>
    </nav>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/classroom" element={<ClassroomPage />} />
          </Route>
          <Route
            path="*"
            element={
              <div style={{ padding: "40px", color: "#dc3545" }}>
                <h2>404 - Không tìm thấy</h2>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
