import "../index.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./pedidos.css";


const PedidoList = () => {
    const [pedidos, setPedidos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [form, setForm] = useState({ clienteId: '', produtos: [], data: '', total: 0 });
    const [produtosForm, setProdutosForm] = useState({ produtoId: '', quantidade: 1 });
    const [editando, setEditando] = useState(false);
    const [idEditando, setIdEditando] = useState(null);

    useEffect(() => {
        fetchPedidos();
        fetchClientes();
        fetchProdutos();
    }, []);

    const fetchPedidos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/pedidos');
            setPedidos(response.data);
        } catch (error) {
            console.error('Erro ao buscar pedidos', error);
        }
    };

    const fetchClientes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error('Erro ao buscar clientes', error);
        }
    };

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

    const handleProdutoChange = (e) => {
        setProdutosForm({ ...produtosForm, [e.target.name]: e.target.value });
    };

    const handleAddProduto = () => {
        const produto = produtos.find(p => p._id === produtosForm.produtoId);
        if (produto) {
            const subtotal = produto.preco * produtosForm.quantidade;
            setForm({
                ...form,
                produtos: [...form.produtos, { ...produtosForm, nome: produto.nome, preco: produto.preco, subtotal }],
                total: form.total + subtotal
            });
            setProdutosForm({ produtoId: '', quantidade: 1 });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await axios.put(`http://localhost:3000/pedidos/${idEditando}`, form);
            } else {
                await axios.post('http://localhost:3000/pedidos', form);
            }
            fetchPedidos();
            setForm({ clienteId: '', produtos: [], data: '', total: 0 });
            setEditando(false);
            setIdEditando(null);
        } catch (error) {
            console.error('Erro ao salvar pedido', error);
        }
    };

    const handleEdit = (pedido) => {
        setForm(pedido);
        setEditando(true);
        setIdEditando(pedido._id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/pedidos/${id}`);
            fetchPedidos();
        } catch (error) {
            console.error('Erro ao deletar pedido', error);
        }
    };

    return (
        <div className="pedido-list">
            <h1>Pedidos</h1>
            <form onSubmit={handleSubmit} className="pedido-form">
                <select name="clienteId" value={form.clienteId} onChange={handleChange}>
                    <option value="">Selecione um Cliente</option>
                    {clientes.map((cliente) => (
                        <option key={cliente._id} value={cliente._id}>{cliente.nome}</option>
                    ))}
                </select>
                <input name="data" placeholder="Data" value={form.data} onChange={handleChange} />
                <div className="produto-selection">
                    <select name="produtoId" value={produtosForm.produtoId} onChange={handleProdutoChange}>
                        <option value="">Selecione um Produto</option>
                        {produtos.map((produto) => (
                            <option key={produto._id} value={produto._id}>{produto.nome}</option>
                        ))}
                    </select>
                    <input name="quantidade" type="number" min="1" value={produtosForm.quantidade} onChange={handleProdutoChange} />
                    <button className="btn" type="button" onClick={handleAddProduto}>Adicionar Produto</button>
                </div>
                <ul className="pedido-produtos-list">
                    {form.produtos.map((produto, index) => (
                        <li key={index} className="pedido-produto-item">
                            {produto.nome} - {produto.quantidade} - {produto.preco} - {produto.subtotal}
                        </li>
                    ))}
                </ul>
                <button className="btn" type="submit">{editando ? 'Atualizar Pedido' : 'Finalizar Pedido'}</button>
            </form>
            <ul className="pedido-list-items">
                {pedidos.map((pedido) => (
                    <li key={pedido._id} className="pedido-item">
                        <span className="span">Cliente: {pedido.clienteId} - Total: {pedido.total}</span>
                        <div className="pedidos-buttons">
                            <button className="btn" onClick={() => handleEdit(pedido)}>Editar</button>
                            <button className="btn" onClick={() => handleDelete(pedido._id)}>Deletar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PedidoList;

