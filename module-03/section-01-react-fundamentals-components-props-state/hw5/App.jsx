function PricingCard({ name, price, color }) {
  const displayPrice = !price
    ? "Liên hệ"
    : `${price.toLocaleString("vi-VN")} VND`;

  return (
    <div className="card" style={{ borderColor: color }}>
      <div className="card-header" style={{ backgroundColor: color }}>
        <h2>{name}</h2>
      </div>
      <div className="card-body">
        <p className="price">{displayPrice}</p>
        <button style={{ backgroundColor: color }}>Chọn gói</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="container">
      <h1>Bảng Giá Dịch Vụ</h1>
      <div className="cards-wrapper">
        <PricingCard name="Basic" price={99000} color="#6c757d" />
        <PricingCard name="Pro" price={299000} color="#0d6efd" />
        <PricingCard name="Enterprise" price={0} color="#198754" />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
