"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}
var SignificantNumber = (function () {
    function SignificantNumber(value, significance) {
        if (typeof value === "string" && !value.match(/^\d*(\.\d*)?(e[+-]?\d+)?$/i)) {
            throw new TypeError("Exponential should be of the form: X.YZeW, where X, Y, Z, and W are numbers");
        }
        var tstr = value.toString();
        var trailingZeros = 0;
        if (tstr.indexOf(".") > -1) {
            var result = tstr.match(/0+$/);
            trailingZeros = result === null ? 0 : result[0].length;
        }
        this.value = (typeof value === "string" ? parseFloat(value) : value);
        var temp = this.value;
        if (significance) {
            this.significance = significance;
            var exp = parseFloat(temp.toExponential().split("e")[0]) / 10;
            var pow = parseInt(temp.toExponential().split("e")[1], 10);
            exp = precisionRound(exp, significance);
            if (SignificantNumber.UseSignificance) {
                this.value = exp * Math.pow(10, (pow + 1));
            }
        }
        else {
            var part = this.value.toExponential().split("e")[0];
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
        return !!text.match(/^\d*(\.\d*)?(e[+-]?\d+)?$/i);
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
    return SignificantNumber;
}());
exports.SignificantNumber = SignificantNumber;
