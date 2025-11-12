// src/components/Navbar.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext";
import "../styles/Navbar.css";

const Navbar = ({ onLogout }) => {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <nav className="navbar">
      <h3>Library System</h3>
      <div className="actions">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
        <button onClick={onLogout}>🚪 Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
