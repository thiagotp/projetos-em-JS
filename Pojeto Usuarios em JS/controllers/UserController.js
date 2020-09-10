
class UserController {
    constructor(formIdCreate, formIdUpdate, tableId) {
        this.formCreateEl = document.getElementById(formIdCreate);
        this.formUp = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onEdit();
        this.onSubmit();
        this.selectAll();
    }

    onEdit() {
        document.querySelector("#box-user-update .btn-cancel").addEventListener('click', e => {
            this.showPainelCreate();
        });

        this.formUp.addEventListener("submit", e => {
            e.preventDefault();
            let btn = this.formUp.querySelector("[type=submit]");
            btn.disabled = true;
            let values = this.getValues(this.formUp);
            let index = this.formUp.dataset.trIndex;
            let tr = this.tableEl.rows[index];
            let userOld = JSON.parse(tr.dataset.user);
            let result = Object.assign({}, userOld, values);
            console.log(tr.dataset.user)
            console.log(this.getValues(this.formUp))
            console.log(values._photo);

            this.getPhoto(this.formUp).then((content) => {
                if (!values.photo) {
                    result._photo = userOld._photo;
                } else {
                    result._photo = content;
                }
                let user = new User();
                user.loadFromJSON(result);
                user.save();
                this.getTr(result, tr);
                this.updateCount();
                this.formUp.reset();
                btn.disabled = false;
                this.showPainelCreate();
            }, (e) => {
                console.error(e);
            });

        });

    }//Método para atualizar os dados do usuário na página edit

    //Implantando o event submit
    onSubmit() {
        this.formCreateEl.addEventListener("submit", event => {
            event.preventDefault();
            let btn = this.formCreateEl.querySelectorAll('[type=submit');
            btn.disabled = true;
            let values = this.getValues(this.formCreateEl);
            if (!values) {
                return false;
            }
            this.getPhoto(this.formCreateEl).then((content) => {
                values._photo = content
                values.save();
                this.addLine(values);
                this.formCreateEl.reset();
                btn.disabled = false;
            }, (e) => {
                console.error(e);
            });

        });
    }//Método que inicia o Listener do formulário 

    getPhoto(form) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            let elements = [...form.elements].filter(item => {
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
    getValues(formEl) {
        let user = {};
        let isValid = true;

        [...formEl.elements].forEach((field, index) => {
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


    selectAll() {
        let users = User.getUserStorage();
        users.forEach(dataUser => {
            let user = new User();
            user.loadFromJSON(dataUser);
            this.addLine(user);
        });
        this.updateCount();
    }//Método para selecionar todos os usuários armazenados na sessionStorage

    insertSession(data) {
        let users = this.getUserStorage();
        users.push(data);
        //sessionStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("users", JSON.stringify(users));
    }//Método para adicionar usuários no sessionStorage e localStorage

    addLine(dataUser) {
        let tr = this.getTr(dataUser);

        tr.dataset.user = JSON.stringify(dataUser);

        this.tableEl.appendChild(tr);

        this.updateCount();
    }//Método que atualiza a lista dos usuários adicionando nova linha na tabela

    getTr(dataUser, tr = null) {
        if (tr === null) tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
        <td><img src="${dataUser._photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${dataUser._name}</td>
        <td>${dataUser._email}</td>
        <td>${dataUser._admin ? 'Sim' : 'Não'}</td>
        <td>${Utils.dateFormat(dataUser._register)}</td>
        <td>
            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
        </td>`

        this.addEventsTr(tr);
        return tr;

    }//Cria uma tr nova para a tabela

    addEventsTr(tr) {
        tr.querySelector('.btn-delete').addEventListener("click", event => {
            if (confirm("Deseja realmente excluir?")) {
                let user = new User();
                user.loadFromJSON(JSON.parse(tr.dataset.user));
                user.remove();
                tr.remove();
                this.updateCount();
            }
        });


        tr.querySelector(".btn-edit").addEventListener("click", event => {
            let json = JSON.parse(tr.dataset.user);

            this.formUp.dataset.trIndex = tr.sectionRowIndex;
            for (let name in json) {
                let field = this.formUp.querySelector("[name = " + name.replace("_", "") + "]");
                if (field) {
                    switch (field.type) {
                        case "file":
                            continue;
                            break;
                        case "radio":
                            field = this.formUp.querySelector("[name = " + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                            break;
                        case "checkbox":
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }

                }
            }

            this.formUp.querySelector(".photo").src = json._photo;
            this.showPainelUpdate();
        });
    }//Método para adicionar evento no botão edit e alocando os dados no formulário

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