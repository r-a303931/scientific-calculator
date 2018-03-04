import Vector from "./Vector";
import SignificantNumber from "./SignificantNumber";

let test: Vector = Vector.FromCartesian("5.0", "2.0");

describe ("calculations", () => {
    it ("should convert to polar", () => {
        expect(test.toPolar()).toEqual({
            radius: new SignificantNumber(5.4),
            theta: new SignificantNumber(22)
        });
    });

    it ("should calculate the dot product", () => {
        let test2: Vector = Vector.FromCartesian("1.0e+1", "1.0");
        expect(test.dot(test2)).toEqual(new SignificantNumber(52));
    });
});

describe("usability", () => {
    it ("should set", () => {
        test.radius = new SignificantNumber(2.7);
        expect(test.toCartesian()).toEqual({
            x: new SignificantNumber(2.5),
            y: new SignificantNumber("1.0")
        });
        test.radius = new SignificantNumber(5.4);

        test.theta = new SignificantNumber("2.0e+2");
        expect(test.toCartesian()).toEqual(Vector.FromPolar(5.4, new SignificantNumber("2.0e+2")));
        test.theta = new SignificantNumber("2.2e+1");
    });

    it ("should normalize", () => {
        let test2: Vector = Vector.FromPolar(15, "30.0");

        expect(test2.normalize()).toEqual(Vector.FromPolar(1, "30.0"));
    });

    it ("should get", () => {
        expect(test.radius).toEqual(new SignificantNumber(5.4));
        expect(test.theta).toEqual(new SignificantNumber(22));
    });

    it ("should copy", () => {
        expect(test.copy()).toEqual(test);
        expect(test.get()).toEqual(test);
    });
});

describe ("creation", () => {
    it ("should create with varying arguments", () => {
        expect(Vector.FromCartesian(new SignificantNumber(5, 2), "2.0")).toEqual(test);
        expect(Vector.FromCartesian(new SignificantNumber(5, 2), new SignificantNumber(2, 2))).toEqual(test);
        expect(Vector.FromCartesian("5.0", new SignificantNumber(2, 2))).toEqual(test);

        let test2: Vector = Vector.FromPolar("5.0", "2.0");

        expect(Vector.FromPolar(new SignificantNumber(5, 2), "2.0")).toEqual(test2);
        expect(Vector.FromPolar(new SignificantNumber(5, 2), new SignificantNumber(2, 2))).toEqual(test2);
        expect(Vector.FromPolar("5.0", new SignificantNumber(2, 2))).toEqual(test2);
    });
});
