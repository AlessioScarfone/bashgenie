#! /usr/bin/env node

import { parseCmdArgs } from './cli/commands.js';
import { showHelp } from './command/help.js';
import { init } from './command/init.js';
import { run } from './command/run.js';
import { showConf } from './command/show-conf.js';

const { values, positionals: question } = parseCmdArgs(process.argv.splice(2));

// console.debug('parse args:', { values, positionals });
console.log();

if (values.help) showHelp({ exitOnComplete: true });
if (values['show-conf']) showConf({ exitOnComplete: true });
if (values.init) await init();

await run(question, {
	explain: Boolean(values.explain),
	verbose: Boolean(values.verbose),
	exec: Boolean(values.exec),
});
