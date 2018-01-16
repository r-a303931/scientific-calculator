import {Parser} from "./Parser";
import {SignificantNumber} from "./SignificantNumber";

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
});
