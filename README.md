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
$ gettextcsv --help
```

Show instructions for a specific command:

```bash
$ gettextcsv <command> --help
```

## Usage

Currently the tool only supports conversions from `CSV` to `gettext`.

### `gettextcsv from_csv <source> [destination]`

Use this command to convert a CSV `<source>` file to a `messages.pot` and multiple `.po` files (one per locale) at `[destination]`. If no `[destination]` is provided, the output files will be created in the current working directory.

#### Options

##### `--skip-equal <locale>`

With this option, all message strings that are equal to the corresponding string from `<locale>` (e.g. `en`) will be omitted when generating `.po` file for other locales. Make sure that you provide the same locale that is used as the `fallback_locale` in your Godot project settings. Using this option is recommended.

#### `--no--template`

The tool will only generate `.po` files and skip the `messages.pot` file if enabled.

#### `--template--only`

The opposite of the previous option. If enabled, only the `messages.pot` file will be generated.
