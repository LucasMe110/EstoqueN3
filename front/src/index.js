// front/src/page.js

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'front/build')));

// Rota padrão para servir o aplicativo React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'front/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./App";

const html = ReactDOMServer.renderToString(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log(html); // Apenas para teste, você pode modificar para enviar o HTML ao cliente ou outra finalidade

// Se precisar de um servidor HTTP para servir o conteúdo, pode utilizar algo como o exemplo abaixo:
/*
import http from "http";

http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
}).listen(8080);
*/
