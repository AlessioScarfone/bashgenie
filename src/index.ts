#! /usr/bin/env node

import { parseCmdArgs } from './cli/commands.js';
import { showHelp } from './command/help.js';
import { init } from './command/init.js';
import { run } from './command/run.js';
import { showConf } from './command/show-conf.js';

const { values: flags, positionals: question } = parseCmdArgs(
	process.argv.splice(2),
);

// console.debug('parse args:', { values, positionals });
if (flags.help) showHelp({ exitOnComplete: true });
if (flags['show-conf']) showConf({ exitOnComplete: true });
if (flags.init) await init({ exitOnComplete: true });

await run(question, {
	explain: Boolean(flags.explain),
	verbose: Boolean(flags.verbose),
	exec: Boolean(flags.exec),
	minimal: Boolean(flags.minimal),
});
