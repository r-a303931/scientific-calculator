#!/usr/bin/env node

import Parser from "./Parser";
import SignificantNumber from "./SignificantNumber";
import Vector from "./Vector";

import {ArgumentParser} from "argparse";
import * as readline from "readline";
import chalk from "chalk";

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
        type: string,

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
        switch (vars[i].type) {
            case "SignificantNumber" :
                rvars[i] = new SignificantNumber(vars[i].value, vars[i].significance);
            break;

            case "Vector" :
                rvars[i] = Vector.FromCartesian(vars[i].x, vars[i].y);
            break;
        }
    }
}

const cliParser = new Parser(rvars);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const answer = (text: string): void => {
    if (text) {
        text = text.trim();
    }

    let result = cliParser.parse(text);
    console.log(result.toString());
    cliParser.parse("Ans = " + result.toString());


    rl.question("> ", answer);
};

rl.question("> ", answer);
