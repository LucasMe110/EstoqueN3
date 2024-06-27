import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./cadastroProduto.css"
import "../index.css"

const ProdutoList = () => {
    const [produtos, setProdutos] = useState([]);
    const [form, setForm] = useState({ nome: '', preco: '', categoria: '', estoque: '' });
    const [editando, setEditando] = useState(false);
    const [idEditando, setIdEditando] = useState(null);

    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/produtos');
            setProdutos(response.data);
        } catch (error) {
            console.error('Erro ao buscar produtos', error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await axios.put(`http://localhost:3000/produtos/${idEditando}`, form);
            } else {
                await axios.post('http://localhost:3000/produtos', form);
            }
            fetchProdutos();
            setForm({ nome: '', preco: '', categoria: '', estoque: '' });
            setEditando(false);
            setIdEditando(null);
        } catch (error) {
            console.error('Erro ao salvar produto', error);
        }
    };

    const handleEdit = (produto) => {
        setForm(produto);
        setEditando(true);
        setIdEditando(produto._id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/produtos/${id}`);
            fetchProdutos();
        } catch (error) {
            console.error('Erro ao deletar produto', error);
        }
    };

    return (
        <div className="produto-list">
            <h1>Produtos</h1>
            <form onSubmit={handleSubmit} className="produto-form">
                <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
                <input name="preco" placeholder="Preço" value={form.preco} onChange={handleChange} type="number" />
                <input name="categoria" placeholder="Categoria" value={form.categoria} onChange={handleChange} />
                <input name="estoque" placeholder="Estoque" value={form.estoque} onChange={handleChange} />
                <button className='btn' type="submit">{editando ? 'Atualizar' : 'Adicionar'}</button>
            </form>
    <table className="cliente-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Preço</th>
          <th>Categoria</th>
          <th>Estoque</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {produtos.map((produto) => (
          <tr key={produto._id}>
            <td>{produto.nome}</td>
            <td>{produto.preco}</td>
            <td>{produto.categoria}</td>
            <td>{produto.estoque}</td>
            <td>
              <div className="cliente-buttons">
                <button className="btn" onClick={() => handleEdit(produto)}>Editar</button>
                <button className="btn" onClick={() => handleDelete(produto._id)}>Deletar</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
        </div>
    );
};

export default ProdutoList;