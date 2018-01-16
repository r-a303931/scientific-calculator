import {Parser} from "./Parser";
import {SignificantNumber} from "./SignificantNumber";
import {Vector} from "./Vector";

const parser: Parser = new Parser({});

describe ("basic math operations", () => {
    it ("should exponentiate properly", () => {
        expect(parser.parse("2 ^ 2")).toEqual(new SignificantNumber(4));
    });

    it ("should use parenthesis properly", () => {
        expect(parser.parse("2 ^ (2 ^ 2)")).toEqual(new SignificantNumber(16, 1));
    });

    it ("should multiply and divide from left to right", () => {
        expect(parser.parse("2.0 * 3.0 / 4.0")).toEqual(new SignificantNumber(1.5));
    });

    it ("should add and subtract from left to right", () => {
        expect(parser.parse("2 + 3 - 4")).toEqual(new SignificantNumber(1));
    });

    it ("should fail on an invalid expression", () => {
        expect(() => {
            console.log(parser.parse("2 ** 3"));
        }).toThrow(SyntaxError);
    });
});

describe ("variable operations", () => {
    it ("should store integer variables", () => {
        expect(parser.parse("x = 5")).toEqual(new SignificantNumber(5));
        expect(parser.variables.x).toEqual(new SignificantNumber(5));
    });

    it ("should operate on integer variables", () => {
        parser.variables.x = new SignificantNumber(5);
        expect(parser.parse("5 + x")).toEqual(new SignificantNumber(10));
    });

    it ("should store vector variables", () => {
        expect(parser.parse("y = 2,3")).toEqual(Vector.FromCartesian(2, 3));
    });

    it ("should operate on vector variables", () => {
        parser.variables.y = Vector.FromCartesian(2, 3);
        expect(parser.parse("y + 3,2")).toEqual(Vector.FromCartesian(5, 5));
    });

    it ("should return the variable", () => {
        parser.variables.x = new SignificantNumber(5);
        expect(parser.parse("x")).toEqual(new SignificantNumber(5));
    });
});

describe ("vector handling", () => {
    it ("should reject adding integers and vectors", () => {
        expect(() => {
            parser.parse("3,2 + 5");
        }).toThrow();

        expect(() => {
            parser.parse("5 + 3,2");
        }).toThrow();
    });

    it ("should reject subtracting integers and vectors", () => {
        expect(() => {
            parser.parse("3,2 - 5");
        }).toThrow();

        expect(() => {
            parser.parse("5 - 3,2");
        }).toThrow();
    });

    it ("should divide a vector by a scalar", () => {
        expect(parser.parse("2,2 / 2")).toEqual(Vector.FromCartesian(1, 1));
    });

    it ("should multiply a vector by a scalar", () => {
        expect(parser.parse("1,1 * 2")).toEqual(Vector.FromCartesian(2, 2));
        expect(parser.parse("2 * 1,1")).toEqual(Vector.FromCartesian(2, 2));
    });

    it ("should subtract two vectors", () => {
        expect(parser.parse("2,2 - 4,3")).toEqual(Vector.FromCartesian(-2, -1));
    });

    it ("should subtract add vectors", () => {
        expect(parser.parse("2,2 + 4,3")).toEqual(Vector.FromCartesian(6, 5));
    });

    it ("should not a scalar by a vector", () => {
        expect(() => {
            parser.parse("1 / 2,2");
        }).toThrow();
    });

    it ("should not divide two vectors together", () => {
        expect(() => {
            parser.parse("2,2 / 1,5");
        }).toThrow();
    });

    it ("should not multiply two vectors together", () => {
        expect(() => {
            parser.parse("2,2 * 1,5");
        }).toThrow();
    });
});
