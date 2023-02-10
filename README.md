# getcsvtext

> CLI for converting `CSV` translations to [`gettext`](https://www.gnu.org/software/gettext/) files for [Godot](https://godotengine.org).

## Requirements

This tool is created specifically for converting translations used in [Godot](https://godotengine.org) projects. The `CSV` file must conform to [Godot's translation format](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_translations.html#translation-format) for this tool to work.

The tool uses [NodeJS](https://nodejs.org) and is written in [TypeScript](https://www.typescriptlang.org), although TypeScript is not required to use it.

## Installation

Clone the repository and install dependencies:

```bash
$ git clone https://github.com/michaelhue/godot-getcsvtext.git
$ cd getcsvtext
$ npm install
```

Optionally, install the package globally to be able to use the `getcsvtext` command anywhere:

```bash
$ npm install -g .
```

After installation, you can run the tool by typing `path/to/bin/getcsvtext` in your terminal, or just `getcsvtext` if you installed the tool globally.

### Help

Show all commands:

```bash
$ getcsvtext --help
```

Show instructions for a specific command:

```bash
$ getcsvtext <command> --help
```

## Usage

Currently the tool only supports conversions from `CSV` to `gettext`.

### `getcsvtext from_csv <source> [destination]`

Use this command to convert a CSV `<source>` file to a `messages.pot` and multiple `.po` files (one per locale) at `[destination]`. If no `[destination]` is provided, the output files will be created in the current working directory. The tool will try to create the `[destination]` directory if it does not exist.

#### Options

##### `--skip-equal <locale>`

With this option, all message strings that are equal to the corresponding string from `<locale>` (e.g. `en`) will be omitted when generating `.po` files for other locales. Make sure that you provide the same locale that is used as the `fallback_locale` in your Godot project settings. Using this option is recommended.

#### `--template-file <file>`

Changes the name of the generated `.pot` file, which is `messages.pot` by default. `<file>` should include the file extension. Can also be used to generate the template in a different directory, relative to `[destination]`.

#### `--no-template`

Only generate `.po` files and skip the `messages.pot` file.

#### `--template-only`

Opposite of the previous option, only generate the `messages.pot` file.

#### Examples

Basic usage, read `translations.csv` and create gettext files in current directory:

```bash
$ getcsvtext from_csv translations.csv
```

Create gettext files in an `output` directory.

```bash
$ getcsvtext from_csv translations.csv output
```

When generating the `.po` files, omit all messages that are equal to the corresponding message in the `en` locale.

```bash
$ getcsvtext from_csv --skip-equal=en translations.csv output
```
