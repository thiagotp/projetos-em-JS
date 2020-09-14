/*const http = require('http');
const { read } = require('fs');

let server = http.createServer((req, res) => {

    console.log("URL: ", req.url);
    console.log("Method: ", req.method);

    switch (req.url) {
        case '/':
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end('Servido esta rodando');
            break;
        case '/users':
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                users: [{
                    name: "Thiago",
                    Email: "thiagoteixeira.ps@gmail.com",
                    id: 1
                }]
            }))
    }
}); Aqui nós fazemos a criação do nosso server onde fazmos requerimentos e esperamos respotas.
No switch estamos setando algumas informações de acordo com o caminho da URL.

Isso tudo feito sem express.
*/

//O express serve para fazer a comunicação http
const express = require('express');
//O consign me ajuda a fazer comunicação entre meus diretórios
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
let app = express();

app.use(bodyParser.urlencoded({ extended : false}))
app.use(bodyParser.json());
app.use(expressValidator());

consign().include('routes').include('utils').into(app);

app.listen(3000, '127.0.0.1', () => {
    console.log("Tudo ok !");
})