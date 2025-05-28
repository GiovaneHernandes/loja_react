import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
} from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Produtos from "./components/Produtos";
import Pedidos from "./components/Pedidos";
import Login from "./components/Login";
import RegistroUser from "./components/RegistroUser";
import Categoria from "./components/Categoria";

import logoPizzaria from "./img/logo_pizzaria.png";

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "220px",
    backgroundColor: "#d40004",
    color: "#d40004",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
  },
  link: {
    color: "#ecf0f1",
    textDecoration: "none",
    padding: "0.75rem 1rem",
    borderRadius: "4px",
    marginBottom: "0.5rem",
    transition: "background-color 0.3s",
  },
  linkHover: {
    backgroundColor: "#fff7d9",
    color: "black",
  },
  content: {
    marginLeft: "220px",
    padding: "2rem",
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
};

const Middleware = () => {
  const logado = localStorage.getItem("ALUNO_ITE");

  return logado ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => {
  // Estado para controlar o link ativo (opcional)
  const [activeLink, setActiveLink] = React.useState("");

  // Função para lidar com o clique nos links
  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <BrowserRouter>
      <div style={styles.app}>
        <nav style={styles.sidebar}>
          <img
            src={logoPizzaria}
            alt="Logo Pizzaria"
            style={{ width: "200px", marginBottom: "1rem" }}
          />

          <Link
            to="/"
            style={{
              ...styles.link,
              ...(activeLink === "/" ? styles.linkHover : {}),
            }}
            onClick={() => handleLinkClick("/")}
          >
            Dashboard
          </Link>
          <Link
            to="/produtos"
            style={{
              ...styles.link,
              ...(activeLink === "/produtos" ? styles.linkHover : {}),
            }}
            onClick={() => handleLinkClick("/produtos")}
          >
            Produtos
          </Link>
          <Link
            to="/categoria"
            style={{
              ...styles.link,
              ...(activeLink === "/categoria" ? styles.linkHover : {}),
            }}
            onClick={() => handleLinkClick("/categoria")}
          >
            Categoria
          </Link>
          <Link
            to="/pedidos"
            style={{
              ...styles.link,
              ...(activeLink === "/pedidos" ? styles.linkHover : {}),
            }}
            onClick={() => handleLinkClick("/pedidos  ")}
          >
            Pedidos
          </Link>
          <Link
            to="/registro"
            style={{
              ...styles.link,
              ...(activeLink === "/registro" ? styles.linkHover : {}),
            }}
            onClick={() => handleLinkClick("/registro")}
          >
            RegistroUser
          </Link>
        </nav>
        <div style={styles.content}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Middleware />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/categoria" element={<Categoria />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/registro" element={<RegistroUser />} />
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
