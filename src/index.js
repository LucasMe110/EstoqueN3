const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the CORS package


const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;  



// Conectando ao MongoDB
mongoose.connect("mongodb+srv://eduardosmyk:cesusc@cluster0.es2gxku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
// Definindo os modelos
const Produto = mongoose.model('Produto', {
    nome: String,
    preco: Number,
    categoria: String,
    estoque: Number
});

const Cliente = mongoose.model('Cliente', {
    nome: String,
    email: String,
    telefone: String
});

const Pedido = mongoose.model('Pedido', {
    clienteId: mongoose.Schema.Types.ObjectId,
    produtos: [{
        produtoId: mongoose.Schema.Types.ObjectId,
        nome: String,
        quantidade: Number,
        preco: Number,
        subtotal: Number
    }],
    data: { type: Date, default: Date.now },
    total: Number
});

// Função para tratamento de erros
const handleErrors = (res, error, message) => {
    console.error(`${message}: ${error}`);
    return res.status(500).send({ message: message });
};

// Rotas para o modelo Produto
app.post("/produtos", async (req, res) => {
    try {
        const produto = new Produto({
            nome: req.body.nome,
            preco: req.body.preco,
            categoria: req.body.categoria,
            estoque: req.body.estoque
        });
        await produto.save();
        return res.send(produto);
    } catch (error) {
        return handleErrors(res, error, "Erro ao criar produto");
    }
});

app.get("/produtos", async (req, res) => {
    try {
        const produtos = await Produto.find();
        return res.send(produtos);
    } catch (error) {
        return handleErrors(res, error, "Erro ao ver produtos");
    }
});

app.put("/produtos/:id", async (req, res) => {
    try {
        const produto = await Produto.findByIdAndUpdate(req.params.id, {
            nome: req.body.nome,
            preco: req.body.preco,
            categoria: req.body.categoria,
            estoque: req.body.estoque
        }, { new: true });
        return res.send(produto);
    } catch (error) {
        return handleErrors(res, error, "Erro ao atualizar produto");
    }
});

app.delete("/produtos/:id", async (req, res) => {
    try {
        const produto = await Produto.findByIdAndDelete(req.params.id);
        return res.send(produto);
    } catch (error) {
        return handleErrors(res, error, "Erro ao deletar produto");
    }
});

// Rotas para o modelo Cliente
app.post("/clientes", async (req, res) => {
    try {
        const cliente = new Cliente({
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone
        });
        await cliente.save();
        return res.send(cliente);
    } catch (error) {
        return handleErrors(res, error, "Erro ao adicionar cliente");
    }
});

app.get("/clientes", async (req, res) => {
    try {
        const clientes = await Cliente.find();
        return res.send(clientes);
    } catch (error) {
        return handleErrors(res, error, "Erro ao visualizar clientes");
    }
});

app.put("/clientes/:id", async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndUpdate(req.params.id, {
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone
        }, { new: true });
        return res.send(cliente);
    } catch (error) {
        return handleErrors(res, error, "Erro ao atualizar cliente");
    }
});

app.delete("/clientes/:id", async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndDelete(req.params.id);
        return res.send(cliente);
    } catch (error) {
        return handleErrors(res, error, "Erro ao deletar cliente");
    }
});

// Rotas para o modelo Pedido
app.post("/pedidos", async (req, res) => {
    try {
        // Busque o cliente pelo ID
        const cliente = await Cliente.findById(req.body.clienteId);
        if (!cliente) {
            return res.status(404).send({ message: "Cliente não encontrado" });
        }

        // Array para armazenar detalhes dos produtos
        let produtosDetalhes = [];
        let total = 0;

        // Itere sobre cada produto no pedido
        for (const item of req.body.produtos) {
            // Busque o produto pelo ID
            const produto = await Produto.findById(item.produtoId);
            if (!produto) {
                return res.status(404).send({ message: `Produto com ID ${item.produtoId} não encontrado` });
            }

            // Calcule o subtotal para o produto
            const subtotal = produto.preco * item.quantidade;
            total += subtotal;

            // Adicione os detalhes do produto ao array
            produtosDetalhes.push({
                produtoId: item.produtoId,
                nome: produto.nome,
                quantidade: item.quantidade,
                preco: produto.preco,
                subtotal: subtotal
            });
        }

        // Crie o novo pedido
        const pedido = new Pedido({
            clienteId: req.body.clienteId,
            produtos: produtosDetalhes,
            data: req.body.data,
            total: total
        });

        await pedido.save();

        return res.send({
            pedido: pedido,
            clienteNome: cliente.nome,
            produtos: produtosDetalhes
        });
    } catch (error) {
        return handleErrors(res, error, "Erro ao criar pedido");
    }
});

app.get("/pedidos", async (req, res) => {
    try {
        const pedidos = await Pedido.find();
        return res.send(pedidos);
    } catch (error) {
        return handleErrors(res, error, "Erro ao visualizar pedidos");
    }
});

app.put("/pedidos/:id", async (req, res) => {
    try {
        // Busque o pedido pelo ID
        let pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).send({ message: "Pedido não encontrado" });
        }

        // Array para armazenar detalhes dos produtos
        let produtosDetalhes = [];
        let total = 0;

        // Itere sobre cada produto no pedido
        for (const item of req.body.produtos) {
            // Busque o produto pelo ID
            const produto = await Produto.findById(item.produtoId);
            if (!produto) {
                return res.status(404).send({ message: `Produto com ID ${item.produtoId} não encontrado` });
            }

            // Calcule o subtotal para o produto
            const subtotal = produto.preco * item.quantidade;
            total += subtotal;

            // Adicione os detalhes do produto ao array
            produtosDetalhes.push({
                produtoId: item.produtoId,
                nome: produto.nome,
                quantidade: item.quantidade,
                preco: produto.preco,
                subtotal: subtotal
            });
        }

        // Atualize os detalhes do pedido
        pedido.clienteId = req.body.clienteId;
        pedido.produtos = produtosDetalhes;
        pedido.data = req.body.data;
        pedido.total = total;

        // Salve o pedido atualizado
        await pedido.save();

        // Busque o cliente pelo ID
        const cliente = await Cliente.findById(req.body.clienteId);
        if (!cliente) {
            return res.status(404).send({ message: "Cliente não encontrado" });
        }

        return res.send({
            pedido: pedido,
            clienteNome: cliente.nome,
            produtos: produtosDetalhes
        });
    } catch (error) {
        return handleErrors(res, error, "Erro ao atualizar pedido");
    }
});

app.delete("/pedidos/:id", async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndDelete(req.params.id);
        return res.send(pedido);
    } catch (error) {
        return handleErrors(res, error, "Erro ao deletar pedido");
    }
});

// Exportar app para testes
module.exports = app;

// Iniciar o servidor se o script for executado diretamente
if (require.main === module) {
    app.listen(port, () => {
        console.log(`App running on port ${port}`);
    });
}
