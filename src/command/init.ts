import {
	cancel,
	confirm,
	intro,
	isCancel,
	outro,
	select,
	text,
} from '@clack/prompts';
import Conf from 'conf';
import kleur from 'kleur';

const confSchema = {
	model: {
		type: 'string',
	},
	apikey: {
		type: 'string',
	},
};

/**
 * Initialise process. Select model and set API_KEY value
 */
export async function init() {
	//encryptionKey: this is not intended for security purposes, it's main use is for obscurity
	const conf = new Conf({
		projectName: 'BashGenie',
		schema: confSchema,
		encryptionKey: '3ncr1pt10nk3y',
	});

	intro(kleur.bgBlue('Configure BashGenie: Start'));
	if (isConfAlreadyExist(conf)) {
		const confirmOverwrite = await overwriteCheck();
		if (!confirmOverwrite) {
			process.exit();
		}
	}
	const apikey = await askAPIKey();
	const model = await selectModel();

	// console.log('conf:', { path: conf.path, store: conf.store })
	conf.set('apikey', apikey);
	conf.set('model', model);
	outro(kleur.bgBlue('Configure BashGenie: Completed'));
}

function isConfAlreadyExist(conf: Conf<any>) {
	return conf?.size > 0;
}

async function overwriteCheck() {
	const overwrite = await confirm({
		message: 'Config already exist. Do you want to overwrite?',
		initialValue: false
	});
	checkIsCancel(overwrite);
	return overwrite;
}

async function askAPIKey() {
	const apikey = await text({
		message: 'APIKEY ?',
		placeholder: 'xkiac.....',
		validate(value) {
			if (!value?.trim()?.length) return `Value is required!`;
		},
	});

	checkIsCancel(apikey);
	return apikey;
}

async function selectModel() {
	const provider = (await select({
		message: 'Choose you AI provider',
		options: [
			{ value: 'google', label: 'Google Generative AI' },
			{ value: 'openAI', label: 'OpenAI' },
		],
	})) as string;

	checkIsCancel(provider);

	const options =
		modelList[provider]?.map((el) => ({
			value: el,
			label: el,
		})) || [];

	options.unshift(manualOption);

	let model = (await select({ message: 'Choose model', options })) as string;

	checkIsCancel(model);

	if (model === INSERT_MANUAL_OPTION_VALUE) {
		model = (await text({
			message: 'Specify a model?',
			validate(value) {
				if (!value?.trim()?.length) return `Value is required!`;
			},
		})) as string;
		checkIsCancel(model);
	}

	return model;
}

const modelList: { [key: string]: string[] } = {
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
		'gemini-2.0-flash-lite-preview-02-05',
		'gemini-2.0-pro-exp-02-05',
		'gemini-2.0-flash-thinking-exp-01-21',
		'gemini-2.0-flash-exp',
		'gemini-exp-1206',
		'learnlm-1.5-pro-experimental',
	],
	openAI: [
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
	],
	// TODO: add Anthropic
};

function checkIsCancel(value: unknown) {
	if (isCancel(value)) {
		cancel('Operation cancelled.');
		process.exit();
	}
}

const INSERT_MANUAL_OPTION_VALUE = 'manual';

const manualOption = {
	value: INSERT_MANUAL_OPTION_VALUE,
	label: 'Insert manually',
};
