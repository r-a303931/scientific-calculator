"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SignificantNumber_1 = require("./SignificantNumber");
var Vector_1 = require("./Vector");
var Parser = (function () {
    function Parser(variables) {
        this.variables = variables;
    }
    Parser.DetermineType = function (text) {
        if (Vector_1.Vector.ValidString(text)) {
            return function (t) {
                return Vector_1.Vector.FromCartesian(t.split(",")[0], t.split(",")[1]);
            };
        }
        else if (SignificantNumber_1.SignificantNumber.ValidString(text)) {
            return SignificantNumber_1.SignificantNumber.FromExponential;
        }
        else {
            return null;
        }
    };
    Parser.ParseVariable = function (text) {
        if (text instanceof SignificantNumber_1.SignificantNumber ||
            text instanceof Vector_1.Vector) {
            return text;
        }
        return Parser.DetermineType(text)(text);
    };
    Parser.prototype.parse = function (text) {
        var original = text;
        for (var i in this.variables) {
            if (this.variables.hasOwnProperty(i)) {
                var variable = this.variables[i];
                while (text.indexOf(i) > -1) {
                    text = text.replace(i, variable.toString());
                }
            }
        }
        for (var s1 = void 0, pc = 0, i_1 = text.length - 1; i_1 >= 0; i_1--) {
            if (text[i_1] === ")") {
                if (pc === 0) {
                    s1 = i_1;
                }
                pc++;
            }
            else if (text[i_1] === "(") {
                pc--;
                if (pc === 0) {
                    text = text.slice(0, i_1) + this.parse(text.slice(i_1 + 1, s1)) + text.slice(s1 + 1);
                }
            }
        }
        if (!!Parser.DetermineType(text)) {
            return Parser.DetermineType(text)(text);
        }
        else if (!!text.match(/(\d*\.?\d*(,\d*\.?\d*)?)\s*(?=[\+\-\*\/\^]\s)\s*(\1)(\s*(\2)\s*(\3))*/)) {
            return this.doBasicOperations(text);
        }
        else if (!!original.match(/([a-zA-Z][a-zA-Z0-9]*)\s*\=\s*(\d*\.?\d*(,\d*\.?\d*)?)/)) {
            return this.assignVariable(text);
        }
        throw new SyntaxError("Invalid expression");
    };
    Parser.prototype.doBasicOperations = function (text) {
        text = text.replace(/\s/g, " ").replace(/\s([\+\-\*\/\^])\s/g, " $1 ").replace(/  /g, " ").replace(/, /g, ",");
        var parts = text.split(" ");
        for (var i = parts.length - 1; i >= 0; i--) {
            if (parts[i] === "^") {
                var num1 = parts[i - 1] instanceof SignificantNumber_1.SignificantNumber ? parts[i - 1] :
                    new SignificantNumber_1.SignificantNumber(parts[i - 1]);
                var num2 = parts[i + 1] instanceof SignificantNumber_1.SignificantNumber ? parts[i + 1] :
                    new SignificantNumber_1.SignificantNumber(parts[i + 1]);
                var num3 = num1.power(num2);
                parts.splice(i - 1, 3, num3);
            }
        }
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] === "*") {
                var num1 = Parser.ParseVariable(parts[i - 1]);
                var num2 = Parser.ParseVariable(parts[i + 1]);
                var num3 = void 0;
                if (num1 instanceof Vector_1.Vector && num2 instanceof Vector_1.Vector) {
                    throw new TypeError("Cannot multiply 2 vectors together");
                }
                else if (num1 instanceof Vector_1.Vector && !(num2 instanceof Vector_1.Vector)) {
                    num3 = num1.multiply(num2);
                }
                else if (num2 instanceof Vector_1.Vector && !(num1 instanceof Vector_1.Vector)) {
                    num3 = num2.multiply(num1);
                }
                else if (num1 instanceof SignificantNumber_1.SignificantNumber && num2 instanceof SignificantNumber_1.SignificantNumber) {
                    num3 = num1.multiply(num2);
                }
                parts.splice(i - 1, 3, num3);
                i--;
            }
            else if (parts[i] === "/") {
                var num1 = Parser.ParseVariable(parts[i - 1]);
                var num2 = Parser.ParseVariable(parts[i + 1]);
                var num3 = void 0;
                if (num1 instanceof Vector_1.Vector && num2 instanceof Vector_1.Vector) {
                    throw new TypeError("Cannot divide 2 vectors together");
                }
                else if (num1 instanceof Vector_1.Vector && !(num2 instanceof Vector_1.Vector)) {
                    num3 = num1.divide(num2);
                }
                else if (num2 instanceof Vector_1.Vector && !(num1 instanceof Vector_1.Vector)) {
                    throw new TypeError("Cannot divide a number by a vector");
                }
                else if (num1 instanceof SignificantNumber_1.SignificantNumber && num2 instanceof SignificantNumber_1.SignificantNumber) {
                    num3 = num1.divide(num2);
                }
                parts.splice(i - 1, 3, num3);
                i--;
            }
        }
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] === "+") {
                var num1 = Parser.ParseVariable(parts[i - 1]);
                var num2 = Parser.ParseVariable(parts[i + 1]);
                var num3 = void 0;
                if (num1 instanceof Vector_1.Vector && num2 instanceof Vector_1.Vector) {
                    num3 = num1.add(num2);
                }
                else if (num1 instanceof Vector_1.Vector && !(num2 instanceof Vector_1.Vector)) {
                    throw new TypeError("Cannot add a vector and a number");
                }
                else if (num2 instanceof Vector_1.Vector && !(num1 instanceof Vector_1.Vector)) {
                    throw new TypeError("Cannot add a vector and a number");
                }
                else if (num1 instanceof SignificantNumber_1.SignificantNumber && num2 instanceof SignificantNumber_1.SignificantNumber) {
                    num3 = num1.add(num2);
                }
                parts.splice(i - 1, 3, num3);
                i--;
            }
            else if (parts[i] === "-") {
                var num1 = Parser.ParseVariable(parts[i - 1]);
                var num2 = Parser.ParseVariable(parts[i + 1]);
                var num3 = void 0;
                if (num1 instanceof Vector_1.Vector && num2 instanceof Vector_1.Vector) {
                    num3 = num1.sub(num2);
                }
                else if (num1 instanceof Vector_1.Vector && !(num2 instanceof Vector_1.Vector)) {
                    throw new TypeError("Cannot subtract a vector and a number");
                }
                else if (num2 instanceof Vector_1.Vector && !(num1 instanceof Vector_1.Vector)) {
                    throw new TypeError("Cannot subtract a vector and a number");
                }
                else if (num1 instanceof SignificantNumber_1.SignificantNumber && num2 instanceof SignificantNumber_1.SignificantNumber) {
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
    };
    Parser.prototype.assignVariable = function (text) {
        text = text.replace(/\s/g, " ").replace(/  /g, " ");
        var parts = text.split(" = ");
        if (parts[1].indexOf(",") > -1) {
            var vc = parts[1].split(",");
            this.variables[parts[0]] = Vector_1.Vector.FromCartesian(vc[0], vc[1]);
        }
        else {
            this.variables[parts[0]] = new SignificantNumber_1.SignificantNumber(parts[1]);
        }
        return this.variables[parts[0]];
    };
    Parser.prototype.solveEquation = function (text) {
        return null;
    };
    return Parser;
}());
exports.Parser = Parser;
