/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contracts'
var faker = require('faker');


describe('Testes da Funcionalidade Usuários', () => {

    it('Deve validar contrato de usuários', () => {
        cy.request('usuarios').then(response => {
            return contrato.validateAsync(response.body)
          })
    });

    it('Deve listar usuários cadastrados', () => {
        cy.request({
            method: 'GET',
            url: 'usuarios',

        }).then((response) => {
            expect(response.status).to.equal(200)
        })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
        let usuario = `Usuario EBAC ${Math.floor(Math.random() * 1000000)}`
        cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "nome": usuario,
                "email": faker.internet.email(),
                "password": "teste#$%",
                "administrador": "true"
            }
        }).then((response) => {
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            expect(response.status).to.equal(201)
        });

    });

    it('Deve validar um usuário com email inválido', () => {
        cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "nome": "Bernardo Gomes",
                "email": "beltrano@qa.com.br",
                "password": "xxxx",
                "administrador": "true"                
            }, failOnStatusCode: false

        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Este email já está sendo usado')
        });
    });

    it('Deve editar um usuário previamente cadastrado', () => {
        cy.request('usuarios').then(response => {
            let id = response.body.usuarios[0]._id
            cy.request({
                method: 'PUT',
                url: `usuarios/${id}`,
                body: {
                    "nome": "Fulano da Silva Gomes",
                    "email": "fulano@qa.com.br",
                    "password": "@@@!!!F",
                    "administrador": "true"
                }

            }).then((response) => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
                expect(response.status).to.equal(200)
            });
        })

    });
    it('Deve deletar um usuário previamente cadastrado', () => {
        cy.request('usuarios').then(response => {
            let id = response.body.usuarios[0]._id
            cy.request({
                method: 'DELETE',
                url: `usuarios/${id}`,
                body: {
                    "nome": "Fulano da Silva Gomes",
                    "email": "fulano@qa.com.br",
                    "password": "@@@!!!F",
                    "administrador": "true"
                }

            }).then((response) => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            });
        })
    });

});
