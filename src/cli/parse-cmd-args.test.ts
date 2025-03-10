import { expect, test } from 'vitest';
import { parseCmdArgs } from './parse-cmd-args.js';

test('parseCmdArgs', () => {
	const args = ['--init', 'test', 'word'];
	const { values, positionals } = parseCmdArgs(args);
	console.log(values.init);
	expect(values.init).toBeTruthy();
	expect(positionals).toStrictEqual(['test', 'word']);
});
