// src/components/BookForm.jsx
import React, { useState } from "react";
import "../styles/BookForm.css";

const BookForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price) return;
    onAdd(title, price); // Pass both title and price
    setTitle("");
    setPrice("");
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Book Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Book Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit">➕ Add Book</button>
    </form>
  );
};

export default BookForm;
