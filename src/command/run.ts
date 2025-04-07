import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { confirm, intro, isCancel, log, outro, spinner } from '@clack/prompts';
import type { LanguageModelUsage } from 'ai';
import { bgBlue, bgRed } from 'kleur/colors';
import { generateCommand } from '../ai/ai.js';

export type RunOptions = {
	explain: boolean;
	verbose: boolean;
	exec: boolean;
};

const asyncExec = promisify(exec);

export async function run(question: string | string[], values: RunOptions) {
	intro(bgBlue('Welcome to BashGenie'));

	const loader = spinner({ indicator: 'dots' });
	loader.start('Thinking...');
	const { object, usage } = await generateCommand(question);
	loader.stop(object.command);

	if (values.explain) {
		log.step(`${bgBlue('EXPLANATION:')}\n${object.explaination}`);
	}

	if (values.verbose) {
		printVerbose(usage);
	}

	let toRun = false;

	if (values.exec) {
		const executeCommand = await confirm({
			message: bgRed('Do you want to execute the command? (Are you sure?)'),
			initialValue: false,
		});
		if (!isCancel(executeCommand) && executeCommand) {
			toRun = true;
		}
	}
	outro(
		toRun
			? bgBlue('BashGenie: Completed - Command running... (Good luck)')
			: bgBlue('BashGenie: Completed'),
	);

	if (toRun) {
		await runCommand(object.command);
	}
}

async function runCommand(command: string) {
	// TODO: Replace with spawn and streaming the output
	try {
		const result = await asyncExec(`${command}`);
		console.log(`${result.stdout}`);
		console.error(`${result.stderr}`);
	} catch (error) {
		console.error(`exec error: ${error}`);
	}
}

function printVerbose(usage: LanguageModelUsage) {
	log.step(
		`${bgBlue('USAGE:')}` +
			`\nPrompt Tokens = ${usage.promptTokens}` +
			`\nCompletion Tokens = ${usage.completionTokens}` +
			`\nTotal Tokens = ${usage.totalTokens}`,
	);
}
