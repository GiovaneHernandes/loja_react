import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/produto.css";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [formulario, setFormulario] = useState({
    nome: "",
    quantidade: 0,
    preco: 0,
    categoria: "",
    descricao: "",
    usuario: "",
    imagem: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [formularioEdicao, setFormularioEdicao] = useState({
    id: "",
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

  // Função para carregar os produtos
  const carregarProdutos = () => {
    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setProdutos(response.data))
      .catch((erro) => console.log("Erro ao buscar produtos:", erro));
  };

  // Função para carregar as categorias
  const carregarCategorias = () => {
    axios
      .get("https://backend-completo.vercel.app/app/categorias", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategorias(res.data.categorias || res.data))
      .catch((err) => console.log("Erro ao carregar categorias:", err));
  };

  useEffect(() => {
    carregarProdutos();
    carregarCategorias();
  }, []);

  // Função genérica para atualizar os estados dos formulários
  const handleChange = (e, tipoForm = "formulario") => {
    const { name, value } = e.target;
    if (tipoForm === "formulario") {
      setFormulario({ ...formulario, [name]: value });
    } else {
      setFormularioEdicao({ ...formularioEdicao, [name]: value });
    }
  };

  // Função para cadastrar um novo produto
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
        carregarProdutos();
      })
      .catch((erro) => console.log("Erro ao criar produto:", erro));
  };

  // Função para deletar um produto
  const prodDelete = (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) return;

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id },
      })
      .then(() => {
        alert("Produto deletado com sucesso!");
        carregarProdutos();
      })
      .catch((erro) => console.log("Erro ao deletar produto:", erro));
  };

  // Função para buscar um produto por ID
  const buscarProdutoPorId = async (id) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const produto = response.data.find((p) => p._id === id);
      if (produto) {
        setFormularioEdicao({
          id: produto._id,
          nome: produto.nome,
          quantidade: produto.quantidade,
          preco: produto.preco,
          categoria: produto.categoria || "",
          descricao: produto.descricao || "",
          usuario: produto.usuario || "",
          imagem: produto.imagem || "",
        });
      } else {
        alert("Produto não encontrado.");
      }
    } catch (erro) {
      console.log("Erro ao buscar produto:", erro);
    }
  };

  // Função para atualizar um produto
  const handleAtualizar = (e) => {
    e.preventDefault();

    if (!formularioEdicao.id) {
      alert("ID do produto não informado.");
      return;
    }

    axios
      .put(url, formularioEdicao, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("Produto atualizado com sucesso!");
        setFormularioEdicao({
          id: "",
          nome: "",
          quantidade: 0,
          preco: 0,
          categoria: "",
          descricao: "",
          usuario: "",
          imagem: "",
        });
        carregarProdutos();
      })
      .catch((erro) => console.log("Erro ao atualizar produto:", erro));
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
            <p>
              Categoria:{" "}
              {typeof produto.categoria === "object"
                ? produto.categoria.nome
                : produto.categoria}
            </p>
            <p>Preço: R$ {produto.preco}</p>
            <p>Quantidade: {produto.quantidade}</p>
            <p>{produto.descricao}</p>
            <button onClick={() => prodDelete(produto._id)}>❌ Deletar</button>
          </li>
        ))}
      </ul>

      <div className="forms">
        {/* FORM CADASTRAR */}
        <div>
          <h2>Cadastrar Novo Produto</h2>
          <form className="form_prod" onSubmit={handleSubmit}>
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={formulario.nome}
              onChange={(e) => handleChange(e, "formulario")}
              required
            />
            <input
              type="number"
              name="quantidade"
              placeholder="Quantidade"
              value={formulario.quantidade}
              onChange={(e) => handleChange(e, "formulario")}
              required
            />
            <input
              type="number"
              step="0.01"
              name="preco"
              placeholder="Preço"
              value={formulario.preco}
              onChange={(e) => handleChange(e, "formulario")}
              required
            />
            <select
              name="categoria"
              value={formulario.categoria}
              onChange={(e) => handleChange(e, "formulario")}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="descricao"
              placeholder="Descrição"
              value={formulario.descricao}
              onChange={(e) => handleChange(e, "formulario")}
            />
            <input
              type="text"
              name="usuario"
              placeholder="Usuário"
              value={formulario.usuario}
              onChange={(e) => handleChange(e, "formulario")}
              required
            />
            <input
              type="text"
              name="imagem"
              placeholder="Imagem (URL)"
              value={formulario.imagem}
              onChange={(e) => handleChange(e, "formulario")}
            />

            <button className="cadastrar" type="submit">
              Cadastrar
            </button>
          </form>
        </div>

        {/* FORM ATUALIZAR */}
        <div className="atulizarProduto">
          <h2>Atualizar Produto</h2>
          <form className="form_prod" onSubmit={handleAtualizar}>
            <input
              type="text"
              placeholder="ID do produto"
              value={formularioEdicao.id}
              onChange={(e) => {
                const id = e.target.value;
                setFormularioEdicao({ ...formularioEdicao, id });
                if (id.length === 24) buscarProdutoPorId(id);
              }}
              required
            />
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={formularioEdicao.nome}
              onChange={(e) => handleChange(e, "formularioEdicao")}
              required
            />
            <input
              type="number"
              name="quantidade"
              placeholder="Quantidade"
              value={formularioEdicao.quantidade}
              onChange={(e) => handleChange(e, "formularioEdicao")}
              required
            />
            <input
              type="number"
              step="0.01"
              name="preco"
              placeholder="Preço"
              value={formularioEdicao.preco}
              onChange={(e) => handleChange(e, "formularioEdicao")}
              required
            />
            <select
              name="categoria"
              value={formularioEdicao.categoria}
              onChange={(e) => handleChange(e, "formularioEdicao")}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="descricao"
              placeholder="Descrição"
              value={formularioEdicao.descricao}
              onChange={(e) => handleChange(e, "formularioEdicao")}
            />
            <input
              type="text"
              name="usuario"
              placeholder="Usuário"
              value={formularioEdicao.usuario}
              onChange={(e) => handleChange(e, "formularioEdicao")}
              required
            />
            <input
              type="text"
              name="imagem"
              placeholder="Imagem (URL)"
              value={formularioEdicao.imagem}
              onChange={(e) => handleChange(e, "formularioEdicao")}
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
