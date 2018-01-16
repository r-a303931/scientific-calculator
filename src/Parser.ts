import {SignificantNumber} from "./SignificantNumber";

class Parser {
    constructor (public variables: {
        [key: string] : SignificantNumber
    }) {}

    public parse (text: string): SignificantNumber {
        for (var i in Object.keys(this.variables)) {
            if (this.variables.hasOwnProperty(i)) {
                let variable: any = this.variables[i];
                while (text.indexOf(i) > -1) {
                    text = text.replace(i, variable.toString());
                }
            }
        }
        for (let s1: number, pc: number = 0, i: number = text.length - 1; i >= 0; i--) {
            if (text[i] === ")") {
                if (pc === 0) {
                    s1 = i;
                }
                pc++;
            } else if (text[i] === "(") {
                pc--;
                if (pc === 0) {
                    text = text.slice(0, i) + this.parse(text.slice(i + 1, s1)) + text.slice(s1 + 1);
                }
            }
        }
        // https://regex101.com/r/TnAnYo/1
        if (text.match(/(\d*\.?\d*)\s*([\+\-\*\/\^])\s*(\1)(\s*(\2)\s*(\1))*/)) {
            return this.doBasicOperations(text);
        }
        if (text.match(/(\d*\.?\d*)\s*=\s*(\1)/)) {
            return this.assignVariable(text);
        }
        return null;
    }

    /**
     * Parses a string to do math
     *
     * @param string text The text to parse
     *
     * @return The value
     */
    protected doBasicOperations (text: string): SignificantNumber {
        text = text.replace(/\s/g, " ").replace(/([\+\-\*\/\^])/g, " $1 ").replace(/  /g, " ");
        let parts: any[] = text.split(" ");
        // First search for exponentiation
        for (let i: number = parts.length - 1; i >= 0; i--) {
            if (parts[i] === "^") {
                let num1: SignificantNumber = parts[i - 1] instanceof SignificantNumber ? parts[i - 1] :
                    new SignificantNumber(parts[i - 1]);
                let num2: SignificantNumber = parts[i + 1] instanceof SignificantNumber ? parts[i + 1] :
                    new SignificantNumber(parts[i + 1]);
                let num3: SignificantNumber = num1.power(num2);
                parts.splice(i - 1, 3, num3);
            }
        }
        // Next search for multiplication and division
        for (let i: number = 0; i < parts.length; i++) {
            if (parts[i] === "*") {
                let num1: SignificantNumber = parts[i - 1] instanceof SignificantNumber ? parts[i - 1] :
                    new SignificantNumber(parts[i - 1]);
                let num2: SignificantNumber = parts[i + 1] instanceof SignificantNumber ? parts[i + 1] :
                    new SignificantNumber(parts[i + 1]);
                let num3: SignificantNumber = num1.multiply(num2);
                parts.splice(i - 1, 3, num3);
                i--;
            } else if (parts[i] === "/") {
                let num1: SignificantNumber = parts[i - 1] instanceof SignificantNumber ? parts[i - 1] :
                    new SignificantNumber(parts[i - 1]);
                let num2: SignificantNumber = parts[i + 1] instanceof SignificantNumber ? parts[i + 1] :
                    new SignificantNumber(parts[i + 1]);
                let num3: SignificantNumber = num1.divide(num2);
                parts.splice(i - 1, 3, num3);
                i--;
            }
        }
        // Finally search for addition and subtraction
        for (let i: number = 0; i < parts.length; i++) {
            if (parts[i] === "+") {
                let num1: SignificantNumber = parts[i - 1] instanceof SignificantNumber ? parts[i - 1] :
                    new SignificantNumber(parts[i - 1]);
                let num2: SignificantNumber = parts[i + 1] instanceof SignificantNumber ? parts[i + 1] :
                    new SignificantNumber(parts[i + 1]);
                let num3: SignificantNumber = num1.add(num2);
                parts.splice(i - 1, 3, num3);
                i--;
            } else if (parts[i] === "-") {
                let num1: SignificantNumber = parts[i - 1] instanceof SignificantNumber ? parts[i - 1] :
                    new SignificantNumber(parts[i - 1]);
                let num2: SignificantNumber = parts[i + 1] instanceof SignificantNumber ? parts[i + 1] :
                    new SignificantNumber(parts[i + 1]);
                let num3: SignificantNumber = num1.sub(num2);
                parts.splice(i - 1, 3, num3);
                i--;
            }
        }
        return parts[0];
    }

    protected assignVariable (text: string): SignificantNumber {
        text = text.replace(/\s/g, " ").replace(/  /g, " ");
        let parts: string[] = text.split(" = ");
        this.variables[parts[0]] = new SignificantNumber (parts[1]);
        return this.variables[parts[0]];
    }

    protected solveEquation (text: string): SignificantNumber {

        return null;
    }
}

export {Parser};
