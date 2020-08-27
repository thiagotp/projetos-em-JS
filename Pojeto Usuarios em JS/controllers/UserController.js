
class UserController {
    constructor(formId, tableId) {
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
    }

    //Implantando o event submit
    onSubmit() {
        this.formEl.addEventListener("submit", event => {
            event.preventDefault();
            let values = this.getValues();
            values._photo = '';
            this.getPhoto(content => {
                console.log(content)
                values._photo = content
                this.addLine(values);
            });
        });
    }

    getPhoto(callback) {
        let fileReader = new FileReader();
        let elements = [...this.formEl.elements].filter(item => {
            if (item.name === "photo") {
                return item;
            }
        });
        let file = elements[0].files[0]
        fileReader.onload = () => {
            callback(fileReader.result)
        };
        fileReader.readAsDataURL(file);
    }

    //Obtendo o JSON do formulário 
    getValues() {
        let user = {};
        [...this.formEl.elements].forEach((field, index) => {
            if (field.name === "gender") {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else {
                user[field.name] = field.value;
            }
        });

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

    }

    addLine(dataUser) {
        this.tableEl.innerHTML = `
    <tr>
    <td><img src="${dataUser._photo}" alt="User Image" class="img-circle img-sm"></td>
      <td>${dataUser._name}</td>
      <td>${dataUser._email}</td>
      <td>${dataUser._admin}</td>
      <td>${dataUser._birth}</td>
    <td>
      <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
    </td>
  </tr>`
    }
}