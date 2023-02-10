"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFromCsv = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const fast_csv_1 = require("fast-csv");
const potHeader = () => `#, fuzzy
msgid ""
msgstr ""
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=utf-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
`;
const poHeader = (locale) => `msgid ""
msgstr ""
"Last-Translator: Automatically generated\\n"
"Language-Team: none\\n"
"Language: ${locale}\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
`;
const entry = (id, str) => `
msgid "${id}"
msgstr "${str}"
`;
const escape = (input) => input
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("\t", "\\t")
    .replaceAll("\r\n", "\n");
const convertMsgstr = (input) => {
    let output = escape(input);
    if (output.indexOf("\n") >= 0) {
        output = ['"'].concat(output.split("\n").join('\\n"\n"')).join('\n"');
    }
    return output;
};
async function convertFromCsv(src, dest, options = { template: true }) {
    const base = process.cwd();
    const srcFile = path_1.default.resolve(base, src);
    const destDir = dest ? path_1.default.resolve(base, dest) : path_1.default.dirname(src);
    const potFile = path_1.default.join(destDir, "messages.pot");
    let potStream;
    const poStreams = {};
    await (0, promises_1.mkdir)(destDir, { recursive: true });
    function writePot(msgid) {
        if (!potStream) {
            potStream = (0, fs_1.createWriteStream)(potFile);
            potStream.write(potHeader());
        }
        potStream.write(entry(msgid, ""));
    }
    function writePo(locale, msgid, msgstr) {
        let stream = poStreams[locale];
        if (!stream) {
            const file = path_1.default.join(destDir, `${locale}.po`);
            stream = (0, fs_1.createWriteStream)(file);
            stream.write(poHeader(locale));
            poStreams[locale] = stream;
        }
        stream.write(entry(msgid, msgstr));
    }
    function convertRow(row) {
        let msgid;
        let sourcestr;
        for (let locale in row) {
            if (locale.length === 0) {
                msgid = row[locale];
                continue;
            }
            const msgstr = convertMsgstr(row[locale]);
            if (locale === options.skipEqual) {
                sourcestr = msgstr;
            }
            else if (msgstr === sourcestr) {
                continue;
            }
            if (msgid?.length && msgstr?.length && options.templateOnly !== true) {
                writePo(locale, msgid, msgstr);
            }
        }
        if (msgid?.length && options.template !== false) {
            writePot(msgid);
        }
    }
    return new Promise((resolve, reject) => {
        (0, fs_1.createReadStream)(srcFile)
            .pipe((0, fast_csv_1.parse)({ headers: true }))
            .on("data", convertRow)
            .on("error", reject)
            .on("end", (rows) => resolve(rows));
    });
}
exports.convertFromCsv = convertFromCsv;
