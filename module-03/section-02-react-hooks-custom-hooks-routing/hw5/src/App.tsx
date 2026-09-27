import { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header
      style={{
        background: theme === "dark" ? "#1a1a2e" : "#0d6efd",
        color: "#fff",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "1.4rem" }}>Nền tảng Học tập</h1>
      <button
        onClick={toggleTheme}
        style={{
          padding: "8px 18px",
          background: theme === "dark" ? "#e2e2e2" : "#fff",
          color: theme === "dark" ? "#1a1a2e" : "#0d6efd",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {theme === "dark" ? "☀️ Sáng" : "🌙 Tối"}
      </button>
    </header>
  );
}

function MainContent() {
  const { theme } = useTheme();
  return (
    <main
      style={{
        flex: 1,
        padding: "40px 32px",
        background: theme === "dark" ? "#16213e" : "#f0f4ff",
        color: theme === "dark" ? "#e2e2e2" : "#222",
      }}
    >
      <h2 style={{ marginBottom: "16px" }}>Nội dung chính</h2>
      <p>
        Giao diện hiện đang ở chế độ{" "}
        <strong>{theme === "dark" ? "ban đêm" : "ban ngày"}</strong>.
      </p>
      <p
        style={{ marginTop: "12px", color: theme === "dark" ? "#aaa" : "#555" }}
      >
        Context API giúp tránh Prop Drilling — Header, MainContent và Footer đều
        dùng chung một nguồn dữ liệu Theme.
      </p>
    </main>
  );
}

function Footer() {
  const { theme } = useTheme();
  return (
    <footer
      style={{
        padding: "20px 32px",
        background: theme === "dark" ? "#0f0f1a" : "#e9ecef",
        color: theme === "dark" ? "#aaa" : "#555",
        textAlign: "center",
        fontSize: "0.9rem",
      }}
    >
      © 2026 Nền tảng Học tập — Chủ đề: {theme === "dark" ? "Tối" : "Sáng"}
    </footer>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>("light");
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <MainContent />
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}
