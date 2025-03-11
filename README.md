# BashGenie

BashGenie is a command-line tool that leverages AI to convert your natural language questions into precise CLI commands. Simply ask a question, and let the AI generate the appropriate command for you.

## Initial configuration
```sh
bashgenie --init
```

## Usage

```bash
bashgenie [OPTIONS] <YOUR QUESTION>
```

**Options**

`-h, --help`
Show this help message and exit.

`-e, --explain`
Explain the generated command. This will provide a detailed breakdown of the command components and why they were selected.

`-v, --verbose`
Show additional information, such as token usage, to help understand the internal workings of the tool.

`--init`
Run the configuration wizard to set up the tool. Useful for first-time users or when you want to adjust settings.


# Feature

- [X] generate command from question
- [X] `init` command
- [X] `explain` command
- [X] `verbose` command (used token)
- [X] `help` command
- [ ] exec command (ask user confirmation)

# Resources

- https://hackernoon.com/publishing-a-nodejs-cli-tool-to-npm-in-less-than-15-minutes
- https://www.totaltypescript.com/how-to-create-an-npm-package
- https://blog.logrocket.com/building-typescript-cli-node-js-commander/#making-cli-globally-accessible
