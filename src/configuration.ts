import Conf from 'conf';

export type providersType = 'google' | 'openAI';

const confSchema = {
	model: {
		type: 'string',
	},
	apikey: {
		type: 'string',
	},
	provider: {
		type: 'string',
	},
};

export const conf = new Conf({
	projectName: 'BashGenie',
	schema: confSchema,
	encryptionKey: '3ncr1pt10nk3y',
});

export function getApiKey() {
	return conf.get('apikey') as string;
}
export function getModel() {
	return conf.get('model') as string;
}
export function getAIProvider() {
	return conf.get('provider') as providersType;
}
