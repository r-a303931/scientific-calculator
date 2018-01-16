function precisionRound(number: number, precision: number): number {
    var factor: number = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

class SignificantNumber {
    public value: number;
    public significance: number;

    public static UseSignificance: boolean = true;
    public static UseDegrees: boolean = true;

    public static FromExponential (text: string): SignificantNumber {
        return new SignificantNumber(text);
    }

    public static ValidString (text: string): boolean {
        return !!text.match(/^\-?\d*(\.\d*)?(e[+-]?\d+)?$/i);
    }

    constructor (value: number | string, significance?: number) {
        if (typeof value === "string" && !(value as String).match(/^\-?\d*(\.\d*)?(e[+-]?\d+)?$/i)) {
            throw new TypeError(`Exponential "${value}" should be of the form: X.YZeW, where X, Y, Z, and W are numbers`);
        }
        let tstr: string = value.toString();
        let trailingZeros: number = 0;
        if (tstr.indexOf(".") > -1) {
            let result: RegExpMatchArray = tstr.split("e")[0].match(/0+$/);
            trailingZeros = result === null ? 0 : result[0].length;
        }
        this.value = (typeof value === "string" ? parseFloat(value) : value as number);
        let temp: number = this.value;
        if (significance) {
            this.significance = significance;
            if (SignificantNumber.UseSignificance) {
                let exp: number = parseFloat(temp.toExponential().split("e")[0]) / 10;
                let pow: number = parseInt(temp.toExponential().split("e")[1], 10);
                exp = precisionRound(exp, significance);
                this.value = exp * 10 ** (pow + 1);
            }
        } else {
            let part: string = this.value.toExponential().split("e")[0].replace('-', '');
            if (part.indexOf(".") === -1) {
                this.significance = 1 + trailingZeros;
            } else {
                this.significance = part.length - 1 + trailingZeros;
            }
        }
    }

    public add (num: SignificantNumber | number): SignificantNumber {
        let val = num instanceof SignificantNumber ? num.value : num;
        return new SignificantNumber (val + this.value,
            Math.min(this.significance, num instanceof SignificantNumber ? num.significance : Infinity));
    }

    public sub (num: SignificantNumber | number): SignificantNumber {
        let val = num instanceof SignificantNumber ? num.value : num;
        return new SignificantNumber (this.value - val,
            Math.min(this.significance, num instanceof SignificantNumber ? num.significance : Infinity));
    }

    public multiply (num: SignificantNumber | number) : SignificantNumber {
        let val = num instanceof SignificantNumber ? num.value : num;
        return new SignificantNumber (val * this.value,
            Math.min(this.significance, num instanceof SignificantNumber ? num.significance : Infinity));
    }

    public divide (num: SignificantNumber | number) : SignificantNumber {
        let val = num instanceof SignificantNumber ? num.value : num;
        return new SignificantNumber (this.value / val,
            Math.min(this.significance, num instanceof SignificantNumber ? num.significance : Infinity));
    }

    public power (num: SignificantNumber | number) : SignificantNumber {
        return new SignificantNumber (Math.pow(this.value, num as number),
            Math.min(this.significance, num instanceof SignificantNumber ? num.significance : Infinity));
    }

    public sin (): SignificantNumber {
        if (!SignificantNumber.UseDegrees) {
            return new SignificantNumber(Math.sin(this.value), this.significance);
        } else {
            return new SignificantNumber(Math.sin(Math.PI / 180 * this.value), this.significance);
        }
    }

    public cos (): SignificantNumber {
        if (!SignificantNumber.UseDegrees) {
            return new SignificantNumber(Math.cos(this.value), this.significance);
        } else {
            return new SignificantNumber(Math.cos(Math.PI / 180 * this.value), this.significance);
        }
    }

    public tan (): SignificantNumber {
        if (!SignificantNumber.UseDegrees) {
            return new SignificantNumber(Math.tan(this.value), this.significance);
        } else {
            return new SignificantNumber(Math.tan(Math.PI / 180 * this.value), this.significance);
        }
    }

    public callFunc (func: (args: number) => number): SignificantNumber {
        return new SignificantNumber(func(this.value), this.significance);
    }

    public copy (): SignificantNumber {
        return new SignificantNumber(this.value, this.significance);
    }

    public valueOf (): number {
        return this.value;
    }

    public toString (): string {
        let trailingZeros: number = this.significance - (new SignificantNumber(this.value)).significance;
        let exp: string = this.value.toExponential(), exp2: string = "";
        let tstr: string = "";
        for (var i = 0; i < trailingZeros; i++) {
            tstr += "0";
        }
        exp2 = exp.slice(0, exp.indexOf("e"));
        if (exp2.length === 1 && tstr.length !== 0) {
            exp2 += ".";
        }
        exp2 += tstr + exp.slice(exp.indexOf("e"));
        return exp2;
    }
}

export {SignificantNumber};
