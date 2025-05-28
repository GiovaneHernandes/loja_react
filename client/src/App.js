import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import Pedidos from "./components/Pedidos";
import Sobre from "./components/Sobre";
import Contato from "./components/Contato";

import logoPizzaria from "./img/logoSemFundo.png";
import "./css/navbar.css";

const App = () => {
  const [activeLink, setActiveLink] = React.useState("");

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="logo-container">
            <img
              src="https://imgs.search.brave.com/gZDefnstMC-EmmuQRsJa7n5tuqBs_2Pi2ezov1ZoEjo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vNFRUSDBS/VjFreVc2RnE2Z1VP/b0hxckRzaGowVXBn/VEdwNTZNZDFSTGZB/TS9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTkz/ZDNjdS9jRzVuYTJW/NUxtTnZiUzl3L2Jt/Y3ZablZzYkM4ek1E/RXQvTXpBeE5EWTVN/bDl3YVhwNi9ZUzF6/ZEdWMlpTMW5ZVzFs/L0xYQnBaV05sTFhC/cGVucGgvTFhOMFpY/WmxMbkJ1Wnc"
              alt="Logo Pizzaria"
              style={{ width: "140px", marginBottom: "1rem" }}
            />
            <span className="brand-name">Pizzaria A+</span>
          </div>

          <ul className="nav-links">
            <li>
              <Link
                to="/"
                onClick={() => handleLinkClick("/")}
                className={activeLink === "/" ? "active" : ""}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/pedidos"
                onClick={() => handleLinkClick("/pedidos")}
                className={activeLink === "/pedidos" ? "active" : ""}
              >
                Pedidos
              </Link>
            </li>
            <li>
              <Link
                to="/sobre"
                onClick={() => handleLinkClick("/sobre")}
                className={activeLink === "/sobre" ? "active" : ""}
              >
                Sobre
              </Link>
            </li>
            <li>
              <Link
                to="/contato"
                onClick={() => handleLinkClick("/contato")}
                className={activeLink === "/contato" ? "active" : ""}
              >
                Contato
              </Link>
            </li>
          </ul>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
