import { useState, useEffect } from "react";

export default function ExamTimer() {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const id = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [timeLeft]);

  return (
    <div style={{ padding: "60px", textAlign: "center" }}>
      <h2 style={{ marginBottom: "24px" }}>Đồng hồ đếm ngược bài thi</h2>
      <div
        style={{
          fontSize: "4rem",
          fontWeight: "bold",
          color: timeLeft <= 10 ? "#dc3545" : "#0d6efd",
          marginBottom: "16px",
        }}
      >
        {timeLeft}s
      </div>
      {timeLeft === 0 && (
        <p style={{ color: "#dc3545", fontSize: "1.2rem" }}>Hết giờ!</p>
      )}
    </div>
  );
}
