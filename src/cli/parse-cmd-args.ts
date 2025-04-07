import { parseArgs } from 'node:util';

type Options = {
	type: 'boolean' | 'string';
	short?: string;
	multiple?: boolean;
	default?: boolean | string;
};

type optionsKeyType =
	| 'init'
	| 'verbose'
	| 'explain'
	| 'help'
	| 'exec'
	| 'show-conf';

const options: { [key in optionsKeyType]: Options } = {
	init: {
		type: 'boolean',
		default: false,
		short: 'i',
	},
	verbose: {
		type: 'boolean',
		default: false,
		short: 'v',
	},
	explain: {
		type: 'boolean',
		default: false,
		short: 'e',
		multiple: false,
	},
	help: {
		type: 'boolean',
		default: false,
		short: 'h',
	},
	exec: {
		type: 'boolean',
		default: true,
	},
	'show-conf': {
		type: 'boolean',
		default: false,
		short: 'c',
	},
};

export function parseCmdArgs(args: string[]) {
	return parseArgs({
		args,
		options,
		allowPositionals: true,
		allowNegative: true,
	});
}
