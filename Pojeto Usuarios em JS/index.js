var name = document.querySelector("#exampleInputName");
var gender = document.querySelectorAll("#form-user-create [name=gender]:checked");
var birth = document.querySelector("#exampleInputBirth");
var country = document.querySelector("#exampleInputCountry");
var email = document.querySelector("#exampleInputEmail");
var password = document.querySelector("#exampleInputPassword");
var photo = document.querySelector("#exampleInputFile");
var admin = document.querySelector("#exampleInputAdmin");


//Pegando tudo que tem dentro do formulário
var fields = document.querySelectorAll("#form-user-create [name]");
var user = {};



/**aplicando evento em todos os butões usando arrow function
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

function addLine(dataUser) {
    document.getElementById("table-user").innerHTML = `
  <tr>
    <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
      <td>${dataUser.name}</td>
      <td>${dataUser.email}</td>
      <td>${dataUser.admin}</td>
      <td>${dataUser.birth}</td>
    <td>
      <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
    </td>
  </tr>`
}

document.querySelector("#form-user-create").addEventListener("submit", event => {
    event.preventDefault();
    fields.forEach((field, index) => {
        if (field.name === "gender") {
            if (field.checked) {
                user[field.name] = field.value;
            }
        } else {
            user[field.name] = field.value;
        }
    });
    var objectUser = new User(
        user.name,
        user.gender,
        user.birth,
        user.country,
        user.email,
        user.password,
        user.photo,
        user.admin
    );
    addLine(objectUser);

});
