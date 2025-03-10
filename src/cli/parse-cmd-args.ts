import { parseArgs } from 'node:util';

type Options = {
	type: 'boolean' | 'string';
	short?: string;
	multiple?: boolean;
	default?: boolean | string;
};

type optionsKeyType = 'init' | 'verbose' | 'explain' | 'help';

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
};

export function parseCmdArgs(args: string[]) {
	return parseArgs({ args, options, allowPositionals: true });
}
