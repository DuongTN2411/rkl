import { BrowserRouter, useSearchParams } from "react-router-dom";
import type { ChangeEvent } from "react";

const COURSES = [
  { id: 1, title: "React cơ bản", category: "Frontend" },
  { id: 2, title: "TypeScript nâng cao", category: "Frontend" },
  { id: 3, title: "NestJS API", category: "Backend" },
  { id: 4, title: "PostgreSQL thực chiến", category: "Backend" },
  { id: 5, title: "Docker & DevOps", category: "DevOps" },
  { id: 6, title: "React Query", category: "Frontend" },
];

function CourseList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("q") ?? "";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const filtered = COURSES.filter(
    (c) =>
      c.title.toLowerCase().includes(keyword.toLowerCase()) ||
      c.category.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ marginBottom: "24px" }}>Danh sách Khóa học</h1>
      <input
        type="text"
        value={keyword}
        onChange={handleChange}
        placeholder="Tìm kiếm khóa học..."
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: "1rem",
          border: "2px solid #0d6efd",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      />
      {keyword && (
        <p style={{ color: "#666", marginBottom: "16px", fontSize: "0.9rem" }}>
          URL hiện tại: <code>?q={keyword}</code> — Tìm thấy {filtered.length}{" "}
          kết quả
        </p>
      )}
      {filtered.length === 0 ? (
        <p style={{ color: "#dc3545" }}>Không tìm thấy khóa học nào.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((c) => (
            <div
              key={c.id}
              style={{
                background: "#fff",
                padding: "16px 20px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              }}
            >
              <strong>{c.title}</strong>
              <span
                style={{
                  marginLeft: "12px",
                  fontSize: "0.85rem",
                  color: "#0d6efd",
                  background: "#e7f0ff",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                {c.category}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CourseList />
    </BrowserRouter>
  );
}
