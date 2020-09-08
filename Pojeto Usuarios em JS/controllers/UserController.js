
class UserController {
    constructor(formId, tableId) {
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onEdit();
        this.onSubmit();
    }

    onEdit() {
        document.querySelector("#box-user-update .btn-cancel").addEventListener('click', e => {
            this.showPainelCreate();
        });
    }

    //Implantando o event submit
    onSubmit() {
        this.formEl.addEventListener("submit", event => {
            event.preventDefault();
            let btn = this.formEl.querySelectorAll('[type=submit');
            btn.disabled = true;
            let values = this.getValues();
            if (!values) {
                return false;
            }
            this.getPhoto().then((content) => {
                values._photo = content
                this.addLine(values);
                this.formEl.reset();
                btn.disabled = false;
            }, (e) => {
                console.error(e);
            });

        });
    }//Método que inicia o Listener do formulário 

    getPhoto() {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            let elements = [...this.formEl.elements].filter(item => {
                if (item.name === "photo") {
                    return item;
                }
            });
            let file = elements[0].files[0]
            fileReader.onload = () => {
                resolve(fileReader.result)
            };

            fileReader.onerror = (e) => {
                reject(e)
            }
            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }
        });

    }//Método que carrega a photo escolhida pelo usuário

    //Obtendo o JSON do formulário 
    getValues() {
        let user = {};
        let isValid = true;

        [...this.formEl.elements].forEach((field, index) => {
            if (['name', 'email', 'password', 'birth'].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add('has-error');
                isValid = false;
            }
            if (field.name === "gender") {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else if (field.name === "admin") {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        });

        if (!isValid) {
            return false;
        }
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );

    }//Método que preenche um JSON com os valores do formulário e retorna para o Objeto usuário

    addLine(dataUser) {
        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
        <td><img src="${dataUser._photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${dataUser._name}</td>
        <td>${dataUser._email}</td>
        <td>${dataUser._admin ? 'Sim' : 'Não'}</td>
        <td>${Utils.dateFormat(dataUser._register)}</td>
        <td>
            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>`

        tr.querySelector(".btn-edit").addEventListener("click", event => {
            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector("#form-user-update");
            for (let name in json) {
                let field = form.querySelector("[name = " + name.replace("_", "") + "]");
                if (field) {
                    console.log(field)
                    switch (field.type) {
                        case "file":
                            continue;
                            break;
                        case "radio":
                            field = form.querySelector("[name = " + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                            break;
                        case "checkbox":
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }
                    //  field.value = json[name];
                }
            }

            this.showPainelUpdate();
        });

        this.tableEl.appendChild(tr);

        this.updateCount();
    }//Método que atualiza a lista dos usuários

    updateCount() {
        let numberUsers = 0;
        let numberAdmin = 0;
        [...this.tableEl.children].forEach(tr => {
            let user = JSON.parse(tr.dataset.user);
            (user._admin) ? numberAdmin++ : numberUsers++;
        });
        document.getElementById("new-users").innerHTML = numberUsers
        document.getElementById("new-admins").innerHTML = numberAdmin
    }//Método que atualizada na tela a quantidade de usuários do sistema

    showPainelCreate() {
        document.querySelector('#box-user-create').style.display = "block"
        document.querySelector('#box-user-update').style.display = "none"
    }
    showPainelUpdate() {
        document.querySelector('#box-user-create').style.display = "none"
        document.querySelector('#box-user-update').style.display = "block"
    }
} 