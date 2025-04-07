import { intro, log, outro } from '@clack/prompts';
import { bgBlue, underline } from 'kleur/colors';
import type { CommandOptions } from '../cli/commands.js';
import { getConf } from '../configuration.js';

export function showConf(options?: CommandOptions) {
	const logWithCondition = (
		text: string | number | boolean,
		label = '',
		condition = true,
	) => {
		const logFunc = condition ? log.step : log.error;
		logFunc(`${label} ${text.toString()}`);
	};

	const conf = getConf();

	intro(bgBlue('Current Configuration'));
	logWithCondition(`${conf.provider}`, underline('Provider:'));
	logWithCondition(`${conf.model}`, underline('Model:'));
	const apikeyConfigured = (conf.apikey as string)?.trim().length > 0;
	logWithCondition(
		apikeyConfigured,
		underline('API key configured:'),
		apikeyConfigured,
	);
	outro();

	if (options?.exitOnComplete) {
		process.exit();
	}
}
