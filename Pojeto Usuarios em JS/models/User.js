class User {
    constructor(name, gender, birth, country, email, password, photo, admin) {
        this._id
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
    }

    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get gender() {
        return this._gender;
    }
    get birth() {
        return this._birth;
    }
    get country() {
        return this._country;
    }
    get email() {
        return this._email;
    }
    get password() {
        return this._password;
    }
    get photo() {
        return this._photo;
    }
    get admin() {
        return this._admin;
    }
    get register() {
        return this._register;
    }

    set name(value) {
        this._name = value;
    }
    set gender(value) {
        this._gender = value;
    }
    set birth(value) {
        this._birth = value;
    }
    set country(value) {
        this._country = value;
    }
    set email(value) {
        this._email = value;
    }
    set password(value) {
        this._password = value;
    }
    set photo(value) {
        this._photo = value;
    }
    set admin(value) {
        this._admin = value;
    }
    set register(value) {
        this._register = value;
    }

    loadFromJSON(json) {
        for (let name in json) {
            switch (name) {
                case '_register':
                    this[name] = new Date(json[name]);
                    break;
                default:
                    this[name] = json[name];
            }
        }
    }


    getNewId() {
        let usersID =  parseInt(localStorage.getItem("usersID"));

        if (!usersID > 0) usersID = 0;
        usersID++;

        localStorage.setItem("usersID", usersID);

        return usersID;
    }//Método para gerar o ID para cada usuário que for adicionado no array

    static getUserStorage() {
        let users = [];
        if (localStorage.getItem("users")) {
            //users = JSON.parse(sessionStorage.getItem("users"));
            users = JSON.parse(localStorage.getItem("users"));
        }
        return users;
    }//Método para percorrer o lcal storage e montar um array com o itens que lá existem 

    save() {
        let users = User.getUserStorage();

        if (this.id > 0) {
            users.map(u => {
                if (u._id == this.id) {
                    Object.assign(u,this);
                }
                return u;
            })
        } else {
            this._id = this.getNewId();

            users.push(this);
        }
        localStorage.setItem("users", JSON.stringify(users))
    }//Método que  procura os  usuários no array, salva as alterações com o MAP e grava no localStorage
    
    remove(){
        let users = User.getUserStorage();
        users.forEach((userData, index)=>{
            if(this._id == userData._id){
                users.splice(index,1);
            }
        });
        localStorage.setItem("users", JSON.stringify(users))
    }//Método para remover um usuário do localStorage
}