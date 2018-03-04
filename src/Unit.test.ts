import Unit from "./Unit";

describe ("construction of a unit", () => {
    it ("should parse units", () => {
        expect(new Unit ("m * kg / s").unitArray).toEqual([
            ["m", "kg"],
            ["s"]
        ]);
        expect(new Unit ("m * kg").unitArray).toEqual([
            ["m", "kg"],
            []
        ]);
        expect(new Unit ("1 / m * kg").unitArray).toEqual([
            ["1"],
            ["m", "kg"]
        ]);
    });

    it ("should parse units for conversions", () => {
        let unit = new Unit ("m * kg / s");
        expect(new Unit("m * kg / s").conversions).toEqual({
            "m": [
                {
                    to: "ft",
                    value: 1 / 3.28084
                },
                {
                    to: "cm",
                    value: 100
                },
                {
                    to: "mm",
                    value: 1000
                }
            ],
            "kg": [
                {
                    to: "lbs",
                    value: 1 / 0.453592
                }
            ],
            "s": [
                {
                    to: "hr",
                    value: 3600
                }
            ]
        });
    });
});
