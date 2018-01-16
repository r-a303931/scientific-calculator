"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Parser_1 = require("./Parser");
var SignificantNumber_1 = require("./SignificantNumber");
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
});
describe("variable operations", function () {
    it("should store variables correctly", function () {
        expect(parser.parse("x = 5")).toEqual(new SignificantNumber_1.SignificantNumber(5));
        expect(parser.variables.x).toEqual(new SignificantNumber_1.SignificantNumber(5));
    });
    it("should operate on variables correctly", function () {
        parser.variables.x = new SignificantNumber_1.SignificantNumber(5);
        expect(parser.parse("5 + x")).toEqual(new SignificantNumber_1.SignificantNumber(10));
    });
});
