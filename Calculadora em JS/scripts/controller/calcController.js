class CalcController {
    constructor() {
        //o underline indica que o método ou atributo é privado
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateCalcEl = document.querySelector("#data");
        this._hourCalcEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }

    //método principal desse projeto onde ele vai executar tudo que preciso que aconteça assim que a calculadora seja instanciada
    initialize() {
        this.setDisplayDateTime();
        //setInverval -> irá executar o que você pedir após um intervalo de tempo (função , tempo)
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        //O "e" será a variável responsavel pelo evento nessa arrow function. Se precisar fazer alguma ação será usada e."ação"
        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, "click drag drop", e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });
        });
    }

    ///GET E SET

    //pegando o valor disponível direto do display do html
    //innerHTML -> É uma propriedade que permite a inserção de informação no HTML
    get displayTime() {
        return this._hourCalcEl.innerHTML;
    }

    get displayDate() {
        return this._dateCalcEl.innerHTML;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    //esse método irá me retornar uma instância do objeto new date
    get currentDate() {
        return new Date();
    }

    //mudando o valor direto do display do html
    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }

    set displayTime(value) {
        this._hourCalcEl.innerHTML = value;
    }

    set displayDate(value) {
        this._dateCalcEl.innerHTML = value;
    }

    set currentDate(value) {
        this._currentDate = value;
    }


    //MÉTODOS DA APLICAÇÃO

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    //método criado para incluir vários eventos ao mesmo tempo nos botões da calculadora
    addEventListenerAll(element, events, func) {
        events.split(" ").forEach(event => {
            element.addEventListener(event, func, false);
        });
    }

    //método para apagar tudo da calculadora
    clearAll() {
        this._operation = [];
    }

    //método para apagar a última entrada do array
    clearEntry() {
        this._operation.pop();
    }

    //método para adicionar item ao array
    addOperation(value) {
        /**Esse "if" é responsável por verificar qual o último número do array e assim 
         * dizer se irá ocorrer uma adição de um item novo no array ou se irá ocorrer uma concatenação de string
         * 
         * O primeiro if irá saber se o que tem no último item do array this._operation não é um número.
         * dando true ele irá verificar se é um operador, se for false ele vai concatenar com o número que já existe
         */
        if (isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            } else if (isNaN(value)) {
                console.log("outra coisa");
            } else {
                this.pushOperation(value);
            }
        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation((parseFloat(newValue)));
                this.setLastNumberToDisplay();
            }
        }

    }

    //Inserindo números e operadores no array _operation
    pushOperation(value){
        this._operation.push(value);   
        if(this._operation.length > 3){
           this.calc();
        }
    }

    //conferindo se o valor que está sendo recebido por parâmetro é um operador
    isOperator(value) {
        return (["+", "-", "%", "/", "*"].indexOf(value) > -1);
    }

    //pegando o último valor do Array _operation
    getLastOperation() {
        return this._operation[this._operation.length - 1]
    }

    //trocando o valor do array
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value
    }

    //atualizando o valor do display
    setLastNumberToDisplay(){
        for(let i = this._operation.length;i>=0;i--){
            if(!isNaN(this._operation[i])){
                console.log("o numero é "+this._operation[i])
            }
        }
    }

    //fazendo o cálculo automático depois de 4 itens no array e configurando o mesmo
    calc(){
        let last = this._operation.pop();
        let result = eval(this._operation.join(""));
        this._operation = [result, last]
    }


    execBtn(textBtn) {
        switch (textBtn) {
            case "ac":
                this.clearAll();
                break;
            case "ce":
                this.clearEntry();
                break;
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "0":
                this.addOperation(parseFloat(textBtn));
                break;
            case "ponto":
                break;
            case "soma":
                this.addOperation("+");
                break;
            case "subtracao":
                this.addOperation("-");
                break;
            case "multiplicacao":
                this.addOperation("*");
                break;
            case "divisao":
                this.addOperation("/");
                break;
            case "porcento":
                this.addOperation("%");
                break;
            case "igual":
                break;
            default:
                this.setError();
                break;
        }

    }
    setError() {
        this.displayCalc = "Error"
    }
}
