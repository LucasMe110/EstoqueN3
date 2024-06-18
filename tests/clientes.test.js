const request = require('supertest');
const app = require('../src/index');  // ajuste o caminho conforme necessário

describe('Endpoints de Clientes', () => {
    let server;

    beforeAll((done) => {
        server = app.listen(3001, done); // usa uma porta diferente para evitar conflitos
    });

    afterAll((done) => {
        server.close(done);
    });

    it('Deve criar um novo cliente', async () => {
        const res = await request(server)
            .post('/clientes')
            .send({
                nome: 'Cliente de Teste',
                email: 'teste@cliente.com',
                telefone: '123456789'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.nome).toBe('Cliente de Teste');
    });

    it('Deve retornar todos os clientes', async () => {
        const res = await request(server).get('/clientes');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('Deve atualizar um cliente existente', async () => {
        const novoCliente = await request(server)
            .post('/clientes')
            .send({
                nome: 'Cliente Atualizar',
                email: 'atualizar@cliente.com',
                telefone: '987654321'
            });

        const res = await request(server)
            .put(`/clientes/${novoCliente.body._id}`)
            .send({
                nome: 'Cliente Atualizado',
                email: 'atualizado@cliente.com',
                telefone: '1122334455'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.nome).toBe('Cliente Atualizado');
    });

    it('Deve deletar um cliente existente', async () => {
        const novoCliente = await request(server)
            .post('/clientes')
            .send({
                nome: 'Cliente Deletar',
                email: 'deletar@cliente.com',
                telefone: '9988776655'
            });

        const res = await request(server)
            .delete(`/clientes/${novoCliente.body._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(novoCliente.body._id);
    });
});
