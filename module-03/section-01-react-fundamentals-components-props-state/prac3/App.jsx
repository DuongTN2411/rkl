function BookItem(props) {
  return (
    <li>
      <strong>{props.title}</strong> - {props.author}
    </li>
  );
}

class BookStore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [
        { id: 1, title: "Lập trình React", author: "Nguyễn Văn A" },
        { id: 2, title: "JavaScript nâng cao", author: "Trần Thị B" },
        { id: 3, title: "Clean Code", author: "Robert C. Martin" },
      ],
    };
  }

  render() {
    const { books } = this.state;
    return (
      <div>
        <h1>Danh sách sách</h1>
        {books.length === 0 ? (
          <p>Hiện chưa có cuốn sách nào trong kho</p>
        ) : (
          <ul>
            {books.map((book) => (
              <BookItem key={book.id} title={book.title} author={book.author} />
            ))}
          </ul>
        )}
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<BookStore />);
