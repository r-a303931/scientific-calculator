#!/usr/bin/env node

import {Parser} from "./Parser";
import {ArgumentParser} from "argparse";
import {SignificantNumber} from "./SignificantNumber";
import {Vector} from "./Vector";

var argparse = new ArgumentParser({
    version: "0.2.0",
    addHelp: true,
    description: "A CLI calculator"
});
(function () {
    argparse.addArgument(
        ["-V", "--variables"],
        {
            help: "File to save variables to and read variables from for saving states"
        }
    );
})();
var args = argparse.parseArgs();

let vars: {
    [key: string]: {
        value?: number,
        significance?: number,

        x? : number,
        y? : number
    }
};
if (args.variables) {
    vars = require(args.variables);
} else {
    vars = require("../variables.json");
}
let rvars: {[key: string]: SignificantNumber | Vector} = {};
for (var i in vars) {
    if (vars.hasOwnProperty(i)) {
        rvars[i] = new SignificantNumber(vars[i].value, vars[i].significance);
    }
}

const cliParser = new Parser(rvars);
