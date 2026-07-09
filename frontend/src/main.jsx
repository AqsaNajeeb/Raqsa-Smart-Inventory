import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { CartProvider } from "./Context/CartContext.jsx";
import { SearchProvider } from "./Context/SearchContext.jsx";
import "./index.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <CartProvider>
      <SearchProvider>
          <App />
      </SearchProvider>
    </CartProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
