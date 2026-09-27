function FaqItem({ index, question, answer, activeIndex, onToggle }) {
  const isOpen = activeIndex === index;
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={() => onToggle(index)}>
        <span>{question}</span>
        <span className="icon">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
  );
}

class FaqList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: null };
  }

  handleToggle = (index) => {
    this.setState((prev) => ({
      activeIndex: prev.activeIndex === index ? null : index,
    }));
  };

  render() {
    const faqs = [
      {
        question: "React là gì?",
        answer:
          "React là một thư viện JavaScript để xây dựng giao diện người dùng.",
      },
      {
        question: "Props và State khác nhau như thế nào?",
        answer:
          "Props được truyền từ cha xuống con và là read-only. State là dữ liệu nội bộ của component và có thể thay đổi.",
      },
      {
        question: "Lifecycle là gì?",
        answer:
          "Lifecycle là vòng đời của một Component gồm 3 giai đoạn: Mounting, Updating và Unmounting.",
      },
      {
        question: "Lifting State Up là gì?",
        answer:
          "Lifting State Up là kỹ thuật đưa State lên Component cha để chia sẻ giữa các Component con.",
      },
      {
        question: "shouldComponentUpdate dùng để làm gì?",
        answer:
          "shouldComponentUpdate cho phép kiểm soát xem Component có nên re-render hay không, giúp tối ưu hiệu năng.",
      },
    ];

    return (
      <div className="container">
        <h1>Câu hỏi thường gặp</h1>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <FaqItem
              key={i}
              index={i}
              question={faq.question}
              answer={faq.answer}
              activeIndex={this.state.activeIndex}
              onToggle={this.handleToggle}
            />
          ))}
        </div>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<FaqList />);
