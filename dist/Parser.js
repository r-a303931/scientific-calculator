"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SignificantNumber_1 = require("./SignificantNumber");
var Parser = (function () {
    function Parser(variables) {
        this.variables = variables;
    }
    Parser.prototype.parse = function (text) {
        for (var i in Object.keys(this.variables)) {
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
        if (text.match(/(\d*\.?\d*)\s*([\+\-\*\/\^])\s*(\1)(\s*(\2)\s*(\1))*/)) {
            return this.doBasicOperations(text);
        }
        if (text.match(/(\d*\.?\d*)\s*=\s*(\1)/)) {
            return this.assignVariable(text);
        }
        return null;
    };
    Parser.prototype.doBasicOperations = function (text) {
        text = text.replace(/\s/g, " ").replace(/([\+\-\*\/\^])/g, " $1 ").replace(/  /g, " ");
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
                var num1 = parts[i - 1] instanceof SignificantNumber_1.SignificantNumber ? parts[i - 1] :
                    new SignificantNumber_1.SignificantNumber(parts[i - 1]);
                var num2 = parts[i + 1] instanceof SignificantNumber_1.SignificantNumber ? parts[i + 1] :
                    new SignificantNumber_1.SignificantNumber(parts[i + 1]);
                var num3 = num1.multiply(num2);
                parts.splice(i - 1, 3, num3);
                i--;
            }
            else if (parts[i] === "/") {
                var num1 = parts[i - 1] instanceof SignificantNumber_1.SignificantNumber ? parts[i - 1] :
                    new SignificantNumber_1.SignificantNumber(parts[i - 1]);
                var num2 = parts[i + 1] instanceof SignificantNumber_1.SignificantNumber ? parts[i + 1] :
                    new SignificantNumber_1.SignificantNumber(parts[i + 1]);
                var num3 = num1.divide(num2);
                parts.splice(i - 1, 3, num3);
                i--;
            }
        }
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] === "+") {
                var num1 = parts[i - 1] instanceof SignificantNumber_1.SignificantNumber ? parts[i - 1] :
                    new SignificantNumber_1.SignificantNumber(parts[i - 1]);
                var num2 = parts[i + 1] instanceof SignificantNumber_1.SignificantNumber ? parts[i + 1] :
                    new SignificantNumber_1.SignificantNumber(parts[i + 1]);
                var num3 = num1.add(num2);
                parts.splice(i - 1, 3, num3);
                i--;
            }
            else if (parts[i] === "-") {
                var num1 = parts[i - 1] instanceof SignificantNumber_1.SignificantNumber ? parts[i - 1] :
                    new SignificantNumber_1.SignificantNumber(parts[i - 1]);
                var num2 = parts[i + 1] instanceof SignificantNumber_1.SignificantNumber ? parts[i + 1] :
                    new SignificantNumber_1.SignificantNumber(parts[i + 1]);
                var num3 = num1.sub(num2);
                parts.splice(i - 1, 3, num3);
                i--;
            }
        }
        return parts[0];
    };
    Parser.prototype.assignVariable = function (text) {
        text = text.replace(/\s/g, " ").replace(/  /g, " ");
        var parts = text.split(" = ");
        this.variables[parts[0]] = new SignificantNumber_1.SignificantNumber(parts[1]);
        return this.variables[parts[0]];
    };
    Parser.prototype.solveEquation = function (text) {
        return null;
    };
    return Parser;
}());
exports.Parser = Parser;
