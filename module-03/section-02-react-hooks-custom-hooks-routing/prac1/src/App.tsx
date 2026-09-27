import { useState } from "react";

const description = "Nội dung mô tả chi tiết của khóa học...";

export default function CourseDescription() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "16px" }}>Khóa học React TypeScript</h2>
      <p style={{ marginBottom: "16px", color: "#555" }}>
        {isExpanded ? description : "Mô tả ngắn gọn..."}
      </p>
      <button
        onClick={toggleDescription}
        disabled={!description}
        style={{
          padding: "10px 20px",
          background: "#0d6efd",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: !description ? "not-allowed" : "pointer",
          opacity: !description ? 0.5 : 1,
        }}
      >
        {isExpanded ? "Thu gọn" : "Xem chi tiết"}
      </button>
    </div>
  );
}
