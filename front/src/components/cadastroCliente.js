import "./cadastroCliente.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../index.css";



const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  useEffect(() => {
      fetchClientes();
  }, []);

  const fetchClientes = async () => {
      try {
          const response = await axios.get('http://localhost:3000/clientes');
          setClientes(response.data);
      } catch (error) {
          console.error('Erro ao buscar clientes', error);
      }
  };

  const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          if (editando) {
              await axios.put(`http://localhost:3000/clientes/${idEditando}`, form);
          } else {
              await axios.post('http://localhost:3000/clientes', form);
          }
          fetchClientes();
          setForm({ nome: '', email: '', telefone: '' });
          setEditando(false);
          setIdEditando(null);
      } catch (error) {
          console.error('Erro ao salvar cliente', error);
      }
  };

  const handleEdit = (cliente) => {
      setForm(cliente);
      setEditando(true);
      setIdEditando(cliente._id);
  };

  const handleDelete = async (id) => {
      try {
          await axios.delete(`http://localhost:3000/clientes/${id}`);
          fetchClientes();
      } catch (error) {
          console.error('Erro ao deletar cliente', error);
      }
  };

  return (
    <div className="cliente-list">
    <h1>Clientes</h1>
    <form onSubmit={handleSubmit} className="cliente-form">
      <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} />
      <button className="btn" type="submit">{editando ? 'Atualizar' : 'Adicionar'}</button>
    </form>
    <table className="cliente-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Telefone</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente) => (
          <tr key={cliente._id}>
            <td>{cliente.nome}</td>
            <td>{cliente.email}</td>
            <td>{cliente.telefone}</td>
            <td>
              <div className="cliente-buttons">
                <button className="btn" onClick={() => handleEdit(cliente)}>Editar</button>
                <button className="btn" onClick={() => handleDelete(cliente._id)}>Deletar</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default ClienteList;
