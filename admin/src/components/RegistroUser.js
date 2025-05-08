import React, { useState } from "react";
import axios from "axios";

const RegistroUser = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [mensagem, setMensagem] = useState("");

  const Cadastro = async () => {
    const url = "https://backend-completo.vercel.app/app/registrar";

    try {
      const response = await axios.post(url, {
        usuario: usuario,
        senha: senha,
        confirma: confirma,
      });

      if (response.data.error) {
        alert(`Erro: ${response.data.error}`);
      } else {
        alert(`Usuário ${response.data.usuario} cadastrado com sucesso!`);
      }
    } catch (error) {
      setMensagem("Erro ao registrar usuário. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Registrar Usuário</h1>
      <input
        type="text"
        placeholder="RA do aluno"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Confirmar senha"
        value={confirma}
        onChange={(e) => setConfirma(e.target.value)}
      />
      <br />
      <button onClick={Cadastro}>Cadastrar</button>
      <p>{mensagem}</p>
    </div>
  );
};

export default RegistroUser;
