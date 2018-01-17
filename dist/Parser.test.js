"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Parser_1 = require("./Parser");
var SignificantNumber_1 = require("./SignificantNumber");
var Vector_1 = require("./Vector");
var parser = new Parser_1.Parser({});
describe("basic math operations", function () {
    it("should exponentiate properly", function () {
        expect(parser.parse("2 ^ 2")).toEqual(new SignificantNumber_1.SignificantNumber(4));
    });
    it("should use parenthesis properly", function () {
        expect(parser.parse("2 ^ (2 ^ 2)")).toEqual(new SignificantNumber_1.SignificantNumber(16, 1));
    });
    it("should multiply and divide from left to right", function () {
        expect(parser.parse("2.0 * 3.0 / 4.0")).toEqual(new SignificantNumber_1.SignificantNumber(1.5));
    });
    it("should add and subtract from left to right", function () {
        expect(parser.parse("2 + 3 - 4")).toEqual(new SignificantNumber_1.SignificantNumber(1));
    });
    it("should fail on an invalid expression", function () {
        expect(function () {
            console.log(parser.parse("e"));
        }).toThrow(SyntaxError);
        expect(function () {
            console.log(parser.parse("2 ** 3"));
        }).toThrow(SyntaxError);
    });
});
describe("variable operations", function () {
    it("should store integer variables", function () {
        expect(parser.parse("x = 5")).toEqual(new SignificantNumber_1.SignificantNumber(5));
        expect(parser.variables.x).toEqual(new SignificantNumber_1.SignificantNumber(5));
    });
    it("should operate on integer variables", function () {
        parser.variables.x = new SignificantNumber_1.SignificantNumber(5);
        expect(parser.parse("5 + x")).toEqual(new SignificantNumber_1.SignificantNumber(10));
    });
    it("should store vector variables", function () {
        expect(parser.parse("y = 2,3")).toEqual(Vector_1.Vector.FromCartesian(2, 3));
    });
    it("should operate on vector variables", function () {
        parser.variables.y = Vector_1.Vector.FromCartesian(2, 3);
        expect(parser.parse("y + 3,2")).toEqual(Vector_1.Vector.FromCartesian(5, 5));
    });
    it("should return the variable", function () {
        parser.variables.x = new SignificantNumber_1.SignificantNumber(5);
        expect(parser.parse("x")).toEqual(new SignificantNumber_1.SignificantNumber(5));
    });
});
describe("vector handling", function () {
    it("should reject adding integers and vectors", function () {
        expect(function () {
            parser.parse("3,2 + 5");
        }).toThrow();
        expect(function () {
            parser.parse("5 + 3,2");
        }).toThrow();
    });
    it("should reject subtracting integers and vectors", function () {
        expect(function () {
            parser.parse("3,2 - 5");
        }).toThrow();
        expect(function () {
            parser.parse("5 - 3,2");
        }).toThrow();
    });
    it("should divide a vector by a scalar", function () {
        expect(parser.parse("2,2 / 2")).toEqual(Vector_1.Vector.FromCartesian(1, 1));
    });
    it("should multiply a vector by a scalar", function () {
        expect(parser.parse("1,1 * 2")).toEqual(Vector_1.Vector.FromCartesian(2, 2));
        expect(parser.parse("2 * 1,1")).toEqual(Vector_1.Vector.FromCartesian(2, 2));
    });
    it("should subtract two vectors", function () {
        expect(parser.parse("2,2 - 4,3")).toEqual(Vector_1.Vector.FromCartesian(-2, -1));
    });
    it("should subtract add vectors", function () {
        expect(parser.parse("2,2 + 4,3")).toEqual(Vector_1.Vector.FromCartesian(6, 5));
    });
    it("should not a scalar by a vector", function () {
        expect(function () {
            parser.parse("1 / 2,2");
        }).toThrow();
    });
    it("should not divide two vectors together", function () {
        expect(function () {
            parser.parse("2,2 / 1,5");
        }).toThrow();
    });
    it("should not multiply two vectors together", function () {
        expect(function () {
            parser.parse("2,2 * 1,5");
        }).toThrow();
    });
});
describe("equation handling", function () {
    it("should solve quadratic equations", function () {
        expect(parser.parse("x: 0 = x^2 + 2x + 1")).toBe([
            new SignificantNumber_1.SignificantNumber(-1),
            new SignificantNumber_1.SignificantNumber(-1)
        ]);
        expect(parser.parse("x: x^2 + 2x + 1")).toBe([
            new SignificantNumber_1.SignificantNumber(-1),
            new SignificantNumber_1.SignificantNumber(-1)
        ]);
    });
});
