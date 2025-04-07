import {
	cancel,
	confirm,
	intro,
	isCancel,
	log,
	outro,
	select,
	text,
} from '@clack/prompts';
import { bgBlue } from 'kleur/colors';
import {
	conf,
	getAIProvider,
	getApiKey,
	getModel,
	isConfAlreadyExist,
	type providersType,
} from '../configuration.js';

/**
 * Initialise process. Select model and set API_KEY value
 *
 * The configuration file is placed in the user's configuration directory:
 * https://github.com/sindresorhus/env-paths#pathsconfig
 */
export async function init() {
	//encryptionKey: this is not intended for security purposes, it's main use is for obscurity
	intro(bgBlue('Configure BashGenie: Start'));
	if (isConfAlreadyExist()) {
		await askForOwerwrite(
			'Config already exist. Do you want to overwrite?',
			async (o) => {
				if (!o) process.exit();
			},
		);
	}

	const apikey = await askAPIKey();
	// console.log('conf:', { path: conf.path, store: conf.store })
	if (apikey == null) {
		log.step('API key already exist. Do not overwrite!');
	} else {
		conf.set('apikey', apikey);
	}

	const { model, provider } = await selectModel();
	conf.set('model', model);
	conf.set('provider', provider);
	outro(bgBlue('Configure BashGenie: Completed'));
}

async function askForOwerwrite(
	message: string,
	cb: (overwrite: boolean) => Promise<boolean | void> = (o: boolean) =>
		Promise.resolve(o),
	initialValue = false,
) {
	const overwrite = await confirm({
		message,
		initialValue,
	});
	closeOnCancel(overwrite);
	return await cb(overwrite as boolean);
}

async function askAPIKey() {
	if (getApiKey()) {
		const v = await askForOwerwrite(
			'API key already exist. Do you want to overwrite?',
		);
		if (!v) return null;
	}

	const apikey = await text({
		message: 'APIKEY ?',
		placeholder: 'xkiac.....',
		validate(value) {
			if (!value?.trim()?.length) return 'Value is required!';
		},
	});

	closeOnCancel(apikey);
	return apikey;
}

async function selectModel() {
	if (getAIProvider() && getModel()) {
		log.info(
			`${bgBlue('Current Model')} -> ${getAIProvider().toUpperCase()} : ${getModel()}`,
		);
	}

	const selectProviderOptions: Array<{ value: providersType; label: string }> =
		[
			{ value: 'google', label: 'Google Generative AI' },
			{ value: 'openai', label: 'OpenAI' },
			{ value: 'anthropic', label: 'Anthropic' },
		];

	const provider = (await select({
		message: 'Choose you AI provider',
		options: selectProviderOptions,
	})) as string;

	closeOnCancel(provider);

	const selectModelOptions =
		modelList[provider as providersType]?.map((el) => ({
			value: el,
			label: el,
		})) || [];

	selectModelOptions.unshift({
		value: 'manual',
		label: 'Insert manually',
	});

	let model = (await select({
		message: 'Choose model',
		options: selectModelOptions,
	})) as string;

	closeOnCancel(model);

	if (model === 'manual') {
		model = (await text({
			message: 'Specify a model?',
			validate(value) {
				if (!value?.trim()?.length) return 'Value is required!';
			},
		})) as string;
		closeOnCancel(model);
	}

	return { provider, model };
}

const modelList: { [key in providersType]: string[] } = {
	google: [
		'gemini-2.0-flash-001',
		'gemini-1.5-flash',
		'gemini-1.5-flash-latest',
		'gemini-1.5-flash-001',
		'gemini-1.5-flash-002',
		'gemini-1.5-flash-8b',
		'gemini-1.5-flash-8b-latest',
		'gemini-1.5-flash-8b-001',
		'gemini-1.5-pro',
		'gemini-1.5-pro-latest',
		'gemini-1.5-pro-001',
		'gemini-1.5-pro-002',
		'gemini-2.5-pro-exp-03-25',
		'gemini-2.0-flash-lite-preview-02-05',
		'gemini-2.0-pro-exp-02-05',
		'gemini-2.0-flash-thinking-exp-01-21',
		'gemini-2.0-flash-exp',
		'gemini-exp-1206',
		'gemma-3-27b-it',
		'learnlm-1.5-pro-experimental',
	],
	openai: [
		'o1',
		'o1-2024-12-17',
		'o1-mini',
		'o1-mini-2024-09-12',
		'o1-preview',
		'o1-preview-2024-09-12',
		'o3-mini',
		'o3-mini-2025-01-31',
		'gpt-4o',
		'gpt-4o-2024-05-13',
		'gpt-4o-2024-08-06',
		'gpt-4o-2024-11-20',
		'gpt-4o-audio-preview',
		'gpt-4o-audio-preview-2024-10-01',
		'gpt-4o-audio-preview-2024-12-17',
		'gpt-4o-mini',
		'gpt-4o-mini-2024-07-18',
		'gpt-4-turbo',
		'gpt-4-turbo-2024-04-09',
		'gpt-4-turbo-preview',
		'gpt-4-0125-preview',
		'gpt-4-1106-preview',
		'gpt-4',
		'gpt-4-0613',
		'gpt-4.5-preview',
		'gpt-4.5-preview-2025-02-27',
		'gpt-3.5-turbo-0125',
		'gpt-3.5-turbo',
		'gpt-3.5-turbo-1106',
		'chatgpt-4o-latest',
	],
	anthropic: [
		'claude-3-7-sonnet-20250219',
		'claude-3-5-sonnet-latest',
		'claude-3-5-sonnet-20241022',
		'claude-3-5-sonnet-20240620',
		'claude-3-5-haiku-latest',
		'claude-3-5-haiku-20241022',
		'claude-3-opus-latest',
		'claude-3-opus-20240229',
		'claude-3-sonnet-20240229',
		'claude-3-haiku-20240307',
	],
};

function closeOnCancel(value: unknown) {
	if (isCancel(value)) {
		cancel('Operation cancelled.');
		process.exit();
	}
}
