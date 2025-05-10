import React, { useState, useEffect } from "react";
import "../css/categoria.css";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [categoriaId, setCategoriaId] = useState(""); // Para armazenar o id da categoria a ser atualizada

  const token = localStorage.getItem("ALUNO_ITE");
  const url = "https://backend-completo.vercel.app/app/categorias";

  const listaCategoria = async () => {
    try {
      const resposta = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dados = await resposta.json();
      setCategorias(dados);
    } catch (erro) {
      console.error("Erro ao buscar categorias:", erro);
    }
  };

  const criarCategoria = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome_categoria: novaCategoria,
        }),
      });

      if (resposta.ok) {
        const categoriaCriada = await resposta.json();
        setCategorias([...categorias, categoriaCriada]);
        setNovaCategoria(""); // limpa o campo
      } else {
        console.error("Erro ao criar categoria");
      }
    } catch (erro) {
      console.error("Erro na requisição:", erro);
    }
  };

  const excluirCategoria = async (id) => {
    try {
      const resposta = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: id, // Passando o id no corpo da requisição
        }),
      });

      if (resposta.ok) {
        const respostaJson = await resposta.json();
        console.log(respostaJson.message); // Mensagem do servidor
        setCategorias(categorias.filter((categoria) => categoria._id !== id));
      } else {
        console.error("Erro ao excluir categoria");
      }
    } catch (erro) {
      console.error("Erro na requisição de exclusão:", erro);
    }
  };

  const carregarCategoriaParaAtualizar = (id) => {
    const categoria = categorias.find((cat) => cat._id === id);
    if (categoria) {
      setCategoriaId(categoria._id);
      setNovaCategoria(categoria.nome); // Preenche o campo com o nome da categoria
    }
  };

  const atualizarCategoria = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch(url, {
        method: "PUT", // Método PUT para atualização
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: categoriaId,
          nome_categoria: novaCategoria,
        }),
      });

      if (resposta.ok) {
        const categoriaAtualizada = await resposta.json();
        setCategorias(
          categorias.map((categoria) =>
            categoria._id === categoriaId ? categoriaAtualizada : categoria
          )
        );
        setNovaCategoria(""); // Limpa o campo
        setCategoriaId(""); // Limpa o campo de ID
      } else {
        console.error("Erro ao atualizar categoria");
      }
    } catch (erro) {
      console.error("Erro na requisição de atualização:", erro);
    }
  };

  useEffect(() => {
    listaCategoria();
  }, []);

  return (
    <div>
      <h1>Categorias</h1>

      <form onSubmit={criarCategoria}>
        <input
          type="text"
          placeholder="Nova categoria"
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          required
        />
        <button type="submit">Criar</button>
      </form>

      <ul>
        {categorias.map((categoria) => (
          <li key={categoria._id}>
            {categoria.nome}
            <button onClick={() => excluirCategoria(categoria._id)}>
              Excluir
            </button>
            <button
              onClick={() => carregarCategoriaParaAtualizar(categoria._id)}
            >
              Atualizar
            </button>
          </li>
        ))}
      </ul>

      {/* Formulário para atualizar a categoria */}
      {categoriaId && (
        <form onSubmit={atualizarCategoria}>
          <h2>Atualizar Categoria</h2>
          <input
            type="text"
            placeholder="Nome da categoria"
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
            required
          />
          <button className="bt_atulizar" type="submit">
            Atualizar
          </button>
        </form>
      )}
    </div>
  );
};

export default Categorias;
