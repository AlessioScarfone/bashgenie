import { platform } from 'node:os';
import { type AnthropicProvider, createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import type { ProviderV1 } from '@ai-sdk/provider';
import { generateObject } from 'ai';
import { z } from 'zod';
import {
	getAIProvider,
	getApiKey,
	getModel,
	type providersType,
} from '../configuration.js';
import { buildSystemPrompt } from './system-prompt.js';

const providerFactoryMap: {
	[key in providersType]: (apikey: string) => ProviderV1 | AnthropicProvider;
} = {
	google: (apiKey: string) => createGoogleGenerativeAI({ apiKey }),
	openai: (apiKey: string) => createOpenAI({ apiKey }),
	//NOTE: AnthropicProvider not fully compatible with ProviderV1 type
	anthropic: (apiKey: string) => createAnthropic({ apiKey }),
};

function getLLM() {
	const providerName = getAIProvider();
	const apiKey = getApiKey();
	const provider = providerFactoryMap[providerName]?.(apiKey);
	return provider?.languageModel(getModel());
}

function getOS() {
	const p = platform();
	if (p === 'win32') return 'Windows';
	if (p === 'darwin') return 'macOS';
	return 'Linux';
}

const schema = z.object({
	command: z.string({
		description: 'generated command to solve the user question',
	}),
	explaination: z.string({
		description:
			'explanation of the generated command. Explains the command and each flag used. If the command is a pipe of multiple commands, explain each of them.' +
			'If the command is dangerous, explain why',
	}),
	danger: z
		.number({
			description:
				'a rating of the dangerousness of the generated command from 1 to 10, where 1 is safe and 10 is extremely dangerous.',
		})
		.min(1)
		.max(10),
});

export type AIObjectSchema = z.infer<typeof schema>;

export async function generateCommand(question: string | string[]) {
	const prompt = Array.isArray(question) ? question.join(' ') : question;
	const model = getLLM();
	if(!model) {
		throw new Error("Available LLM not found")
	}
	const system = buildSystemPrompt(process.env.SHELL || 'bash', getOS());

	return generateObject({
		model,
		prompt,
		system,
		schema,
	});
}
