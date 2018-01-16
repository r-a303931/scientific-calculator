"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SignificantNumber_1 = require("./SignificantNumber");
var Parser = (function () {
    function Parser(variables) {
        this.variables = variables;
    }
    Parser.prototype.parse = function (text) {
        for (var s1 = void 0, pc = 0, i = text.length - 1; i >= 0; i--) {
            if (text[i] === ")") {
                if (pc === 0) {
                    s1 = i;
                }
                pc++;
            }
            else if (text[i] === "(") {
                pc--;
                if (pc === 0) {
                    text = text.slice(0, i) + this.parse(text.slice(i + 1, s1)) + text.slice(s1 + 1);
                }
            }
        }
        if (text.match(/(\d*\.?\d*)\s*([\+\-\*\/\^])\s*(\1)(\s*(\2)\s*(\1))*/)) {
            return this.doBasicOperations(text);
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
    Parser.prototype.solveEquation = function (text) {
        return null;
    };
    return Parser;
}());
exports.Parser = Parser;
