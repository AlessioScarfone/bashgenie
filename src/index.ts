#! /usr/bin/env node

import { bgBlue } from 'kleur/colors';
import ora from 'ora';
import { parseCmdArgs } from './cli/parse-cmd-args.js';
import { generateCommand } from './command/generate.js';
import { showHelp } from './command/help.js';
import { init } from './command/init.js';

const { values, positionals } = parseCmdArgs(process.argv.splice(2));

// console.debug('parse args:', { values, positionals });

if (values.help) {
	console.log(showHelp());
	process.exit();
}

if (values.init) {
	await init();
}

const spinner = ora('Thinking...').start();
const { object, usage } = await generateCommand(positionals);
spinner.succeed(object.command);

if (values.explain) {
	console.log(`\n${bgBlue('EXPLAINATION:')}\n${object.explaination}`);
}

if (values.verbose) {
	console.log(
		`\n${bgBlue('USAGE:')}\npromptTokens=${usage.promptTokens}, completionTokens=${usage.completionTokens}, totalTokens=${usage.totalTokens}`,
	);
}
