"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector_1 = require("./Vector");
var SignificantNumber_1 = require("./SignificantNumber");
var test = Vector_1.Vector.FromCartesian("5.0", "2.0");
describe("calculations", function () {
    it("should convert to polar", function () {
        expect(test.toPolar()).toEqual({
            radius: new SignificantNumber_1.SignificantNumber(5.4),
            theta: new SignificantNumber_1.SignificantNumber(22)
        });
    });
    it("should calculate the dot product", function () {
        var test2 = Vector_1.Vector.FromCartesian("1.0e+1", "1.0");
        expect(test.dot(test2)).toEqual(new SignificantNumber_1.SignificantNumber(52));
    });
});
describe("usability", function () {
    it("should set", function () {
        test.radius = new SignificantNumber_1.SignificantNumber(2.7);
        expect(test.toCartesian()).toEqual({
            x: new SignificantNumber_1.SignificantNumber(2.5),
            y: new SignificantNumber_1.SignificantNumber("1.0")
        });
        test.radius = new SignificantNumber_1.SignificantNumber(5.4);
        test.theta = new SignificantNumber_1.SignificantNumber("2.0e+2");
        expect(test.toCartesian()).toEqual(Vector_1.Vector.FromPolar(5.4, new SignificantNumber_1.SignificantNumber("2.0e+2")));
        test.theta = new SignificantNumber_1.SignificantNumber("2.2e+1");
    });
    it("should normalize", function () {
        var test2 = Vector_1.Vector.FromPolar(15, "30.0");
        expect(test2.normalize()).toEqual(Vector_1.Vector.FromPolar(1, "30.0"));
    });
    it("should get", function () {
        expect(test.radius).toEqual(new SignificantNumber_1.SignificantNumber(5.4));
        expect(test.theta).toEqual(new SignificantNumber_1.SignificantNumber(22));
    });
    it("should copy", function () {
        expect(test.copy()).toEqual(test);
        expect(test.get()).toEqual(test);
    });
});
describe("creation", function () {
    it("should create with varying arguments", function () {
        expect(Vector_1.Vector.FromCartesian(new SignificantNumber_1.SignificantNumber(5, 2), "2.0")).toEqual(test);
        expect(Vector_1.Vector.FromCartesian(new SignificantNumber_1.SignificantNumber(5, 2), new SignificantNumber_1.SignificantNumber(2, 2))).toEqual(test);
        expect(Vector_1.Vector.FromCartesian("5.0", new SignificantNumber_1.SignificantNumber(2, 2))).toEqual(test);
        var test2 = Vector_1.Vector.FromPolar("5.0", "2.0");
        expect(Vector_1.Vector.FromPolar(new SignificantNumber_1.SignificantNumber(5, 2), "2.0")).toEqual(test2);
        expect(Vector_1.Vector.FromPolar(new SignificantNumber_1.SignificantNumber(5, 2), new SignificantNumber_1.SignificantNumber(2, 2))).toEqual(test2);
        expect(Vector_1.Vector.FromPolar("5.0", new SignificantNumber_1.SignificantNumber(2, 2))).toEqual(test2);
    });
});
