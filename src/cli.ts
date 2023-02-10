import { program } from "commander";
import { convertFromCsv, ConvertFromCsvOptions } from "./fromCsv";

program
  .name("gettextcsv")
  .description("CLI for converting CSV to gettext and vice-versa");

program
  .command("from_csv")
  .argument("<source>", "path to source csv file")
  .argument("[destination]", "path to destination directory")
  .description("convert csv to gettext")
  .option("-s, --skip-equal <locale>", "omit messages equal to locale")
  .option("-n, --no-template", "do not generate the pot file")
  .option("-t, --template-only", "only generate the pot file")
  .action(
    async (
      src: string,
      dest: string | undefined,
      options: ConvertFromCsvOptions
    ) => {
      const rows = await convertFromCsv(src, dest, options);
      console.info("converted %d rows", rows);
    }
  );

program
  .command("to_csv")
  .description("convert gettext to csv")
  .action(() => program.error("not yet implemented"));

program.parse(process.argv);
