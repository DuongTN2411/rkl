const TOTAL_SECONDS = 25 * 60;

class PomodoroTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secondsLeft: TOTAL_SECONDS,
      isRunning: false,
      isDone: false,
    };
    this.intervalId = null;
  }

  formatTime(seconds) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  handlePlay = () => {
    if (this.state.isDone || this.state.isRunning) return;
    this.setState({ isRunning: true });
    this.intervalId = setInterval(() => {
      this.setState((prev) => {
        if (prev.secondsLeft <= 1) {
          clearInterval(this.intervalId);
          return { secondsLeft: 0, isRunning: false, isDone: true };
        }
        return { secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);
  };

  handlePause = () => {
    clearInterval(this.intervalId);
    this.setState({ isRunning: false });
  };

  handleReset = () => {
    clearInterval(this.intervalId);
    this.setState({
      secondsLeft: TOTAL_SECONDS,
      isRunning: false,
      isDone: false,
    });
  };

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const { secondsLeft, isRunning, isDone } = this.state;
    return (
      <div className="container">
        <h1>Pomodoro Timer</h1>
        <div className="timer-display">
          {isDone ? (
            <p className="done-text">Hết giờ!</p>
          ) : (
            <h2>{this.formatTime(secondsLeft)}</h2>
          )}
        </div>
        <div className="controls">
          <button onClick={this.handlePlay} disabled={isRunning || isDone}>
            Bắt đầu
          </button>
          <button onClick={this.handlePause} disabled={!isRunning}>
            Tạm dừng
          </button>
          <button onClick={this.handleReset}>Đặt lại</button>
        </div>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<PomodoroTimer />);
