function WelcomeBanner({ isLoggedIn }) {
  return (
    <div className="banner">
      {isLoggedIn ? (
        <h2>Chào mừng trở lại!</h2>
      ) : (
        <button>Đăng nhập ngay</button>
      )}
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false };
  }

  toggle = () => {
    this.setState((prev) => ({ isLoggedIn: !prev.isLoggedIn }));
  };

  render() {
    return (
      <div className="container">
        <h1>Conditional Rendering</h1>
        <WelcomeBanner isLoggedIn={this.state.isLoggedIn} />
        <button className="toggle-btn" onClick={this.toggle}>
          {this.state.isLoggedIn ? "Đăng xuất" : "Giả lập đăng nhập"}
        </button>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
