import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { confirm, intro, isCancel, log, outro, spinner } from '@clack/prompts';
import type { LanguageModelUsage } from 'ai';
import { bgBlue, bgRed, bgYellow } from 'kleur/colors';
import { type AIObjectSchema, generateCommand } from '../ai/ai.js';

export type RunOptions = {
	explain: boolean;
	verbose: boolean;
	exec: boolean;
	minimal: boolean;
};

const MAX_DANGER_LEVEL = 7;

export async function run(
	question: string | string[],
	options: RunOptions = {
		explain: false,
		verbose: false,
		exec: true,
		minimal: false,
	},
) {
	if (options.minimal) {
		const { object } = await generateCommand(question);
		console.log(object.command);
		return;
	} else {
		intro(bgBlue('Welcome to BashGenie'));

		const loader = spinner({ indicator: 'dots' });
		loader.start('Thinking...');
		const { object, usage } = await generateCommand(question);
		loader.stop(object.command);

		printAdditionalInformation(options, object, usage);

		const toRun = await askToRun(object, options);

		if (toRun) {
			await runCommand(object.command);
		}
	}
}

async function runCommand(command: string) {
	// TODO: Replace with spawn and streaming the output
	try {
		const asyncExec = promisify(exec);
		const result = await asyncExec(`${command}`);
		console.log(`${result.stdout}`);
		console.error(`${result.stderr}`);
	} catch (error) {
		console.error(`exec error: ${error}`);
	}
}

async function askToRun(
	aiObject: AIObjectSchema,
	options: RunOptions,
): Promise<boolean> {
	if (aiObject.danger >= MAX_DANGER_LEVEL) {
		log.error(bgRed('The generated command is dangerous'));
		return false;
	}
	let toRun = false;
	if (options.exec) {
		const confirmExecution = await confirm({
			message: bgRed('Do you want to execute the command? (Are you sure?)'),
			initialValue: false,
		});
		if (!isCancel(confirmExecution) && confirmExecution) {
			toRun = true;
		}
	}
	outro(
		toRun
			? bgBlue('BashGenie: Completed - Command running... (Good luck)')
			: bgBlue('BashGenie: Completed'),
	);

	return toRun;
}

function printAdditionalInformation(
	options: RunOptions,
	aiObject: AIObjectSchema,
	usage: LanguageModelUsage,
) {
	if (options.explain) {
		log.step(`${bgBlue('EXPLANATION:')}\n${aiObject.explaination}`);
	}

	if (options.verbose) {
		printVerbose(usage);
	}

	printDangerLevel(aiObject.danger);
}

function printVerbose(usage: LanguageModelUsage) {
	log.step(
		`${bgBlue('USAGE:')}` +
			`\nPrompt Tokens = ${usage.promptTokens}` +
			`\nCompletion Tokens = ${usage.completionTokens}` +
			`\nTotal Tokens = ${usage.totalTokens}`,
	);
}

function printDangerLevel(dangerLevel: number) {
	const color = dangerLevel < 5 ? bgBlue : dangerLevel < 7 ? bgYellow : bgRed;
	log.warn(`Danger level assessment: ${color(` ${dangerLevel} `)}`);
}
