/*Pegando tudo que tem dentro do formulário
var fields = document.querySelectorAll("#form-user-create [name]");
var user = {};


aplicando evento em todos os butões usando arrow function
document.querySelectorAll('button').forEach((btn, index) => {
    btn.addEventListener('click', e => {
        alert('clicou');
    });
});


aplicando evento em todos os butões usando function
document.querySelectorAll('button').forEach(function(){
    this.addEventListener('click', function(){
        alert('clicou');
    });
});

incluindo evento com getElementById
document.getElementById('form-user-create').addEventListener("submit", function(){
    alert("Im here");
});
*/


let userController = new UserController("form-user-create", "form-user-update", "table-users");



