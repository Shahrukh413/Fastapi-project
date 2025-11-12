import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BookForm from "../components/BookForm";
import SearchBar from "../components/SearchBar";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [books, setBooks] = useState(() => {
    return JSON.parse(localStorage.getItem("books")) || [];
  });
  const [filtered, setFiltered] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const navigate = useNavigate();

  // keep filtered in sync
  useEffect(() => {
    setFiltered(books);
  }, [books]);

  // ✅ Add a book
  const addBook = (title, price) => {
    if (!title.trim() || !price) return alert("Please enter title and price!");
    const newBook = { id: Date.now(), title, price };
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
  };

  // ✅ Delete a book
  const deleteBook = (id) => {
    if (!window.confirm("Delete this book?")) return;
    const updated = books.filter((b) => b.id !== id);
    setBooks(updated);
    localStorage.setItem("books", JSON.stringify(updated));
  };

  // ✅ Start editing
  const startEdit = (book) => {
    setEditingId(book.id);
    setEditTitle(book.title);
    setEditPrice(book.price);
  };

  // ✅ Save edit
  const saveEdit = (id) => {
    if (!editTitle.trim() || !editPrice)
      return alert("Please enter both title and price!");
    const updated = books.map((b) =>
      b.id === id ? { ...b, title: editTitle, price: editPrice } : b
    );
    setBooks(updated);
    localStorage.setItem("books", JSON.stringify(updated));
    setEditingId(null);
    setEditTitle("");
    setEditPrice("");
  };

  // ✅ Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditPrice("");
  };

  // ✅ Search books
  const searchBook = (query) => {
    if (!query.trim()) {
      setFiltered(books);
    } else {
      const q = query.toLowerCase();
      setFiltered(books.filter((b) => b.title.toLowerCase().includes(q)));
    }
  };

  // ✅ Logout
  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <div className="dashboard">
      <Navbar onLogout={logout} />

      <div className="content">
        <h1>📚 My Library</h1>

        <SearchBar onSearch={searchBook} />
        <BookForm onAdd={addBook} />

        <ul className="book-list">
          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", color: "gray" }}>
              No books found. Add one above!
            </p>
          ) : (
            filtered.map((book) => (
              <li key={book.id} className="book-item">
                {editingId === book.id ? (
                  <div className="edit-section">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Book Title"
                    />
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      placeholder="Book Price"
                    />
                    <div className="edit-buttons">
                      <button onClick={() => saveEdit(book.id)}>💾 Save</button>
                      <button onClick={cancelEdit}>❌ Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="book-display">
                    <span className="book-info">
                      <strong>{book.title}</strong> - ${book.price}
                    </span>
                    <div className="book-actions">
                      <button onClick={() => startEdit(book)}>✏️ Edit</button>
                      <button onClick={() => deleteBook(book.id)}>
                        ❌ Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
