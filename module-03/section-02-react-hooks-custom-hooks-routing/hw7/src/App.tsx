import { useState, useEffect, useRef, useCallback } from "react";
import type { CSSProperties } from "react";

interface CountdownControls {
  timeLeft: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

function useCountdown(initialSeconds: number): CountdownControls {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clear();
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clear;
  }, [isRunning]);

  const start = useCallback(() => {
    if (timeLeft > 0) setIsRunning(true);
  }, [timeLeft]);

  const pause = useCallback(() => {
    clear();
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    clear();
    setIsRunning(false);
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  return { timeLeft, isRunning, start, pause, reset };
}

function ExamTimer() {
  const { timeLeft, isRunning, start, pause, reset } = useCountdown(300);
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "32px",
        marginBottom: "24px",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "16px" }}>🎓 Bài kiểm tra trắc nghiệm</h2>
      <div
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: timeLeft <= 30 ? "#dc3545" : "#0d6efd",
          marginBottom: "20px",
        }}
      >
        {mm}:{ss}
      </div>
      {timeLeft === 0 && (
        <p style={{ color: "#dc3545", marginBottom: "16px" }}>Hết giờ!</p>
      )}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button
          onClick={start}
          disabled={isRunning || timeLeft === 0}
          style={btnStyle("#198754")}
        >
          Bắt đầu
        </button>
        <button
          onClick={pause}
          disabled={!isRunning}
          style={btnStyle("#ffc107", "#000")}
        >
          Tạm dừng
        </button>
        <button onClick={reset} style={btnStyle("#6c757d")}>
          Đặt lại
        </button>
      </div>
    </div>
  );
}

function FlashSaleTimer() {
  const { timeLeft, isRunning, start, pause, reset } = useCountdown(120);
  return (
    <div
      style={{
        background: "#fff3cd",
        borderRadius: "12px",
        padding: "32px",
        textAlign: "center",
        border: "2px solid #ffc107",
      }}
    >
      <h2 style={{ marginBottom: "16px" }}>⚡ Flash Sale kết thúc sau</h2>
      <div
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#e85d04",
          marginBottom: "20px",
        }}
      >
        {timeLeft}s
      </div>
      {timeLeft === 0 && (
        <p style={{ color: "#dc3545", marginBottom: "16px" }}>
          Flash Sale đã kết thúc!
        </p>
      )}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button
          onClick={start}
          disabled={isRunning || timeLeft === 0}
          style={btnStyle("#e85d04")}
        >
          Bắt đầu
        </button>
        <button
          onClick={pause}
          disabled={!isRunning}
          style={btnStyle("#ffc107", "#000")}
        >
          Tạm dừng
        </button>
        <button onClick={reset} style={btnStyle("#6c757d")}>
          Đặt lại
        </button>
      </div>
    </div>
  );
}

const btnStyle = (bg: string, color = "#fff"): CSSProperties => ({
  padding: "10px 20px",
  background: bg,
  color,
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
});

export default function App() {
  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "32px" }}>
        Custom Hook: useCountdown
      </h1>
      <ExamTimer />
      <FlashSaleTimer />
    </div>
  );
}
