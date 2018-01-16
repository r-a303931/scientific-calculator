import {SignificantNumber} from "./SignificantNumber";
import {Vector} from "./Vector";

class Parser {
    public static DetermineType (text: string): Function {
        if (Vector.ValidString(text)) {
            return (t: string): Vector => {
                return Vector.FromCartesian(t.split(",")[0], t.split(",")[1]);
            };
        } else if (SignificantNumber.ValidString(text)) {
            return SignificantNumber.FromExponential;
        } else {
            return null;
        }
    }

    public static ParseVariable (text: string | SignificantNumber | Vector): SignificantNumber | Vector {
        if (text instanceof SignificantNumber ||
            text instanceof Vector) {
            return text;
        }
        return Parser.DetermineType(text)(text);
    }

    constructor (public variables: {
        [key: string] : SignificantNumber | Vector
    }) {}

    public parse (text: string): SignificantNumber | Vector {
        let original: string = text;
        for (var i in this.variables) {
            if (this.variables.hasOwnProperty(i)) {
                let variable: SignificantNumber | Vector = this.variables[i];
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
        if (!!Parser.DetermineType(text)) {
            return Parser.DetermineType(text)(text);
        } else if (!!text.match(/(\d*\.?\d*(,\d*\.?\d*)?)\s*(?=[\+\-\*\/\^]\s)\s*(\1)(\s*(\2)\s*(\3))*/)) {
            return this.doBasicOperations(text);
        } else if (!!original.match(/([a-zA-Z][a-zA-Z0-9]*)\s*\=\s*(\d*\.?\d*(,\d*\.?\d*)?)/)) {
            return this.assignVariable(text);
        }
        throw new SyntaxError ("Invalid expression");
    }

    /**
     * Parses a string to do math
     *
     * @param string text The text to parse
     *
     * @return The value
     */
    protected doBasicOperations (text: string): SignificantNumber | Vector {
        text = text.replace(/\s/g, " ").replace(/\s([\+\-\*\/\^])\s/g, " $1 ").replace(/  /g, " ").replace(/, /g, ",");
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
                let num1: SignificantNumber | Vector = Parser.ParseVariable(parts[i - 1]);
                let num2: SignificantNumber | Vector = Parser.ParseVariable(parts[i + 1]);
                let num3: SignificantNumber | Vector;
                if (num1 instanceof Vector && num2 instanceof Vector) {
                    throw new TypeError ("Cannot multiply 2 vectors together");
                } else if (num1 instanceof Vector && !(num2 instanceof Vector)) {
                    num3 = num1.multiply(num2);
                } else if (num2 instanceof Vector && !(num1 instanceof Vector)) {
                    num3 = num2.multiply(num1);
                } else if (num1 instanceof SignificantNumber && num2 instanceof SignificantNumber) {
                    num3 = num1.multiply(num2);
                }
                parts.splice(i - 1, 3, num3);
                i--;
            } else if (parts[i] === "/") {
                let num1: SignificantNumber | Vector = Parser.ParseVariable(parts[i - 1]);
                let num2: SignificantNumber | Vector = Parser.ParseVariable(parts[i + 1]);
                let num3: SignificantNumber | Vector;
                if (num1 instanceof Vector && num2 instanceof Vector) {
                    throw new TypeError ("Cannot divide 2 vectors together");
                } else if (num1 instanceof Vector && !(num2 instanceof Vector)) {
                    num3 = num1.divide(num2);
                } else if (num2 instanceof Vector && !(num1 instanceof Vector)) {
                    throw new TypeError ("Cannot divide a number by a vector");
                } else if (num1 instanceof SignificantNumber && num2 instanceof SignificantNumber) {
                    num3 = num1.divide(num2);
                }
                parts.splice(i - 1, 3, num3);
                i--;
            }
        }
        // Finally search for addition and subtraction
        for (let i: number = 0; i < parts.length; i++) {
            if (parts[i] === "+") {
                let num1: SignificantNumber | Vector = Parser.ParseVariable(parts[i - 1]);
                let num2: SignificantNumber | Vector = Parser.ParseVariable(parts[i + 1]);
                let num3: SignificantNumber | Vector;
                if (num1 instanceof Vector && num2 instanceof Vector) {
                    num3 = num1.add(num2);
                } else if (num1 instanceof Vector && !(num2 instanceof Vector)) {
                    throw new TypeError("Cannot add a vector and a number");
                } else if (num2 instanceof Vector && !(num1 instanceof Vector)) {
                    throw new TypeError("Cannot add a vector and a number");
                } else if (num1 instanceof SignificantNumber && num2 instanceof SignificantNumber) {
                    num3 = num1.add(num2);
                }
                parts.splice(i - 1, 3, num3);
                i--;
            } else if (parts[i] === "-") {
                let num1: SignificantNumber | Vector = Parser.ParseVariable(parts[i - 1]);
                let num2: SignificantNumber | Vector = Parser.ParseVariable(parts[i + 1]);
                let num3: SignificantNumber | Vector;
                if (num1 instanceof Vector && num2 instanceof Vector) {
                    num3 = num1.sub(num2);
                } else if (num1 instanceof Vector && !(num2 instanceof Vector)) {
                    throw new TypeError("Cannot subtract a vector and a number");
                } else if (num2 instanceof Vector && !(num1 instanceof Vector)) {
                    throw new TypeError("Cannot subtract a vector and a number");
                } else if (num1 instanceof SignificantNumber && num2 instanceof SignificantNumber) {
                    num3 = num1.sub(num2);
                }
                parts.splice(i - 1, 3, num3);
                i--;
            }
        }
        if (parts.length > 1) {
            throw new SyntaxError("Invalid expression");
        }
        return parts[0];
    }

    protected assignVariable (text: string): SignificantNumber | Vector {
        text = text.replace(/\s/g, " ").replace(/  /g, " ");
        let parts: string[] = text.split(" = ");
        if (parts[1].indexOf(",") > -1) {
            let vc: string[] = parts[1].split(",");
            this.variables[parts[0]] = Vector.FromCartesian(vc[0], vc[1]);
        } else {
            this.variables[parts[0]] = new SignificantNumber (parts[1]);
        }
        return this.variables[parts[0]];
    }

    protected solveEquation (text: string): SignificantNumber {

        return null;
    }
}

export {Parser};
