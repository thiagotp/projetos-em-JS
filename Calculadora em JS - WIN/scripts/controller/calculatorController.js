class calculatorController {
    constructor() {
        this._lastOperator = "";
        this._lastNumber = "";
        this._operation = [];
        this._displayCalcEl = document.querySelector("#display");
        this.initButtons();
        this.display();
    }

    initButtons() {
        let buttons = document.querySelectorAll(".row button");

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, "click drag drop", e => {
                let textBtn = btn.innerHTML;
                this.execBtn(textBtn);
            });
        });
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        if (value.toString().length > 10) {
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }

    //Pegando o ultimo valor do array
    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    //trocando o valor do array
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value
    }

    insertArrayItem(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {
            this.calc();
        }
    }

    addEventListenerAll(element, actions, func) {
        actions.split(" ").forEach(action => {
            element.addEventListener(action, func, false);
        });
    }

    clearAll() {
        this._operation = [];
        this._lastOperator = "";
        this._lastNumber = "";
        this.display();
    }

    isOperation(value) {
        return (["+", "-", "*", "/", "%", "√", "x²", "±"].indexOf(value) > -1);
    }

    clearEntry() {
        this._operation.pop();
        this.display();
    }

    resultCalc() {
        try {
            return eval(this._operation.join(""));
        } catch (e) {
            setTimeout(() => {
                this.setError();
            }, 1)
        }
    }

    getLastItem(isOperator = true) {
        let lastItem
        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (this.isOperation(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }
        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }

    calc() {
        let last = '';
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {
            last = this._operation.pop();
            this._lastNumber = this.resultCalc();
        } else if (this._operation.length === 3) {
            this._lastNumber = this.getLastItem(false);
        }
        let rsp = this.resultCalc();
        if (last == "%") {
            rsp /= 100
            this._operation = [rsp];
        } else {
            this._operation = [rsp];
            if (last) this._operation.push(last);
        }
        console.log(this._operation)
        this.display();
    }

    display() {
        let number = this.getLastItem(false);

        if (!number) number = 0;
        this.displayCalc = number;
    }

    addOperation(value) {
        if (isNaN(this.getLastOperation())) {
            if (this.isOperation(value)) {
                this.setLastOperation(value);
            } else {
                this.insertArrayItem(value);
                this.display();
            }
        } else {
            if (this.isOperation(value)) {
                this.insertArrayItem(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                this.display();
            }
        }
        console.log(this._operation);
    }

    otherCalc(operator) {
        switch (operator) {
            case "√":
                let result = parseFloat(Math.sqrt(this.getLastOperation()).toFixed(8));
                this._operation = [];
                this._operation = [result];
                this.display()
                break;
            case "x²":
                let value = parseFloat(this.getLastOperation());
                this.setLastOperation(value * value);
                console.log("aqui")
                console.log(this.getLastOperation(false));
                this.calc();
                break;
            case "±":
                this.setLastOperation(this.getLastOperation() * (-1));
                this.display()
                break;
            case "¹/x":
                this.setLastOperation(parseFloat((1 / this.getLastOperation()).toFixed(8)));
                this.display();
                break;
        }
        console.log(this._operation)
    }

    execBtn(textBtn) {
        //this.playAudio();
        switch (textBtn) {
            case "C":
                this.clearAll();
                break;
            case "CE":
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
            case ",":
            case "+":
            case "-":
            case "%":
                this.addOperation(textBtn);
                break;
            case "÷":
                this.addOperation("/");
                break;
            case "X":
                this.addOperation("*");
                break;
            case "√":
            case "x²":
            case "±":
            case "¹/x":
                this.otherCalc(textBtn);
                break;
            case "=":
                this.calc();
                break;
            default:
                this.setError();
                break;
        }

    }

    setError() {
        this.displayCalc = "Error";
    }
}