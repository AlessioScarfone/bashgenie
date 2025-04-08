import { describe, expect, it } from 'vitest';
import { parseCmdArgs } from '../src/cli/commands.js';

describe('parseCmdArgs', () => {
	it('--init', () => {
		const args = ['--init', 'test', 'word'];
		const { values, positionals } = parseCmdArgs(args);
		expect(values.init).toBeTruthy();
		expect(positionals).toStrictEqual(['test', 'word']);
	});

	it('--exec: default=true', () => {
		const args1 = ['test', 'word'];
		const { values, positionals } = parseCmdArgs(args1);
		expect(values.exec).toBeTruthy();
		expect(positionals).toStrictEqual(['test', 'word']);
	});

	it('--no-exec', () => {
		const args1 = ['--no-exec', 'test', 'word'];
		const { values, positionals } = parseCmdArgs(args1);
		expect(values.exec).toBeFalsy();
		expect(positionals).toStrictEqual(['test', 'word']);
	});
});
