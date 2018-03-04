import SignificantNumber from "./SignificantNumber";

import Conversions from "./Unit.conversions";

interface UnitConverterList {
    [key: string]: {
        to: string,
        value: number
    }[];
}

export default class Unit {
    static CONVERSION_DEPTH = 1;

    public unitArray: string[][];

    public conversions: UnitConverterList;

    get unit (): string {
        let unit1 = this.unitArray[0];
        let unit2 = this.unitArray[1];
        let ret1 = "";
        let ret2 = "";
        for (let i of unit1) {
            ret1 += `${i}*`;
        }
        if (ret2.length === 0) {
            return ret1;
        }
        for (let i of unit2) {
            ret2 += `${i}*`;
        }

        return `${ret1.replace(/\*$/, "")}/${ret2.replace(/\*$/, "")}`;
    }

    public static FromString (unit: string): Unit {
        return new Unit(unit);
    }

    constructor(unit: string | string[] | string[][]) {
        if (unit instanceof Array && unit[0] instanceof Array) {
            this.unitArray = unit as string[][];
        } else if (unit instanceof Array) {
            this.unitArray = [
                unit as string[]
            ];
        } else {
            let parts: string[] = unit.split(/\s*\/\s*/);
            let unitArray: string[][] = [];
            let uparts: string[] = [];
			uparts = parts[0].split(/\s*\*\s*/);
			unitArray.push(uparts);
			if (parts.length === 2) {
				uparts = parts[1].split(/\s*\*\s*/);
				unitArray.push(uparts);
			} else {
                unitArray.push([]);
            }
			this.unitArray = unitArray;
        }

        for (let i = this.unitArray[0].length - 1; i >= 0; i--) {
            if (this.unitArray[1].lastIndexOf(this.unitArray[0][i]) > -1) {
                this.unitArray[0].splice(i, 1);
                this.unitArray[1].splice(this.unitArray[0].lastIndexOf(this.unitArray[1][i]), 1);
            }
        }
        for (let i = this.unitArray[1].length - 1; i >= 0; i--) {
            if (this.unitArray[0].lastIndexOf(this.unitArray[1][i]) > -1) {
                this.unitArray[0].splice(this.unitArray[0].lastIndexOf(this.unitArray[1][i]), 1);
                this.unitArray[1].splice(i, 1);
            }
        }

        this.conversions = {};
        // for (let i of Conversions) {
        //     if (this.unitArray[0].indexOf(i.from) > -1 || this.unitArray[1].indexOf(i.to) > -1) {
        //         if (!this.conversions[i.from]) {
        //             this.conversions[i.from] = [];
        //         }
        //         this.conversions[i.from].push({
        //             to: i.to,
        //             value: i.value
        //         });
        //     } else if (this.unitArray[1].indexOf(i.from) > -1 || this.unitArray[0].indexOf(i.to) > -1) {
        //         if (!this.conversions[i.to]) {
        //             this.conversions[i.to] = [];
        //         }
        //         this.conversions[i.to].push({
        //             to: i.from,
        //             value: 1 / i.value
        //         });
        //     }
        // }
        for (let i of this.unitArray[0]) {
            let conv: UnitConverterList = this.getConversions(i);
            for (let j in conv) {
                if (conv.hasOwnProperty(j)) {
                    if (!this.conversions[j]) {
                        this.conversions[j] = [];
                    }
                    for (let k of conv[j]) {
                        this.conversions[j].push(k);
                    }
                }
            }
        }
        for (let i of this.unitArray[1]) {
            let conv: UnitConverterList = this.getConversions(i, false);
            for (let j in conv) {
                if (conv.hasOwnProperty(j)) {
                    if (!this.conversions[j]) {
                        this.conversions[j] = [];
                    }
                    for (let k of conv[j]) {
                        this.conversions[j].push(k);
                    }
                }
            }
        }
    }

    protected getConversions (unit: string, top: boolean = true, depth: number = 0): UnitConverterList {
        let ret: UnitConverterList = {[unit]: []};

        if (depth > Unit.CONVERSION_DEPTH) {
            return ret;
        }

        for (let i of Conversions) {
            if (i.from === unit) {
                 ret[unit].push({
                    to: i.to,
                    value: top ? i.value : 1 / i.value
                 });
                let conv: UnitConverterList = this.getConversions(i.to, true, depth + 1);
                for (let j in conv) {
                    if (conv.hasOwnProperty(j)) {
                        if (!ret[j]) {
                            ret[j] = [];
                        }
                        for (let k of conv[j]) {
                            ret[j].push({
                                to: k.to,
                                value: k.value * (top ? 1 / i.value : i.value)
                            });
                        }
                    }
                }
            } else if (i.to === unit) {
                ret[unit].push({
                    to: i.from,
                    value: top ? 1 / i.value : i.value
                });
                let conv: UnitConverterList = this.getConversions(i.to, false, depth + 1);
                for (let j in conv) {
                    if (conv.hasOwnProperty(j)) {
                        if (!ret[j]) {
                            ret[j] = [];
                        }
                        for (let k of conv[j]) {
                            ret[j].push({
                                to: k.to,
                                value: k.value * (top ? 1 / i.value : i.value)
                            });
                        }
                    }
                }
            }
        }

        return ret;
    }

    public convert(num: SignificantNumber, to: Unit): SignificantNumber {
        if (!this.canConvertTo(to)) {
            throw new TypeError(`Cannot convert from ${this.unit} to ${to.unit}`);
        }

        return null;
    }

    public invert(): Unit {
        let unit1 = this.unitArray[0];
        let unit2 = this.unitArray[1];
        let ret1 = "";
        let ret2 = "";
        for (let i of unit1) {
            ret1 += `${i}*`;
        }
        if (ret2.length === 0) {
            return new Unit(`1/${ret1}`);
        }
        for (let i of unit2) {
            ret2 += `${i}*`;
        }

        return new Unit(`${ret2.replace(/\*$/, "")}/${ret1.replace(/\*$/, "")}`);
    }

    public standardize(): Unit {

        return null;
    }

    public canConvertTo(to: Unit): boolean {

        return null;
    }

    public map (): string[][] {

        return null;
    }
}
