#! /usr/bin/env node

import { parseCmdArgs } from './parteCmdArgs.js';

console.log('BashGenie');

console.log(process.argv);

const { values, positionals } = parseCmdArgs(process.argv);

console.log({ values, positionals });
