import { platform } from 'node:os';
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
import { buildSystemPrompt } from '../prompt/system-prompt.js';

type providerFactoryFunc = (apiKey: string) => ProviderV1;

const providerFactoryMap: { [key in providersType]: providerFactoryFunc } = {
	google: (apiKey: string) => createGoogleGenerativeAI({ apiKey }),
	openAI: (apiKey: string) => createOpenAI({ apiKey }),
};

function buildLLM() {
	const provider = providerFactoryMap[getAIProvider()]?.(getApiKey());
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
			'explanation of the generated command. Explains the command and each flag used. If the command is a pipe of multiple commands, explain each of them.',
	}),
});

export async function generateCommand(question: string | string[]) {
	const prompt = Array.isArray(question) ? question.join(' ') : question;
	const model = buildLLM();
	const system = buildSystemPrompt(process.env.SHELL || 'bash', getOS());

	return generateObject({
		model,
		prompt,
		system,
		schema,
	});
}
