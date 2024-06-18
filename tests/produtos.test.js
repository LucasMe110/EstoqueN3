const request = require('supertest');
const app = require('../src/index');  // ajuste o caminho conforme necessário

describe('Endpoints de Produtos', () => {
    let server;

    beforeAll((done) => {
        server = app.listen(3001, done); // usa uma porta diferente para evitar conflitos
    });

    afterAll((done) => {
        server.close(done);
    });

    it('Deve criar um novo produto', async () => {
        const res = await request(server)
            .post('/produtos')
            .send({
                nome: 'Produto de Teste',
                preco: 10.0,
                categoria: 'Categoria de Teste',
                estoque: 100
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.nome).toBe('Produto de Teste');
    });

    it('Deve retornar todos os produtos', async () => {
        const res = await request(server).get('/produtos');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('Deve atualizar um produto existente', async () => {
        const novoProduto = await request(server)
            .post('/produtos')
            .send({
                nome: 'Produto Atualizar',
                preco: 20.0,
                categoria: 'Categoria Atualizar',
                estoque: 50
            });

        const res = await request(server)
            .put(`/produtos/${novoProduto.body._id}`)
            .send({
                nome: 'Produto Atualizado',
                preco: 25.0,
                categoria: 'Categoria Atualizada',
                estoque: 60
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.nome).toBe('Produto Atualizado');
    });

    it('Deve deletar um produto existente', async () => {
        const novoProduto = await request(server)
            .post('/produtos')
            .send({
                nome: 'Produto Deletar',
                preco: 15.0,
                categoria: 'Categoria Deletar',
                estoque: 70
            });

        const res = await request(server)
            .delete(`/produtos/${novoProduto.body._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(novoProduto.body._id);
    });
});
