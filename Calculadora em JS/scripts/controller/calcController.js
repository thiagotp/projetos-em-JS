class CalcController {
    constructor() {
        //o underline indica que o método ou atributo é privado
        this._lastOperator = "";
        this._lastNumber = "";
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateCalcEl = document.querySelector("#data");
        this._hourCalcEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoards();
    }

    //método principal desse projeto onde ele vai executar tudo que preciso que aconteça assim que a calculadora seja instanciada
    initialize() {
        this.setDisplayDateTime();
        //setInverval -> irá executar o que você pedir após um intervalo de tempo (função , tempo)
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
        this.setLastNumberToDisplay();
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

    //Pegando eventos do teclado
    initKeyBoards() {
        document.addEventListener("keyup", e => {
            console.log(e.key)
            switch (e.key) {
                case "Delete":
                case "Escape":
                    this.clearAll();
                    break;
                case "Backspace":
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
                    this.addOperation(parseFloat(e.key));
                    break;
                case ".":
                case ",":
                    this.addDot();
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    this.addOperation(e.key);
                    break;
                case "Enter":
                case "=":
                    this.calc();
                    break;
            }
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
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    //método para apagar a última entrada do array
    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
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
                console.log(this._operation)
            } else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
                console.log(this._operation)
            }
        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
                console.log(this._operation)
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation((newValue));
                this.setLastNumberToDisplay();
                console.log(this._operation)
            }
        }

    }

    //Inserindo números e operadores no array _operation
    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {
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

    getLastItem(isOperator = true) {
        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }

        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber
        }
        return lastItem;
    }

    //atualizando o valor do display
    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber
    }

    getResult() {
        return eval(this._operation.join(""));
    }

    //fazendo o cálculo automático depois de 4 itens no array e configurando o mesmo
    calc() {
        let last = "";
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }
        if (this._operation.length > 3) {
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false);
        }
        let result = this.getResult();
        console.log(result);
        if (last == "%") {
            result /= 100;
            this._operation = [result];
        } else {
            this._operation = [result];
            if (last) this._operation.push(last);
        }
        console.log('lastOperator', this._lastOperator)
        console.log('lastNumber', this._lastNumber)
        this.setLastNumberToDisplay();
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
                this.addDot();
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
                this.calc();
                break;
            default:
                this.setError();
                break;
        }

    }

    addDot() {
        let lastOperation = this.getLastOperation();
        console.log(lastOperation);
        if (typeof lastOperation === 'string' && lastOperation && lastOperation.split("").indexOf(".") > -1) {
            return;
        }
        if ((this.isOperator(lastOperation) || (!lastOperation)) && lastOperation != 0) {
            this.pushOperation("0.");
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();

    }

    setError() {
        this.displayCalc = "Error"
    }
}