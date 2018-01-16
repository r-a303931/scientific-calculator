#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Parser_1 = require("./Parser");
var argparse_1 = require("argparse");
var SignificantNumber_1 = require("./SignificantNumber");
var argparse = new argparse_1.ArgumentParser({
    version: "0.2.0",
    addHelp: true,
    description: "A CLI calculator"
});
(function () {
    argparse.addArgument(["-V", "--variables"], {
        help: "File to save variables to and read variables from for saving states"
    });
})();
var args = argparse.parseArgs();
var vars;
if (args.variables) {
    vars = require(args.variables);
}
else {
    vars = require("../variables.json");
}
var rvars = {};
for (var i in vars) {
    if (vars.hasOwnProperty(i)) {
        rvars[i] = new SignificantNumber_1.SignificantNumber(vars[i].value, vars[i].significance);
    }
}
var cliParser = new Parser_1.Parser(rvars);
