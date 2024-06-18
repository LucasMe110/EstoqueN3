const request = require('supertest');
const app = require('../src/index');  // ajuste o caminho conforme necessário

describe('Endpoints de Pedidos', () => {
    let server;

    beforeAll((done) => {
        server = app.listen(3001, done); // usa uma porta diferente para evitar conflitos
    });

    afterAll((done) => {
        server.close(done);
    });

    it('Deve criar um novo pedido', async () => {
        const novoCliente = await request(server)
            .post('/clientes')
            .send({
                nome: 'Cliente Pedido',
                email: 'pedido@cliente.com',
                telefone: '123123123'
            });

        const novoProduto = await request(server)
            .post('/produtos')
            .send({
                nome: 'Produto Pedido',
                preco: 30.0,
                categoria: 'Categoria Pedido',
                estoque: 100
            });

        const res = await request(server)
            .post('/pedidos')
            .send({
                clienteId: novoCliente.body._id,
                produtos: [
                    {
                        produtoId: novoProduto.body._id,
                        quantidade: 2
                    }
                ]
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.pedido.clienteId).toBe(novoCliente.body._id);
    });

    it('Deve retornar todos os pedidos', async () => {
        const res = await request(server).get('/pedidos');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('Deve atualizar um pedido existente', async () => {
        const novoCliente = await request(server)
            .post('/clientes')
            .send({
                nome: 'Cliente Pedido Update',
                email: 'update@pedido.com',
                telefone: '456456456'
            });

        const novoProduto = await request(server)
            .post('/produtos')
            .send({
                nome: 'Produto Pedido Update',
                preco: 40.0,
                categoria: 'Categoria Pedido Update',
                estoque: 200
            });

        const novoPedido = await request(server)
            .post('/pedidos')
            .send({
                clienteId: novoCliente.body._id,
                produtos: [
                    {
                        produtoId: novoProduto.body._id,
                        quantidade: 1
                    }
                ]
            });

        const res = await request(server)
            .put(`/pedidos/${novoPedido.body.pedido._id}`)
            .send({
                clienteId: novoCliente.body._id,
                produtos: [
                    {
                        produtoId: novoProduto.body._id,
                        quantidade: 3
                    }
                ]
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.pedido.produtos[0].quantidade).toBe(3);
    });

    it('Deve deletar um pedido existente', async () => {
        const novoCliente = await request(server)
            .post('/clientes')
            .send({
                nome: 'Cliente Pedido Delete',
                email: 'delete@pedido.com',
                telefone: '789789789'
            });

        const novoProduto = await request(server)
            .post('/produtos')
            .send({
                nome: 'Produto Pedido Delete',
                preco: 50.0,
                categoria: 'Categoria Pedido Delete',
                estoque: 300
            });

        const novoPedido = await request(server)
            .post('/pedidos')
            .send({
                clienteId: novoCliente.body._id,
                produtos: [
                    {
                        produtoId: novoProduto.body._id,
                        quantidade: 1
                    }
                ]
            });

        const res = await request(server)
            .delete(`/pedidos/${novoPedido.body.pedido._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(novoPedido.body.pedido._id);
    });
});
