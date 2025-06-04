import { useEffect, useState } from "react";
import "../css/pedidos.css";

const Pedidos = () => {
  const [nomeCliente, setNomeCliente] = useState("");
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  localStorage.setItem(
    "ALUNO_ITE",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiMDEwNjIzMDcyIiwiaWF0IjoxNzQ5MDc2MTM5LCJleHAiOjE3NDkxNjI1Mzl9.jDcg_UvATccqRvtbAcbrg_2G3XLF5g5jchhVqTjiFFw"
  );

  // Agora lê o token normalmente

  const token = localStorage.getItem("ALUNO_ITE");
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

  // Busca produtos
  useEffect(() => {
    const fetchProdutos = async () => {
      if (!usuario) {
        console.error("Usuário não encontrado no token.");
        return;
      }
      try {
        const res = await fetch(
          `https://backend-completo.vercel.app/app/produtos/${usuario}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Erro na resposta da API");
        const data = await res.json();
        setTodosProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, [usuario, token]);

  // Busca categorias
  const listaCategoria = async () => {
    try {
      const resposta = await fetch(
        "https://backend-completo.vercel.app/app/categorias",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dados = await resposta.json();
      setCategorias(dados);
    } catch (erro) {
      console.error("Erro ao buscar categorias:", erro);
    }
  };

  useEffect(() => {
    listaCategoria();
  }, []);

  // Adiciona produto
  const adicionarProdutoNoPedido = (produto) => {
    setProdutosSelecionados((prev) => {
      const index = prev.findIndex((p) => p.nome === produto.nome);
      if (index >= 0) {
        const novos = [...prev];
        novos[index].quantidade += 1;
        return novos;
      } else {
        return [
          ...prev,
          {
            nome: produto.nome,
            quantidade: 1,
            preco: produto.preco,
            imagem: produto.imagem, // guardando imagem para mostrar depois
          },
        ];
      }
    });
  };

  // Atualiza/remover produto
  const atualizarQuantidade = (index, quantidade) => {
    setProdutosSelecionados((prev) => {
      const novos = [...prev];
      if (quantidade <= 0) {
        novos.splice(index, 1);
      } else {
        novos[index].quantidade = quantidade;
      }
      return novos;
    });
  };

  const totalGeral = produtosSelecionados.reduce(
    (acc, p) => acc + p.quantidade * p.preco,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomeCliente) {
      alert("Por favor, informe o nome do cliente.");
      return;
    }
    if (produtosSelecionados.length === 0) {
      alert("Adicione pelo menos um produto ao pedido.");
      return;
    }

    const novaVenda = {
      nomeCliente,
      data: new Date().toISOString().split("T")[0],
      produtos: produtosSelecionados,
      usuario,
    };

    try {
      const response = await fetch(
        "https://backend-completo.vercel.app/app/venda",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(novaVenda),
        }
      );

      if (response.ok) {
        alert("Pedido criado com sucesso!");
        setNomeCliente("");
        setProdutosSelecionados([]);
      } else {
        const erro = await response.json();
        console.error("Erro ao criar pedido:", erro);
        alert("Erro ao criar pedido. Veja o console.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Pedidos</h1>

      <form onSubmit={handleSubmit}>
        <div className="container_nome">
          <label>Nome do Cliente:</label>
          <input
            type="text"
            className="inpt_nome_cliente"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            required
          />
        </div>

        {/* Botões de categorias */}
        <h3>Categorias</h3>
        <div style={{ marginBottom: "1rem" }}>
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              type="button"
              onClick={() => setCategoriaSelecionada(categoria.nome)}
              style={{
                margin: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor:
                  categoriaSelecionada === categoria.nome
                    ? "#cc0000"
                    : "#9c0404",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {categoria.nome}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCategoriaSelecionada(null)}
            style={{
              margin: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Todas
          </button>
        </div>

        <h3>Produtos disponíveis</h3>
        <div className="lista-produtos">
          {todosProdutos.length === 0 && <p>Carregando produtos...</p>}
          {todosProdutos
            .filter((produto) =>
              categoriaSelecionada
                ? produto.categoria === categoriaSelecionada
                : true
            )
            .map((produto) => (
              <button
                key={produto._id || produto.id}
                type="button"
                className="botao-produto"
                onClick={() => adicionarProdutoNoPedido(produto)}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    gap: "1rem",
                    padding: "0.5rem",
                  }}
                >
                  {produto.imagem && (
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <span style={{ fontWeight: "bold", fontSize: 17 }}>
                      {produto.nome}
                    </span>
                    <p style={{ fontSize: "0.875rem" }}>{produto.descricao}</p>
                  </div>
                  <strong
                    style={{
                      fontSize: 17,
                      minWidth: "80px",
                      textAlign: "right",
                    }}
                  >
                    R$ {produto.preco.toFixed(2)}
                  </strong>
                </div>
              </button>
            ))}
        </div>

        {/* Produtos selecionados */}
        {produtosSelecionados.length > 0 && (
          <>
            <h3>Produtos selecionados</h3>
            <div
              className="lista-produtos"
              style={{ marginBottom: "2rem", padding: "1rem", borderRadius: 8 }}
            >
              <table
                className="tabela-produtos-selecionados"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Imagem</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Preço Unitário</th>
                    <th>Total</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosSelecionados.map((p, i) => (
                    <tr key={i}>
                      <td>
                        {p.imagem && (
                          <img
                            src={p.imagem}
                            alt={p.nome}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        )}
                      </td>
                      <td>{p.nome}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              atualizarQuantidade(
                                i,
                                Math.max(p.quantidade - 1, 0)
                              )
                            }
                            style={{
                              backgroundColor: "#cc0000",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              width: "30px",
                              height: "30px",
                              fontSize: "18px",
                              cursor: "pointer",
                            }}
                          >
                            -
                          </button>
                          <span>{p.quantidade}</span>
                          <button
                            type="button"
                            onClick={() =>
                              atualizarQuantidade(i, p.quantidade + 1)
                            }
                            style={{
                              backgroundColor: "#006400",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              width: "30px",
                              height: "30px",
                              fontSize: "18px",
                              cursor: "pointer",
                            }}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td>R$ {p.preco.toFixed(2)}</td>
                      <td>R$ {(p.quantidade * p.preco).toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => atualizarQuantidade(i, 0)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "right", fontWeight: "bold" }}
                    >
                      Total Geral:
                    </td>
                    <td colSpan="2" style={{ fontWeight: "bold" }}>
                      R$ {totalGeral.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        <br />
        <button
          style={{
            marginBottom: 50,
            color: "white",
            width: "100%",
            height: 50,
            backgroundColor: "green",
            border: "solid",
            borderRadius: 5,
            fontSize: 20,
          }}
          type="submit"
        >
          Criar Pedido
        </button>
      </form>
    </div>
  );
};

export default Pedidos;
