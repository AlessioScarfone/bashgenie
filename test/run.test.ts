import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateCommand } from '../src/ai/ai.js';
import { type RunOptions, run } from '../src/command/run.js';

vi.mock('@clack/prompts', () => ({
	confirm: vi.fn(),
	intro: vi.fn(),
	isCancel: vi.fn(),
	log: {
		error: vi.fn(),
		step: vi.fn(),
		warn: vi.fn(),
	},
	spinner: vi.fn().mockReturnValue({
		start: vi.fn(),
		stop: vi.fn(),
	}),
	outro: vi.fn(),
}));

// Mock the external dependencies
vi.mock('node:child_process');
vi.mock('node:util');
vi.mock('../src/ai/ai.js');

describe('Run - Generate command', () => {
	let options: RunOptions;

	beforeEach(() => {
		options = {
			explain: false,
			verbose: false,
			exec: true,
			minimal: false,
		};

		// Reset mocks before each test
		vi.clearAllMocks();
	});

	it('should execute only minimal output if minimal option is true', async () => {
		options.minimal = true;

		const generateCommandSpy = vi.mocked(generateCommand).mockResolvedValue({
			object: { command: 'result', danger: 1, explaination: '' },
			usage: { promptTokens: 1, completionTokens: 2, totalTokens: 3 },
			finishReason: 'length',
			warnings: undefined,
			request: {
				body: undefined,
			},
			response: {
				id: '',
				modelId: '',
				timestamp: new Date(),
				body: '',
				headers: {},
			},
			logprobs: undefined,
			providerMetadata: undefined,
			experimental_providerMetadata: undefined,
			toJsonResponse: (init?: ResponseInit): Response => {
				throw new Error('Function not implemented.');
			},
		});

		const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

		await run('test question', options);
		expect(generateCommandSpy).toHaveBeenCalledWith('test question');
		expect(consoleLogSpy).toHaveBeenCalledWith('result');
	});

	// it('should run the command if it is safe and exec is true', async () => {
	//     // Mock the response from generateCommand with a safe command
	//     vi.mocked(generateCommand).mockResolvedValueOnce({
	//         object: { command: "result", danger: 1, explaination: "" },
	//         usage: { promptTokens: 1, completionTokens: 2, totalTokens: 3 },
	//         finishReason: "length",
	//         warnings: undefined,
	//         request: {
	//             body: undefined
	//         },
	//         response: { id: "", modelId: "", timestamp: new Date(), body: "", headers: {} },
	//         logprobs: undefined,
	//         providerMetadata: undefined,
	//         experimental_providerMetadata: undefined,
	//         toJsonResponse: function (init?: ResponseInit): Response {
	//             throw new Error("Function not implemented.");
	//         }
	//     });

	//     vi.mocked(confirm).mockResolvedValue(true)

	//     await run('test question', options);
	//     expect(options.exec).toBeTruthy()
	//     const mockSpy = vi.mocked(exec)
	//     expect(mockSpy).toHaveBeenCalledWith('result');
	// });
});
