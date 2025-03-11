#! /usr/bin/env node

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { confirm, intro, isCancel, log, outro, spinner } from '@clack/prompts';
import { bgBlue, bgRed } from 'kleur/colors';
import { parseCmdArgs } from './cli/parse-cmd-args.js';
import { generateCommand } from './command/generate.js';
import { showHelp } from './command/help.js';
import { init } from './command/init.js';

const asyncExec = promisify(exec);

const { values, positionals } = parseCmdArgs(process.argv.splice(2));

// console.debug('parse args:', { values, positionals });

if (values.help) {
	console.log(showHelp());
	process.exit();
}

if (values.init) {
	await init();
}

intro(bgBlue('BashGenie: Start'));

const loader = spinner({ indicator: 'dots' });
loader.start('Thinking...');
const { object, usage } = await generateCommand(positionals);
loader.stop(object.command);

if (values.explain) {
	log.step(`${bgBlue('EXPLANATION:')}\n${object.explaination}`);
}

if (values.verbose) {
	log.step(
		`${bgBlue('USAGE:')}\npromptTokens=${usage.promptTokens}, completionTokens=${usage.completionTokens}, totalTokens=${usage.totalTokens}`,
	);
}

if (values.exec) {
	const executeCommand = await confirm({
		message: bgRed('Do you want to execute the command? (Are you sure?)'),
		initialValue: false,
	});
	if (isCancel(executeCommand) || !executeCommand) {
		outro(bgBlue('BashGenie: Completed'));
		process.exit();
	}
	outro(bgBlue('BashGenie: Completed. Command launched. (Good luck)'));

	try {
		const result = await asyncExec(`${object.command}`);
		console.log(`${result.stdout}`);
		console.error(`${result.stderr}`);
	} catch (error) {
		console.error(`exec error: ${error}`);
	}
}
