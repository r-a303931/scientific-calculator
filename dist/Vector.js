"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SignificantNumber_1 = require("./SignificantNumber");
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.ValidString = function (text) {
        return !!text.match(/^\d*(\.\d*)?(e[+-]?\d+)?,\d*(\.\d*)?(e[+-]?\d+)?$/i);
    };
    Vector.FromCartesian = function (x, y) {
        if (!(x instanceof SignificantNumber_1.SignificantNumber)) {
            x = new SignificantNumber_1.SignificantNumber(x);
        }
        if (!(y instanceof SignificantNumber_1.SignificantNumber)) {
            y = new SignificantNumber_1.SignificantNumber(y);
        }
        return new Vector(x, y);
    };
    Vector.FromPolar = function (r, t) {
        if (!(r instanceof SignificantNumber_1.SignificantNumber)) {
            r = new SignificantNumber_1.SignificantNumber(r, 25);
        }
        if (!(t instanceof SignificantNumber_1.SignificantNumber)) {
            t = new SignificantNumber_1.SignificantNumber(t);
        }
        return new Vector(r.multiply(t.cos()), r.multiply(t.sin()));
    };
    Object.defineProperty(Vector.prototype, "radius", {
        get: function () {
            return this.x.copy().multiply(this.x).add(this.y.copy().multiply(this.y)).callFunc(Math.sqrt);
        },
        set: function (nr) {
            var theta = this.theta;
            this.x = nr.multiply(theta.cos());
            this.y = nr.multiply(theta.sin());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "theta", {
        get: function () {
            return this.y.copy().divide(this.x).callFunc(Math.atan).multiply(180 / Math.PI);
        },
        set: function (nt) {
            var radius = this.radius;
            this.x = radius.multiply(nt.cos());
            this.y = radius.multiply(nt.sin());
        },
        enumerable: true,
        configurable: true
    });
    Vector.prototype.toString = function () {
        return this.x + "," + this.y;
    };
    Vector.prototype.multiply = function (num) {
        return new Vector(this.x.copy().multiply(num), this.y.copy().multiply(num));
    };
    Vector.prototype.divide = function (num) {
        return new Vector(this.x.copy().divide(num), this.y.copy().divide(num));
    };
    Vector.prototype.add = function (num) {
        return new Vector(this.x.copy().add(num.x), this.y.copy().add(num.y));
    };
    Vector.prototype.sub = function (num) {
        return new Vector(this.x.copy().sub(num.x), this.y.copy().sub(num.y));
    };
    Vector.prototype.normalize = function () {
        return Vector.FromPolar(1, this.theta);
    };
    Vector.prototype.get = function () {
        return new Vector(this.x.copy(), this.y.copy());
    };
    Vector.prototype.copy = function () { return this.get(); };
    Vector.prototype.dot = function (vec) {
        return this.x.copy().multiply(vec.x).add(this.y.copy().multiply(vec.y));
    };
    Vector.prototype.toPolar = function () {
        return {
            radius: this.radius,
            theta: this.theta
        };
    };
    Vector.prototype.toCartesian = function () {
        return {
            x: this.x,
            y: this.y
        };
    };
    return Vector;
}());
exports.Vector = Vector;
