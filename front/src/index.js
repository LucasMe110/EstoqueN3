// front/src/page.js

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
