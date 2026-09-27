import React from "react";

function NewsletterForm({ onSubmit }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Đăng ký</button>
    </form>
  );
}

export default NewsletterForm;
