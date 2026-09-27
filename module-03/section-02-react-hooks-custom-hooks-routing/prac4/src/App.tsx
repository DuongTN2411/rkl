import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import type { CSSProperties } from "react";

function Dashboard() {
  return (
    <div style={pageStyle}>
      <h2>📊 Dashboard - Trang chủ</h2>
      <p>Chào mừng đến với Cổng thông tin Sinh viên.</p>
    </div>
  );
}

function Schedule() {
  return (
    <div style={pageStyle}>
      <h2>📅 Schedule - Lịch học</h2>
      <p>Lịch học tuần này: Thứ 2, 4, 6.</p>
    </div>
  );
}

function Profile() {
  return (
    <div style={pageStyle}>
      <h2>👤 Profile - Hồ sơ</h2>
      <p>Thông tin cá nhân của sinh viên.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ ...pageStyle, color: "#dc3545" }}>
      <h2>404 - Không tìm thấy nội dung</h2>
      <p>Trang bạn truy cập không tồn tại.</p>
    </div>
  );
}

const pageStyle: CSSProperties = {
  padding: "40px",
  background: "#fff",
  borderRadius: "8px",
  marginTop: "24px",
  lineHeight: "1.8",
};

const navLinkStyle = ({
  isActive,
}: {
  isActive: boolean;
}): CSSProperties => ({
  padding: "10px 20px",
  background: isActive ? "#0d6efd" : "transparent",
  color: isActive ? "#fff" : "#0d6efd",
  border: "1px solid #0d6efd",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: isActive ? "bold" : "normal",
});

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}
      >
        <h1 style={{ marginBottom: "24px" }}>Cổng Thông Tin Sinh Viên</h1>
        <nav style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
          <NavLink to="/dashboard" style={navLinkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/schedule" style={navLinkStyle}>
            Lịch học
          </NavLink>
          <NavLink to="/profile" style={navLinkStyle}>
            Hồ sơ
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
