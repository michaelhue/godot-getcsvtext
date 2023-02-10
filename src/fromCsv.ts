import path from "path";
import { createReadStream, createWriteStream, WriteStream } from "fs";
import { mkdir } from "fs/promises";
import { parse } from "fast-csv";

const potHeader = () => `#, fuzzy
msgid ""
msgstr ""
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=utf-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
`;

const poHeader = (locale: string) => `msgid ""
msgstr ""
"Last-Translator: Automatically generated\\n"
"Language-Team: none\\n"
"Language: ${locale}\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
`;

const entry = (id: string, str: string) => `
msgid "${id}"
msgstr "${str}"
`;

const escape = (input: string) =>
  input
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("\t", "\\t")
    .replaceAll("\r\n", "\n");

const convertMsgstr = (input: string) => {
  let output = escape(input);

  if (output.indexOf("\n") >= 0) {
    output = ['"'].concat(output.split("\n").join('\\n"\n"')).join('\n"');
  }

  return output;
};

export interface ConvertFromCsvOptions {
  readonly template?: boolean;
  readonly templateOnly?: boolean;
  readonly skipEqual?: string;
}

export async function convertFromCsv(
  src: string,
  dest: string | undefined,
  options: ConvertFromCsvOptions = { template: true }
): Promise<number> {
  const base = process.cwd();
  const srcFile = path.resolve(base, src);
  const destDir = dest ? path.resolve(base, dest) : path.dirname(src);
  const potFile = path.join(destDir, "messages.pot");

  let potStream: WriteStream;
  const poStreams: Record<string, WriteStream> = {};

  await mkdir(destDir, { recursive: true });

  function writePot(msgid: string) {
    if (!potStream) {
      potStream = createWriteStream(potFile);
      potStream.write(potHeader());
    }

    potStream.write(entry(msgid, ""));
  }

  function writePo(locale: string, msgid: string, msgstr: string) {
    let stream = poStreams[locale];

    if (!stream) {
      const file = path.join(destDir, `${locale}.po`);

      stream = createWriteStream(file);
      stream.write(poHeader(locale));

      poStreams[locale] = stream;
    }

    stream.write(entry(msgid, msgstr));
  }

  function convertRow(row: Record<string, string>) {
    let msgid: string | undefined;
    let sourcestr: string | undefined;

    for (let locale in row) {
      if (locale.length === 0) {
        msgid = row[locale];
        continue;
      }

      const msgstr = convertMsgstr(row[locale]);

      if (locale === options.skipEqual) {
        sourcestr = msgstr;
      } else if (msgstr === sourcestr) {
        continue;
      }

      if (msgid && msgstr && options.templateOnly !== true) {
        writePo(locale, msgid, msgstr);
      }
    }

    if (msgid && options.template !== false) {
      writePot(msgid);
    }
  }

  return new Promise((resolve, reject) => {
    createReadStream(srcFile)
      .pipe(parse({ headers: true }))
      .on("data", convertRow)
      .on("error", reject)
      .on("end", (rows: number) => resolve(rows));
  });
}
