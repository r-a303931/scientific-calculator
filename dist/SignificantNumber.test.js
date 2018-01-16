"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SignificantNumber_1 = require("./SignificantNumber");
describe("significant number parser", function () {
    it("should parse decimals for significance", function () {
        var num1 = new SignificantNumber_1.SignificantNumber("12.340");
        expect(num1.significance).toBe(5);
    });
    it("should parse tiny decimals for significance", function () {
        var num2 = new SignificantNumber_1.SignificantNumber(0.000123);
        expect(num2.significance).toBe(3);
    });
    it("should parse integers for significance", function () {
        var num3 = new SignificantNumber_1.SignificantNumber(1200);
        expect(num3.significance).toBe(2);
    });
    it("should parse decimals with a given significance", function () {
        var num4 = new SignificantNumber_1.SignificantNumber("12.340", 2);
        expect(num4.value).toBe(12);
    });
    it("should parse integers with a given significance", function () {
        var num5 = new SignificantNumber_1.SignificantNumber(12345, 2);
        expect(num5.value).toBe(12000);
    });
    it("should parse tiny decimals with a given significance", function () {
        var num6 = new SignificantNumber_1.SignificantNumber(0.0001234, 2);
        expect(num6.value).toBe(0.00012);
    });
    it("should parse exponential forms", function () {
        var num7 = new SignificantNumber_1.SignificantNumber("1.230e+4");
        expect(num7.value).toBe(12300);
    });
    it("should parse exponential forms with zeros", function () {
        var num8 = new SignificantNumber_1.SignificantNumber("1.00e+4");
        expect(num8.value).toBe(10000);
        expect(num8.significance).toBe(3);
    });
    it("should fail to parse invalid exponential forms", function () {
        expect(function () {
            var num9 = new SignificantNumber_1.SignificantNumber("not a number");
        }).toThrow();
    });
});
describe("significant number operations", function () {
    it("should add significantly", function () {
        var num1 = new SignificantNumber_1.SignificantNumber(123);
        var num2 = new SignificantNumber_1.SignificantNumber(50);
        var num3 = num1.add(num2);
        expect(num3.value).toBe(200);
        expect(num3.significance).toBe(1);
    });
    it("should subtract significantly", function () {
        var num1 = new SignificantNumber_1.SignificantNumber(123);
        var num2 = new SignificantNumber_1.SignificantNumber(50);
        var num3 = num1.sub(num2);
        expect(num3.value).toBe(70);
        expect(num3.significance).toBe(1);
    });
    it("should multiply significantly", function () {
        var num1 = new SignificantNumber_1.SignificantNumber(123);
        var num2 = new SignificantNumber_1.SignificantNumber(50, 2);
        var num3 = num1.multiply(num2);
        expect(num3.value).toBe(6200);
        expect(num3.significance).toBe(2);
    });
    it("should divide significantly", function () {
        var num1 = new SignificantNumber_1.SignificantNumber(123);
        var num2 = new SignificantNumber_1.SignificantNumber(50, 2);
        var num3 = num1.divide(num2);
        expect(num3.value).toBe(2.5);
        expect(num3.significance).toBe(2);
    });
    it("should add significantly with integers", function () {
        var num1 = new SignificantNumber_1.SignificantNumber(123);
        var num3 = num1.add(50);
        expect(num3.value).toBe(173);
        expect(num3.significance).toBe(3);
    });
    it("should subtract significantly with integers", function () {
        var num1 = new SignificantNumber_1.SignificantNumber(123);
        var num3 = num1.sub(50);
        expect(num3.value).toBe(73);
        expect(num3.significance).toBe(3);
    });
    it("should multiply significantly with integers", function () {
        var num1 = new SignificantNumber_1.SignificantNumber(123);
        var num3 = num1.multiply(50);
        expect(num3.value).toBe(6150);
        expect(num3.significance).toBe(3);
    });
    it("should divide significantly with integers", function () {
        var num1 = new SignificantNumber_1.SignificantNumber(123);
        var num3 = num1.divide(50);
        expect(num3.value).toBe(2.46);
        expect(num3.significance).toBe(3);
    });
    it("should be raisable to a power", function () {
        var num1 = new SignificantNumber_1.SignificantNumber("2.0000");
        var num3 = new SignificantNumber_1.SignificantNumber(10);
        expect(num1.power(3)).toEqual(new SignificantNumber_1.SignificantNumber("8.0000"));
        expect(num1.power(num3)).toEqual(new SignificantNumber_1.SignificantNumber(1000));
    });
});
describe("disabling significance", function () {
    it("should be able to disable use of significance", function () {
        SignificantNumber_1.SignificantNumber.UseSignificance = false;
        var num1 = new SignificantNumber_1.SignificantNumber(123456789);
        var num2 = new SignificantNumber_1.SignificantNumber(120000000);
        var num3 = num1.add(num2);
        expect(num3.value).toBe(120000000 + 123456789);
        SignificantNumber_1.SignificantNumber.UseSignificance = true;
    });
});
describe("exporting values", function () {
    it("should preserve significance in .toString()", function () {
        var num1 = new SignificantNumber_1.SignificantNumber("1.00000000000000000000");
        expect(num1.toString()).toBe("1.00000000000000000000e+0");
    });
});
describe("use with other math functions", function () {
    var num1 = new SignificantNumber_1.SignificantNumber("45.0");
    it("should be possible to use trig", function () {
        expect(num1.sin()).toEqual(new SignificantNumber_1.SignificantNumber(0.707));
        expect(num1.cos()).toEqual(new SignificantNumber_1.SignificantNumber(0.707));
        expect(num1.tan()).toEqual(new SignificantNumber_1.SignificantNumber("1.00"));
    });
    var num2 = new SignificantNumber_1.SignificantNumber(Math.PI, 7);
    it("should be possible to use trig in radian mode", function () {
        SignificantNumber_1.SignificantNumber.UseDegrees = false;
        expect(num2.sin().value).toBeCloseTo(0, 5);
        expect(num2.sin().significance).toBe(7);
        expect(num2.cos().value).toBeCloseTo(-1, 5);
        expect(num2.cos().significance).toBe(7);
        expect(num2.tan().value).toBeCloseTo(0, 5);
        expect(num2.tan().significance).toBe(7);
        SignificantNumber_1.SignificantNumber.UseDegrees = true;
    });
});
