import { useReducer, useState } from "react";

interface Course {
  id: number;
  title: string;
  price: number;
}

interface CartState {
  items: Course[];
  discountCode: string;
  discountPercent: number;
}

type CartAction =
  | { type: "ADD_COURSE"; payload: Course }
  | { type: "REMOVE_COURSE"; payload: number }
  | { type: "APPLY_DISCOUNT"; payload: string };

const VALID_CODES: Record<string, number> = {
  REACT20: 20,
  SAVE10: 10,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_COURSE": {
      const exists = state.items.some((i) => i.id === action.payload.id);
      if (exists) return state;
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_COURSE":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };
    case "APPLY_DISCOUNT": {
      const pct = VALID_CODES[action.payload.toUpperCase()] ?? 0;
      return { ...state, discountCode: action.payload, discountPercent: pct };
    }
    default:
      return state;
  }
}

const CATALOG: Course[] = [
  { id: 1, title: "React TypeScript", price: 599000 },
  { id: 2, title: "Next.js Fullstack", price: 799000 },
  { id: 3, title: "NestJS Backend", price: 699000 },
  { id: 4, title: "Docker & DevOps", price: 499000 },
];

const fmt = (n: number) => n.toLocaleString("vi-VN") + " VND";

export default function App() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    discountCode: "",
    discountPercent: 0,
  });
  const [codeInput, setCodeInput] = useState("");
  const [codeMsg, setCodeMsg] = useState("");

  const subtotal = state.items.reduce((s, i) => s + i.price, 0);
  const discount = Math.round((subtotal * state.discountPercent) / 100);
  const total = subtotal - discount;

  const applyCode = () => {
    dispatch({ type: "APPLY_DISCOUNT", payload: codeInput });
    const pct = VALID_CODES[codeInput.toUpperCase()];
    setCodeMsg(
      pct ? `✅ Áp dụng thành công: giảm ${pct}%` : "❌ Mã không hợp lệ"
    );
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 20px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "32px",
      }}
    >
      <div>
        <h2 style={{ marginBottom: "16px" }}>📚 Danh sách khóa học</h2>
        {CATALOG.map((c) => {
          const inCart = state.items.some((i) => i.id === c.id);
          return (
            <div
              key={c.id}
              style={{
                background: "#fff",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "12px",
                border: "1px solid #e0e0e0",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
                {c.title}
              </div>
              <div style={{ color: "#0d6efd", marginBottom: "10px" }}>
                {fmt(c.price)}
              </div>
              <button
                onClick={() => dispatch({ type: "ADD_COURSE", payload: c })}
                disabled={inCart}
                style={{
                  padding: "8px 16px",
                  background: inCart ? "#ccc" : "#0d6efd",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: inCart ? "not-allowed" : "pointer",
                }}
              >
                {inCart ? "Đã thêm" : "Thêm vào giỏ"}
              </button>
            </div>
          );
        })}
      </div>

      <div>
        <h2 style={{ marginBottom: "16px" }}>
          🛒 Giỏ hàng ({state.items.length})
        </h2>
        {state.items.length === 0 ? (
          <p style={{ color: "#999" }}>Giỏ hàng trống.</p>
        ) : (
          <>
            {state.items.map((i) => (
              <div
                key={i.id}
                style={{
                  background: "#fff",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{i.title}</span>
                <div
                  style={{ display: "flex", gap: "12px", alignItems: "center" }}
                >
                  <span style={{ color: "#0d6efd" }}>{fmt(i.price)}</span>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_COURSE", payload: i.id })
                    }
                    style={{
                      background: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}

            <div
              style={{
                background: "#fff",
                padding: "16px",
                borderRadius: "8px",
                marginTop: "16px",
              }}
            >
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value);
                    setCodeMsg("");
                  }}
                  placeholder="Nhập mã giảm giá"
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
                <button
                  onClick={applyCode}
                  style={{
                    padding: "8px 16px",
                    background: "#198754",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Áp dụng
                </button>
              </div>
              {codeMsg && (
                <p style={{ fontSize: "0.9rem", marginBottom: "12px" }}>
                  {codeMsg}
                </p>
              )}
              <div style={{ borderTop: "1px solid #eee", paddingTop: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span>Tạm tính:</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#198754",
                      marginBottom: "6px",
                    }}
                  >
                    <span>Giảm giá ({state.discountPercent}%):</span>
                    <span>-{fmt(discount)}</span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  <span>Tổng tiền:</span>
                  <span style={{ color: "#0d6efd" }}>{fmt(total)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
