import SignificantNumber from "./SignificantNumber";

describe ("significant number parser", () => {
    it ("should parse decimals for significance", () => {
        let num1: SignificantNumber = new SignificantNumber("12.340");
        expect(num1.significance).toBe(5);
    });

    it ("should parse tiny decimals for significance", () => {
        let num2: SignificantNumber = new SignificantNumber(0.000123);
        expect(num2.significance).toBe(3);
    });

    it ("should parse integers for significance", () => {
        let num3: SignificantNumber = new SignificantNumber(1200);
        expect(num3.significance).toBe(2);
    });

    it ("should parse decimals with a given significance", () => {
        let num4: SignificantNumber = new SignificantNumber("12.340", 2);
        expect(num4.value).toBe(12);
    });

    it ("should parse integers with a given significance", () => {
        let num5: SignificantNumber = new SignificantNumber(12345, 2);
        expect(num5.value).toBe(12000);
    });

    it ("should parse tiny decimals with a given significance", () => {
        let num6: SignificantNumber = new SignificantNumber(0.0001234, 2);
        expect(num6.value).toBe(0.00012);
    });

    it ("should parse exponential forms", () => {
        let num7: SignificantNumber = new SignificantNumber("1.230e+4");
        expect(num7.value).toBe(12300);
    });

    it ("should parse exponential forms with zeros", () => {
        let num8: SignificantNumber = new SignificantNumber("1.00e+4");
        expect(num8.value).toBe(10000);
        expect(num8.significance).toBe(3);
    });

    it ("should fail to parse invalid exponential forms", () => {
        expect(() => {
            let num9: SignificantNumber = new SignificantNumber("not a number");
        }).toThrow();
    });
});

describe ("significant number operations", () => {
    it ("should add significantly", () => {
        let num1: SignificantNumber = new SignificantNumber(123);
        let num2: SignificantNumber = new SignificantNumber(50);
        let num3: SignificantNumber = num1.add(num2);

        expect(num3.value).toBe(200);
        expect(num3.significance).toBe(1);
    });

    it ("should subtract significantly", () => {
        let num1: SignificantNumber = new SignificantNumber(123);
        let num2: SignificantNumber = new SignificantNumber(50);
        let num3: SignificantNumber = num1.sub(num2);

        expect(num3.value).toBe(70);
        expect(num3.significance).toBe(1);
    });

    it ("should multiply significantly", () => {
        let num1: SignificantNumber = new SignificantNumber(123);
        let num2: SignificantNumber = new SignificantNumber(50, 2);
        let num3: SignificantNumber = num1.multiply(num2);

        expect(num3.value).toBe(6200);
        expect(num3.significance).toBe(2);
    });

    it ("should divide significantly", () => {
        let num1: SignificantNumber = new SignificantNumber(123);
        let num2: SignificantNumber = new SignificantNumber(50, 2);
        let num3: SignificantNumber = num1.divide(num2);

        expect(num3.value).toBe(2.5);
        expect(num3.significance).toBe(2);
    });

    it ("should add significantly with integers", () => {
        let num1: SignificantNumber = new SignificantNumber(123);
        let num3: SignificantNumber = num1.add(50);

        expect(num3.value).toBe(173);
        expect(num3.significance).toBe(3);
    });

    it ("should subtract significantly with integers", () => {
        let num1: SignificantNumber = new SignificantNumber(123);
        let num3: SignificantNumber = num1.sub(50);

        expect(num3.value).toBe(73);
        expect(num3.significance).toBe(3);
    });

    it ("should multiply significantly with integers", () => {
        let num1: SignificantNumber = new SignificantNumber(123);
        let num3: SignificantNumber = num1.multiply(50);

        expect(num3.value).toBe(6150);
        expect(num3.significance).toBe(3);
    });

    it ("should divide significantly with integers", () => {
        let num1: SignificantNumber = new SignificantNumber(123);
        let num3: SignificantNumber = num1.divide(50);

        expect(num3.value).toBe(2.46);
        expect(num3.significance).toBe(3);
    });

    it ("should be raisable to a power", () => {
        let num1: SignificantNumber = new SignificantNumber("2.0000");
        let num3: SignificantNumber = new SignificantNumber(10);

        expect(num1.power(3)).toEqual(new SignificantNumber("8.0000"));
        expect(num1.power(num3)).toEqual(new SignificantNumber(1000));
    });
});

describe ("disabling significance", () => {
    it ("should be able to disable use of significance", () => {
        SignificantNumber.UseSignificance = false;

        let num1: SignificantNumber = new SignificantNumber(123456789);
        let num2: SignificantNumber = new SignificantNumber(120000000);
        let num3: SignificantNumber = num1.add(num2);
        expect(num3.value).toBe(120000000 + 123456789);

        SignificantNumber.UseSignificance = true;
    });
});

describe ("exporting values", () => {
    it ("should preserve significance in .toString()", () => {
        let num1: SignificantNumber = new SignificantNumber("1.00000000000000000000");
        expect(num1.toString()).toBe("1.00000000000000000000e+0");
    });
});


describe ("use with other math functions", () => {
    let num1: SignificantNumber = new SignificantNumber("45.0");

    it ("should be possible to use trig", () => {
        expect(num1.sin()).toEqual(new SignificantNumber(0.707));

        expect(num1.cos()).toEqual(new SignificantNumber(0.707));

        expect(num1.tan()).toEqual(new SignificantNumber("1.00"));
    });

    let num2: SignificantNumber = new SignificantNumber(Math.PI, 7);

    it ("should be possible to use trig in radian mode", () => {
        SignificantNumber.UseDegrees = false;

        expect(num2.sin().value).toBeCloseTo(0, 5);
        expect(num2.sin().significance).toBe(7);

        expect(num2.cos().value).toBeCloseTo(-1, 5);
        expect(num2.cos().significance).toBe(7);

        expect(num2.tan().value).toBeCloseTo(0, 5);
        expect(num2.tan().significance).toBe(7);

        SignificantNumber.UseDegrees = true;
    });
});
