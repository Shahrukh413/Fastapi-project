import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext"; // ✅ import this
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>   {/* ✅ Wrap the entire app inside the provider */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
