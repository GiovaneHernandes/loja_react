import React, { useState } from "react";
import axios from "axios";
import "../css/login.css";

const Login = () => {
  var [usuario, setUsuario] = useState("");
  var [senha, setSenha] = useState("");

  const ValidaUsuario = async () => {
    var url = "https://backend-completo.vercel.app/app/login";
    var dados = {
      usuario,
      senha,
    };

    await axios.post(url, dados).then((retorno) => {
      console.log(retorno);
      if (retorno.data.erro) {
        alert(retorno.data.erro);
      }

      if (retorno.data.token) {
        localStorage.setItem("ALUNO_ITE", retorno.data.token);
      }
    });
  };
  return (
    <div className="container-login">
      <h1>Faça seu login</h1>
      <input
        className="user-input"
        type="text"
        placeholder="usuario"
        onChange={(e) => setUsuario(e.target.value)}
      />
      <input
        className="user-input"
        type="password"
        placeholder="sua senha"
        onChange={(e) => setSenha(e.target.value)}
      />
      <input
        className="login"
        type="button"
        value="Login"
        onClick={() => ValidaUsuario()}
      />
    </div>
  );
};

export default Login;
