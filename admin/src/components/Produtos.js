import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/produto.css";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]); // Para armazenar os produtos
  const [formulario, setFormulario] = useState({
    // Para armazenar os dados do formulário
    nome: "",
    quantidade: 0,
    preco: 0,
    categoria: "",
    descricao: "",
    usuario: "",
    imagem: "",
  });

  const token = localStorage.getItem("ALUNO_ITE");
  const url = "https://backend-completo.vercel.app/app/produtos";

  // Função para buscar os produtos ao carregar a página
  useEffect(() => {
    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setProdutos(response.data)) // Armazena os produtos na variável
      .catch((erro) => console.log("Erro ao buscar produtos:", erro));
  }, []);

  // Função para atualizar os campos do formulário
  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // Função para criar um novo produto
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(url, formulario, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        alert("Produto cadastrado com sucesso!");
        setFormulario({
          nome: "",
          quantidade: 0,
          preco: 0,
          categoria: "",
          descricao: "",
          usuario: "",
          imagem: "",
        });
        // Recarrega a lista de produtos após adicionar um novo
        axios
          .get(url, { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => setProdutos(response.data));
      })
      .catch((erro) => console.log("Erro ao criar produto:", erro));
  };

  const prodDelete = (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) return;

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          id: id,
        },
      })
      .then(() => console.log("Produto deletado com sucesso!"))
      .catch((erro) => console.log("Erro ao deletar produto:", erro));
  };

  return (
    <div className="containerProd">
      <h1>Produtos</h1>

      <ul className="prod">
        {produtos.map((produto) => (
          <li key={produto._id}>
            <p>{produto._id}</p>
            <img src={produto.imagem} alt={produto.nome} width="100" />
            <h3>{produto.nome}</h3>
            <p>Categoria: {produto.categoria}</p>
            <p>Preço: R$ {produto.preco}</p>
            <p>Quantidade: {produto.quantidade}</p>
            <p>{produto.descricao}</p>
            <button onClick={() => prodDelete(produto._id)}>❌ Deletar</button>
          </li>
        ))}
      </ul>

      <div className="forms">
        <div>
          <h2>Cadastrar Novo Produto</h2>

          {/* Formulário de cadastro de produto */}
          <form className="form_prod" onSubmit={handleSubmit}>
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={formulario.nome}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="quantidade"
              placeholder="Quantidade"
              value={formulario.quantidade}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              step="0.01"
              name="preco"
              placeholder="Preço"
              value={formulario.preco}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="categoria"
              placeholder="Categoria"
              value={formulario.categoria}
              onChange={handleChange}
            />
            <input
              type="text"
              name="descricao"
              placeholder="Descrição"
              value={formulario.descricao}
              onChange={handleChange}
            />
            <input
              type="text"
              name="usuario"
              placeholder="Usuário"
              value={formulario.usuario}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="imagem"
              placeholder="Imagem (URL)"
              value={formulario.imagem}
              onChange={handleChange}
            />
            <button className="cadastrar" type="submit">
              Cadastrar
            </button>
          </form>
        </div>

        <div className="atulizarProduto">
          <h2>Atualizar Produto</h2>

          {/* Formulário de cadastro de produto */}
          <form className="form_prod">
            <input
              type="text"
              name="nome"
              placeholder="Id"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="quantidade"
              placeholder="Quantidade"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              step="0.01"
              name="preco"
              placeholder="Preço"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="categoria"
              placeholder="Categoria"
              onChange={handleChange}
            />
            <input
              type="text"
              name="descricao"
              placeholder="Descrição"
              onChange={handleChange}
            />
            <input
              type="text"
              name="usuario"
              placeholder="Usuário"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="imagem"
              placeholder="Imagem (URL)"
              onChange={handleChange}
            />
            <button className="Atualizar" type="submit">
              Atualizar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Produtos;
