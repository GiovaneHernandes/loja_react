import { useEffect, useState } from "react";

const Pedidos = () => {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);
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
    const fetchVendas = async () => {
      if (!usuario) {
        console.error("Usuário não encontrado no token.");
        setCarregando(false);
        return;
      }

      try {
        const res = await fetch(
          `https://backend-completo.vercel.app/app/venda?usuario=${usuario}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Erro ao buscar vendas.");

        const data = await res.json();
        setVendas(data);
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
      } finally {
        setCarregando(false);
      }
    };

    fetchVendas();
  }, [token, usuario]);

  return (
    <div className="container">
      <h1>Vendas Realizadas</h1>

      {carregando ? (
        <p>Carregando vendas...</p>
      ) : vendas.length === 0 ? (
        <p>Nenhuma venda encontrada.</p>
      ) : (
        vendas.map((venda) => (
          <div key={venda._id} className="card-venda">
            <h3>Cliente: {venda.nomeCliente}</h3>
            <p>Data: {new Date(venda.data).toLocaleDateString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço Unitário</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {venda.produtos.map((p, i) => (
                  <tr key={i}>
                    <td>{p.nome}</td>
                    <td>{p.quantidade}</td>
                    <td>R$ {p.preco.toFixed(2)}</td>
                    <td>R$ {(p.quantidade * p.preco).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              <strong>Total da venda:</strong> R${" "}
              {venda.produtos
                .reduce((acc, p) => acc + p.quantidade * p.preco, 0)
                .toFixed(2)}
            </p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default Pedidos;
