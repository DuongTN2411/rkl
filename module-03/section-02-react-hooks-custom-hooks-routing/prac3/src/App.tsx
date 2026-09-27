import { useRef } from "react";

export default function App() {
  const emailRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const handleRegisterClick = () => {
    if (isScrolling.current) return;
    isScrolling.current = true;

    formRef.current?.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      emailRef.current?.focus();
      isScrolling.current = false;
    }, 600);
  };

  return (
    <div>
      <header
        style={{
          background: "#0d6efd",
          color: "#fff",
          padding: "60px 40px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "16px" }}>
          Chương trình Đào tạo
        </h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "32px" }}>
          Nâng cao kỹ năng lập trình của bạn
        </p>
        <button
          onClick={handleRegisterClick}
          style={{
            padding: "14px 32px",
            background: "#fff",
            color: "#0d6efd",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Đăng ký tư vấn
        </button>
      </header>

      <main style={{ padding: "80px 40px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
          Các khóa học nổi bật
        </h2>
        {["React", "TypeScript", "Next.js"].map((course) => (
          <div
            key={course}
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <h3>{course}</h3>
            <p style={{ color: "#666", margin: "8px 0 16px" }}>
              Khóa học {course} từ cơ bản đến nâng cao.
            </p>
            <button
              onClick={handleRegisterClick}
              style={{
                padding: "10px 20px",
                background: "#0d6efd",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Đăng ký tư vấn
            </button>
          </div>
        ))}
      </main>

      <section
        ref={formRef}
        style={{
          background: "#fff",
          padding: "60px 40px",
          maxWidth: "500px",
          margin: "0 auto 80px",
          borderRadius: "12px",
        }}
      >
        <h2 style={{ marginBottom: "24px", textAlign: "center" }}>
          Form Tư Vấn
        </h2>
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "bold",
            }}
          >
            Họ tên
          </label>
          <input
            type="text"
            placeholder="Nhập họ tên"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "1rem",
            }}
          />
        </div>
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "bold",
            }}
          >
            Email
          </label>
          <input
            ref={emailRef}
            type="email"
            placeholder="Nhập email"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "2px solid #0d6efd",
              borderRadius: "6px",
              fontSize: "1rem",
            }}
          />
        </div>
        <button
          style={{
            width: "100%",
            padding: "12px",
            background: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Gửi đăng ký
        </button>
      </section>
    </div>
  );
}
