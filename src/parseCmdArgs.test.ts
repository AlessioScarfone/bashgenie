import { expect, test } from 'vitest';
import { parseCmdArgs } from './parteCmdArgs.js';

test('init check', () => {
	const args = ['--init', 'test', 'word'];
	const { values, positionals } = parseCmdArgs(args);
	console.log(values.init);
	expect(values.init).toBeTruthy();
	expect(positionals).toStrictEqual(['test', 'word']);
});
