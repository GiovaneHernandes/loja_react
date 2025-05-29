import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/dashboard.css"; // Opcional, caso queira estilizar o card

const Dashboard = () => {
  const [quantidadeVendas, setQuantidadeVendas] = useState(0);
  const token = localStorage.getItem("ALUNO_ITE");

  // Função para extrair o "usuario" do token JWT
  const pegarUsuarioDoToken = () => {
    if (!token) return "";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.usuario || "";
    } catch {
      return "";
    }
  };

  const usuario = pegarUsuarioDoToken();

  useEffect(() => {
    const fetchQuantidadeVendas = async () => {
      if (!usuario) {
        console.error("Usuário não encontrado no token.");
        return;
      }

      try {
        const res = await axios.get(
          `https://backend-completo.vercel.app/app/venda?usuario=${usuario}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (Array.isArray(res.data)) {
          setQuantidadeVendas(res.data.length);
        } else {
          console.error("Resposta inesperada:", res.data);
        }
      } catch (error) {
        console.error("Erro ao buscar quantidade de vendas:", error);
      }
    };

    fetchQuantidadeVendas();
  }, [token, usuario]);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="card">
        <h2>Quantidade de Vendas</h2>
        <p>{quantidadeVendas}</p>
      </div>
    </div>
  );
};

export default Dashboard;
