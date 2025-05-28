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

  // Você precisa extrair o usuário do token (JWT) para passar na URL
  // Vou fazer uma função simples para isso:
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

  // Para listar produtos, passar nomeProduto como string vazia para listar todos
  const listarProdutos = async (nomeProduto = "") => {
    if (!usuario) {
      console.error("Usuário não encontrado no token.");
      return;
    }
    const url = `https://backend-completo.vercel.app/app/produtos/${usuario}/${nomeProduto}`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        setProdutos(response.data);
      } else {
        setProdutos([]);
        console.error("Resposta inválida: não é um array");
      }
    } catch (erro) {
      console.log("Erro ao buscar produtos:", erro);
    }
  };

  const carregarCategorias = () => {
    axios
      .get("https://backend-completo.vercel.app/app/categorias", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategorias(res.data.categorias || res.data))
      .catch((err) => console.log("Erro ao carregar categorias:", err));
  };

  useEffect(() => {
    listarProdutos(); // lista todos os produtos do usuário
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!usuario) {
      alert("Usuário não encontrado para cadastrar produto.");
      return;
    }

    // adiciona o usuário ao formulário antes de enviar
    const novoProduto = { ...formulario, usuario };

    axios
      .post("https://backend-completo.vercel.app/app/produtos", novoProduto, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
        listarProdutos();
      })
      .catch((erro) => console.log("Erro ao criar produto:", erro));
  };

  const prodDelete = (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) return;

    axios
      .delete("https://backend-completo.vercel.app/app/produtos", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id },
      })
      .then(() => {
        alert("Produto deletado com sucesso!");
        listarProdutos();
      })
      .catch((erro) => console.log("Erro ao deletar produto:", erro));
  };

  // Buscar produto por id para edição (usa endpoint geral e filtra)
  const buscarProdutoPorId = async (id) => {
    try {
      const url = `https://backend-completo.vercel.app/app/produtos/${usuario}/`;
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

  const handleAtualizar = (e) => {
    e.preventDefault();

    if (!formularioEdicao.id) {
      alert("ID do produto não informado.");
      return;
    }

    axios
      .put(
        "https://backend-completo.vercel.app/app/produtos",
        formularioEdicao,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
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
        listarProdutos();
      })
      .catch((erro) => console.log("Erro ao atualizar produto:", erro));
  };

  return (
    <div className="containerProd">
      <h1>Produtos</h1>

      <ul className="prod">
        {produtos.map((produto) => (
          <li key={produto._id}>
            <p>ID: {produto._id}</p>
            <img src={produto.imagem} alt={produto.nome} width="100" />
            <h3>{produto.nome}</h3>
            <p>Categoria: {produto.categoria}</p>
            <p>Preço: R$ {produto.preco}</p>
            <p>Quantidade: {produto.quantidade}</p>
            <p>{produto.descricao}</p>
            <p>Usuário: {produto.usuario}</p>
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
              value={usuario}
              readOnly
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
