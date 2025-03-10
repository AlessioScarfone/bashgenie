#! /usr/bin/env node

import { init } from './command/init.js';
import { parseCmdArgs } from './parteCmdArgs.js';

const { values, positionals } = parseCmdArgs(process.argv.splice(2));

console.debug('parse args:', { values, positionals });

if (values.init) {
	init();
}
