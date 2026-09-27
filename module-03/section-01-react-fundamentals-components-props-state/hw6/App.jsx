class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errorMessage: "",
    };
  }

  handleSubmit = () => {
    const { username, password } = this.state;

    if (!username || !password || username.includes(" ")) {
      this.setState({ errorMessage: "Vui lòng kiểm tra lại thông tin" });
      return;
    }

    this.setState({ errorMessage: "" });
    console.log({ username, password });
  };

  render() {
    const { username, password, errorMessage } = this.state;
    return (
      <div className="form-container">
        <h2>Đăng nhập</h2>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => this.setState({ username: e.target.value })}
            placeholder="Nhập username"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => this.setState({ password: e.target.value })}
            placeholder="Nhập password"
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<LoginForm />);
