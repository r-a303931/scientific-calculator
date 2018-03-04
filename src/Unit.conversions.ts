export interface UnitConverter {
    from: string;
    to: string;
    value: number;
}

export default [
    {
        from: "m",
        to: "ft",
        value: 1 / 3.28084
    },
    {
        from: "hr",
        to: "s",
        value: 1 / 3600
    },
    {
        from: "cm",
        to: "m",
        value: 100
    },
    {
        from: "lbs",
        to: "kg",
        value: 0.453592
    },
    {
        from: "mm",
        to: "cm",
        value: 1 / 10
    }
];

export const SIUnits: {
    [key: string]: string
} = {
    length: "m",
    time: "s",
    weight: "kg",
    volume: "L",
    temperature: "K",
    energy: "A",
    matter: "mol"
};
