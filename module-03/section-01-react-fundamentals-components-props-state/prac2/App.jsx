class CartCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  handleAddToCart = () => {
    this.setState({ count: this.state.count + 1 }, () => {
      console.log("Đã tăng:", this.state.count);
    });
  };

  render() {
    return (
      <button onClick={this.handleAddToCart}>
        Giỏ hàng: {this.state.count}
      </button>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CartCounter />);
