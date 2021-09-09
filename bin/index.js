#!/usr/bin/env node

const yargs = require("yargs");

const main = require('../src/main');


const run = async() => {

    const options = yargs
    .usage("Usage: -d <botdirectory> -e <endpoint> -s <subscriptionkey>")
    .option("d", { alias: "botdirectory", describe: "Your bot directory", type: "string", demandOption: true })
    .option("e", { alias: "endpoint", describe: "Your LUIS authoring endpoint", type: "string", demandOption: true })
    .option("s", { alias: "subscriptionkey", describe: "Your LUIS authoring subscription key", type: "string", demandOption: true })
    .argv;

    await main.run(options.botdirectory, options.endpoint, options.subscriptionkey)

    process.exit(0);
}

run()
