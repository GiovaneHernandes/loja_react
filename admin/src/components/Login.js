import React, { useState } from "react";
import axios from "axios";
import "../css/login.css";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const ValidaUsuario = async () => {
    if (!usuario || !senha) {
      alert("Por favor, preencha usuário e senha.");
      return;
    }

    setLoading(true);
    try {
      const url = "https://backend-completo.vercel.app/app/login";
      const dados = { usuario, senha };

      const retorno = await axios.post(url, dados);

      if (retorno.data.erro) {
        alert(retorno.data.erro);
      } else if (retorno.data.token) {
        localStorage.setItem("ALUNO_ITE", retorno.data.token);
        alert("Login realizado com sucesso!");
      }
    } catch (error) {
      alert("Erro na comunicação com o servidor.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-login">
      <h1>Faça seu login</h1>
      <input
        className="user-input"
        type="text"
        placeholder="Usuário"
        onChange={(e) => setUsuario(e.target.value)}
        value={usuario}
      />
      <input
        className="user-input"
        type="password"
        placeholder="Senha"
        onChange={(e) => setSenha(e.target.value)}
        value={senha}
      />
      <input
        className="login"
        type="button"
        value={loading ? "Entrando..." : "Login"}
        disabled={loading}
        onClick={ValidaUsuario}
      />
    </div>
  );
};

export default Login;
