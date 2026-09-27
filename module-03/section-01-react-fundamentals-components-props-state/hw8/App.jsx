class ScoreBoard extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.score !== this.props.score;
  }

  render() {
    console.log("ScoreBoard render() - điểm:", this.props.score);
    return (
      <div className="scoreboard">
        <h2>Điểm số: {this.props.score}</h2>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { score: 100 };
    this.intervalId = null;
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      const newScore =
        Math.random() > 0.5 ? this.state.score + 10 : this.state.score;
      this.setState({ score: newScore });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <div className="container">
        <h1>ScoreBoard - shouldComponentUpdate</h1>
        <p className="note">Mở Console để xem khi nào ScoreBoard render lại</p>
        <ScoreBoard score={this.state.score} />
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
