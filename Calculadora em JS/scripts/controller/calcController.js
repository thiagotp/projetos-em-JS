class CalcController {
    constructor() {
        //o underline indica que o método ou atributo é privado
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateCalcEl = document.querySelector("#data");
        this._hourCalcEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
    }

    //método principal desse projeto onde ele vai executar tudo que preciso que aconteça assim que a calculadora seja instanciada
    initialize() {
        this.setDisplayDateTime();
        //setInverval -> irá executar o que você pedir após um intervalo de tempo (função , tempo)
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
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
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
}