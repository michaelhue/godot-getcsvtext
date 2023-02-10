"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fromCsv_1 = require("./fromCsv");
commander_1.program
    .name("gettextcsv")
    .description("CLI for converting CSV to gettext and vice-versa");
commander_1.program
    .command("from_csv")
    .argument("<source>", "path to source csv file")
    .argument("[destination]", "path to destination directory")
    .description("convert csv to gettext")
    .option("-s, --skip-equal <locale>", "omit messages equal to locale")
    .option("-n, --no-template", "do not generate the pot file")
    .option("-t, --template-only", "only generate the pot file")
    .action(async (src, dest, options) => {
    const rows = await (0, fromCsv_1.convertFromCsv)(src, dest, options);
    console.info("converted %d rows", rows);
});
commander_1.program
    .command("to_csv")
    .description("convert gettext to csv")
    .action(() => commander_1.program.error("not yet implemented"));
commander_1.program.parse(process.argv);
