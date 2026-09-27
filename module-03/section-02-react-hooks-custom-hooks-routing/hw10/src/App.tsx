import { useState, useMemo, useCallback, memo } from "react";
import type { CSSProperties } from "react";

interface Student {
  id: number;
  name: string;
  score: number;
  passed: boolean;
}

const generateStudents = (count: number): Student[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Sinh viên ${i + 1}`,
    score: Math.floor(Math.random() * 100),
    passed: Math.random() > 0.3,
  }));

const STUDENTS = generateStudents(5000);

interface TableHeaderProps {
  checkedCount: number;
  onMarkAll: () => void;
}

const TableHeader = memo(({ checkedCount, onMarkAll }: TableHeaderProps) => {
  console.log("TableHeader render");
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
      }}
    >
      <span style={{ fontSize: "0.9rem", color: "#666" }}>
        Đã kiểm tra: <strong>{checkedCount}</strong> học viên
      </span>
      <button
        onClick={onMarkAll}
        style={{
          padding: "8px 16px",
          background: "#6c757d",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Đánh dấu tất cả
      </button>
    </div>
  );
});

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all");
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    console.log("Filtering 5000 students...");
    return STUDENTS.filter((s) => {
      const matchKeyword = s.name.toLowerCase().includes(keyword.toLowerCase());
      const matchFilter =
        filter === "all" ? true : filter === "passed" ? s.passed : !s.passed;
      return matchKeyword && matchFilter;
    });
  }, [keyword, filter]);

  const handleMarkAll = useCallback(() => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      filtered.forEach((s) => next.add(s.id));
      return next;
    });
  }, [filtered]);

  const handleCheck = useCallback((id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ marginBottom: "8px" }}>📋 Bảng điều khiển học viên</h1>
      <p style={{ color: "#666", marginBottom: "24px", fontSize: "0.9rem" }}>
        Tổng: 5.000 học viên — Mở Console để xem khi nào tính toán lại
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm theo tên..."
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "10px 14px",
            border: "2px solid #0d6efd",
            borderRadius: "8px",
            fontSize: "1rem",
          }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          style={{
            padding: "10px 14px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "1rem",
          }}
        >
          <option value="all">Tất cả</option>
          <option value="passed">Đã qua</option>
          <option value="failed">Chưa qua</option>
        </select>
      </div>

      <TableHeader checkedCount={checkedIds.size} onMarkAll={handleMarkAll} />

      <p style={{ color: "#555", marginBottom: "12px", fontSize: "0.9rem" }}>
        Hiển thị <strong>{Math.min(filtered.length, 20)}</strong> /{" "}
        {filtered.length} kết quả
      </p>

      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #e0e0e0",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.9rem",
          }}
        >
          <thead style={{ background: "#f8f9fa" }}>
            <tr>
              <th style={th}>☑</th>
              <th style={th}>ID</th>
              <th style={th}>Tên</th>
              <th style={th}>Điểm</th>
              <th style={th}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 20).map((s) => (
              <tr
                key={s.id}
                style={{
                  background: checkedIds.has(s.id) ? "#e7f0ff" : "transparent",
                }}
              >
                <td style={td}>
                  <input
                    type="checkbox"
                    checked={checkedIds.has(s.id)}
                    onChange={() => handleCheck(s.id)}
                  />
                </td>
                <td style={td}>{s.id}</td>
                <td style={td}>{s.name}</td>
                <td style={td}>{s.score}</td>
                <td style={td}>
                  <span
                    style={{
                      color: s.passed ? "#198754" : "#dc3545",
                      fontWeight: "bold",
                    }}
                  >
                    {s.passed ? "✅ Đã qua" : "❌ Chưa qua"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: CSSProperties = {
  padding: "12px 16px",
  textAlign: "left",
  fontWeight: "bold",
  borderBottom: "2px solid #e0e0e0",
};
const td: CSSProperties = {
  padding: "10px 16px",
  borderBottom: "1px solid #f0f0f0",
};
