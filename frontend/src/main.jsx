import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext"; // Import ini

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      {" "}
      {/* Bungkus App */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
