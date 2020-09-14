/*let express = require('express')
let routes = express.Router();
Primeiro declaro a rota e depois a requisição e resposta
O express.Router é uma forma de usar os recursos disponiveis no express para trabalhar com rotas
routes.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('Servidor esta rodando');
});

O module.exports me permite obter um return de tudo que acontece com a variável routes
para a página em que foi chamada
module.exports = routes;*/


module.exports = (app) => {
    app.get('/', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('Servidor esta rodando');
    });

}