/*let express = require('express')
let routes = express.Router();

routes.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
        users: [{
            name: "Thiago",
            Email: "thiagoteixeira.ps@gmail.com",
            id: 1
        }, {
            name: "CLDATA",
            Email: "cldata.ps@gmail.com",
            id: 2
        }]
    })
})

module.exports = routes;
*/
let NeDB = require('nedb')
let db = new NeDB({
    filename: 'users.db',
    autoload: true
});//Criando o bando de dados 

module.exports = (app) => {

    let route = app.route('/users');

    route.get((req, res) => {

        db.find({}).sort({ name: 1 }).exec((err, users) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    users
                })
            }
        })

    })//Método para listar todos os usuários do sistema

    route.post((req, res) => {

        if (!app.utils.validator.user(app, req, res)) return false;

        db.insert(req.body, (err, user) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(user)
            }
        })
    })//Método para inserir um usuário no banco de dados

    let routeId = app.route('/users/:id');

    routeId.get((req, res) => {
        db.findOne({ _id: req.params.id }).exec((err, user) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(user)
            }
        })
    })//Método para retornar um usuário especificado pelo seu Id

    routeId.put((req, res) => {
        
        if (!app.utils.validator.user(app, req, res)) return false;

        db.update({ _id: req.params.id }, req.body, err => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(Object.assign(req.params, req.body))
            }
        })
    })//Método para realizar o update em determinado usuário de acordo com o Id pesquisado

    routeId.delete((req, res) => {
        db.remove({ _id: req.params.id }, {}, err => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(req.params)
            }
        })
    })//Método para excluir um determinado usuário de acordo com o Id pesquisado
}