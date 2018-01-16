import {SignificantNumber} from "./SignificantNumber";

class Vector {
    public static ValidString (text: string): boolean {
        return !!text.match(/^\d*(\.\d*)?(e[+-]?\d+)?,\d*(\.\d*)?(e[+-]?\d+)?$/i);
    }

    public static FromCartesian (x: SignificantNumber | string | number,
        y: SignificantNumber | string | number): Vector {
        if (!(x instanceof SignificantNumber)) {
            x = new SignificantNumber(x);
        }
        if (!(y instanceof SignificantNumber)) {
            y = new SignificantNumber(y);
        }
        return new Vector(x, y);
    }

    public static FromPolar (r: SignificantNumber | string | number,
        t: SignificantNumber | string | number): Vector {
        if (!(r instanceof SignificantNumber)) {
            r = new SignificantNumber(r, 25);
        }
        if (!(t instanceof SignificantNumber)) {
            t = new SignificantNumber(t);
        }
        return new Vector (
            r.multiply(t.cos()),
            r.multiply(t.sin())
        );
    }

    get radius() : SignificantNumber {
        return this.x.copy().multiply(this.x).add(this.y.copy().multiply(this.y)).callFunc(Math.sqrt);
    }

    set radius(nr: SignificantNumber) {
        let theta: SignificantNumber = this.theta;
        this.x = nr.multiply(theta.cos());
        this.y = nr.multiply(theta.sin());
    }

    get theta() : SignificantNumber {
        return this.y.copy().divide(this.x).callFunc(Math.atan).multiply(180 / Math.PI);
    }

    set theta(nt: SignificantNumber) {
        let radius: SignificantNumber = this.radius;
        this.x = radius.multiply(nt.cos());
        this.y = radius.multiply(nt.sin());
    }

    private constructor (public x: SignificantNumber, public y: SignificantNumber) {}

    public toString () {
        return `${this.x},${this.y}`;
    }

    public multiply (num: SignificantNumber | number) : Vector {
        return new Vector(this.x.copy().multiply(num), this.y.copy().multiply(num));
    }

    public divide (num: SignificantNumber | number) : Vector {
        return new Vector(this.x.copy().divide(num), this.y.copy().divide(num));
    }

    public add (num: Vector) : Vector {
        return new Vector(this.x.copy().add(num.x), this.y.copy().add(num.y));
    }

    public sub (num: Vector) : Vector {
        return new Vector(this.x.copy().sub(num.x), this.y.copy().sub(num.y));
    }

    public normalize () : Vector {
        return Vector.FromPolar(1, this.theta);
    }

    public get () : Vector {
        return new Vector(this.x.copy(), this.y.copy());
    }

    public copy () : Vector { return this.get(); }

    public dot (vec: Vector) : SignificantNumber {
        return this.x.copy().multiply(vec.x).add(this.y.copy().multiply(vec.y));
    }

    public toPolar () : {radius: SignificantNumber, theta: SignificantNumber} {
        return {
            radius: this.radius,
            theta: this.theta
        };
    }

    public toCartesian () : {x: SignificantNumber, y: SignificantNumber} {
        return {
            x: this.x,
            y: this.y
        };
    }
}

export {Vector};
