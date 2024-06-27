// front/src/App.js

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CadastroCliente from "./components/cadastroCliente";
import CadastroProduto from "./components/cadastroProduto";
import Pedidos from "./components/pedidos";
import logo from "./assets/imagens/logo512.png";
import "./index.css";

const App = () => {
  // Removendo a variável selectBtn porque não está sendo usada diretamente
  const [, setSelectBtn] = useState(""); // Utilizando uma array destructuring para ignorar a primeira posição

  const handleClickTabs = (tab) => {
    setSelectBtn(tab);
  };

  return (
    <div className="App">
      <div className="logo">
        <img className="imageLogo" src={logo} alt="logo" />
        <p className="title">Estoque</p>
      </div>

      <Router>
        <div className="header">
          <Link to="/cadastro-cliente">
            <button className="btn" onClick={() => handleClickTabs("cadastroCliente")}>
              Cadastro cliente
            </button>
          </Link>
          <Link to="/cadastro-produto">
            <button className="btn" onClick={() => handleClickTabs("cadastroProduto")}>
              Cadastro produto
            </button>
          </Link>
          <Link to="/pedidos">
            <button className="btn" onClick={() => handleClickTabs("pedidos")}>
              Pedidos
            </button>
          </Link>
        </div>
        <div className="table-container">
          <Routes>
            <Route path="/cadastro-cliente" element={<CadastroCliente />} />
            <Route path="/cadastro-produto" element={<CadastroProduto />} />
            <Route path="/pedidos" element={<Pedidos />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
