import Unit from "./Unit";
import SignificantNumber from "./SignificantNumber";
import Vector from "./Vector";
import Variable from "./Variable";

export default class Expression {
    public unit: Unit;
    public vars: Variable[];

    constructor (protected text: string) {

    }
}
