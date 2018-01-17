"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}
var SignificantNumber = (function () {
    function SignificantNumber(value, significance) {
        if (typeof value === "string" && !value.match(/^\-?\d*(\.\d*)?(e[+-]?\d+)?$/i)) {
            throw new TypeError("Exponential \"" + value + "\" should be of the form: X.YZeW, where X, Y, Z, and W are numbers");
        }
        var tstr = value.toString();
        var trailingZeros = 0;
        if (tstr.indexOf(".") > -1) {
            var result = tstr.split("e")[0].match(/0+$/);
            trailingZeros = result === null ? 0 : result[0].length;
        }
        this.value = (typeof value === "string" ? parseFloat(value) : value);
        var temp = this.value;
        if (significance) {
            this.significance = significance;
            if (SignificantNumber.UseSignificance) {
                var exp = parseFloat(temp.toExponential().split("e")[0]) / 10;
                var pow = parseInt(temp.toExponential().split("e")[1], 10);
                exp = precisionRound(exp, significance);
                this.value = exp * Math.pow(10, (pow + 1));
            }
        }
        else {
            var part = this.value.toExponential().split("e")[0].replace("-", "");
            if (part.indexOf(".") === -1) {
                this.significance = 1 + trailingZeros;
            }
            else {
                this.significance = part.length - 1 + trailingZeros;
            }
        }
    }
    SignificantNumber.FromExponential = function (text) {
        return new SignificantNumber(text);
    };
    SignificantNumber.ValidString = function (text) {
        return !!text.match(/^\-?\d*(\.\d*)?(e[+-]?\d+)?$/i);
    };
    SignificantNumber.prototype.add = function (num) {
        var val = num instanceof SignificantNumber ? num.value : num;
        return new SignificantNumber(val + this.value, Math.min(this.significance, num instanceof SignificantNumber ? num.significance : Infinity));
    };
    SignificantNumber.prototype.sub = function (num) {
        var val = num instanceof SignificantNumber ? num.value : num;
        return new SignificantNumber(this.value - val, Math.min(this.significance, num instanceof SignificantNumber ? num.significance : Infinity));
    };
    SignificantNumber.prototype.multiply = function (num) {
        var val = num instanceof SignificantNumber ? num.value : num;
        return new SignificantNumber(val * this.value, Math.min(this.significance, num instanceof SignificantNumber ? num.significance : Infinity));
    };
    SignificantNumber.prototype.divide = function (num) {
        var val = num instanceof SignificantNumber ? num.value : num;
        return new SignificantNumber(this.value / val, Math.min(this.significance, num instanceof SignificantNumber ? num.significance : Infinity));
    };
    SignificantNumber.prototype.power = function (num) {
        return new SignificantNumber(Math.pow(this.value, num), Math.min(this.significance, num instanceof SignificantNumber ? num.significance : Infinity));
    };
    SignificantNumber.prototype.sin = function () {
        if (!SignificantNumber.UseDegrees) {
            return new SignificantNumber(Math.sin(this.value), this.significance);
        }
        else {
            return new SignificantNumber(Math.sin(Math.PI / 180 * this.value), this.significance);
        }
    };
    SignificantNumber.prototype.cos = function () {
        if (!SignificantNumber.UseDegrees) {
            return new SignificantNumber(Math.cos(this.value), this.significance);
        }
        else {
            return new SignificantNumber(Math.cos(Math.PI / 180 * this.value), this.significance);
        }
    };
    SignificantNumber.prototype.tan = function () {
        if (!SignificantNumber.UseDegrees) {
            return new SignificantNumber(Math.tan(this.value), this.significance);
        }
        else {
            return new SignificantNumber(Math.tan(Math.PI / 180 * this.value), this.significance);
        }
    };
    SignificantNumber.prototype.callFunc = function (func) {
        return new SignificantNumber(func(this.value), this.significance);
    };
    SignificantNumber.prototype.copy = function () {
        return new SignificantNumber(this.value, this.significance);
    };
    SignificantNumber.prototype.valueOf = function () {
        return this.value;
    };
    SignificantNumber.prototype.toString = function () {
        var trailingZeros = this.significance - (new SignificantNumber(this.value)).significance;
        var exp = this.value.toExponential(), exp2 = "";
        var tstr = "";
        for (var i = 0; i < trailingZeros; i++) {
            tstr += "0";
        }
        exp2 = exp.slice(0, exp.indexOf("e"));
        if (exp2.length === 1 && tstr.length !== 0) {
            exp2 += ".";
        }
        exp2 += tstr + exp.slice(exp.indexOf("e"));
        return exp2;
    };
    SignificantNumber.UseSignificance = true;
    SignificantNumber.UseDegrees = true;
    return SignificantNumber;
}());
exports.SignificantNumber = SignificantNumber;
