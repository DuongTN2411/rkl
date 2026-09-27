function UserProfile(props) {
  return (
    <div className="card">
      <h1>Tên nhân viên: {props.name}</h1>
      <p>Chức vụ: {props.role}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <UserProfile name="Nguyễn Văn A" role="Frontend Developer" />
      <UserProfile name="Trần Thị B" role="Backend Developer" />
      <UserProfile name="Lê Văn C" role="UI/UX Designer" />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
