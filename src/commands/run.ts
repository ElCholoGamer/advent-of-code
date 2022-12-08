import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import path from 'node:path';
import chalk from 'chalk';
import { AoCPart, Command, Visualization } from '../types';
import axios, { AxiosError, AxiosResponse } from 'axios';

type Flags = {
	year: number;
	part: number;
	input: string;
	visualize: boolean;
};

const runCommand: Command<Flags> = {
	name: 'run',
	description: 'Runs a puzzle solution',
	arguments: [
		{
			name: 'day',
			required: true,
			validate: value => {
				const num = parseInt(value);
				return (!isNaN(num) && num >= 1 && num <= 25) || 'Day must be an integer between 1 and 25';
			},
		},
	],
	flags: {
		year: {
			type: 'Number',
			short: 'Y',
			description: 'The year of the solution to run. Defaults to the current year.',
			validate: n => {
				const currentYear = new Date().getFullYear();
				return (n >= 2015 && n <= currentYear) || `Year must be between 2015 and ${currentYear}`;
			},
		},
		part: {
			type: 'Number',
			short: 'P',
			description: 'The part of the solution to execute. Defaults to both.',
			validate: n => n === 1 || n === 2 || 'Part must be either 1 or 2',
		},
		input: {
			type: 'String',
			short: 'I',
			description: 'A custom input file path',
		},
		visualize: {
			type: 'Boolean',
			short: 'V',
			description: 'Show a visualization if available',
		},
	},
	async run(args, { year = new Date().getFullYear(), part, input: inputPath, visualize }) {
		const day = parseInt(args[0]);

		if (new Date(Date.now() - 5) < new Date(year, 11, day)) {
			console.error(chalk.bold.red(`Error: Input for day ${day} is not available yet`));
			return;
		}

		if (day === 25 && part === 2) {
			console.error(chalk.bold.red('Error: Day 25 does not have a part 2'));
			return;
		}

		let rawInput: string;

		if (inputPath) {
			try {
				rawInput = await readFile(inputPath, { encoding: 'utf-8' });
			} catch (err) {
				console.error(chalk.bold.red('Error: Could not read input file, see below for error:'));
				console.error(err);
				return;
			}
		} else {
			const inputDirectory = path.join('cache', year.toString());
			inputPath = path.join(inputDirectory, day + '.txt');

			try {
				rawInput = await readFile(inputPath, { encoding: 'utf-8' });
			} catch {
				await access(inputDirectory).catch(() => mkdir(inputDirectory, { recursive: true }));
				const { SESSION_COOKIE } = process.env;
				if (!SESSION_COOKIE) {
					console.error(chalk.bold.red('Error: Could not find SESSION_COOKIE env variable'));
					return;
				}

				try {
					console.log(chalk.italic.yellow('Fetching input...'));
					const res: AxiosResponse<string> = await axios.get(
						`https://adventofcode.com/${year}/day/${day}/input`,
						{
							headers: {
								cookie: `session=${SESSION_COOKIE}`,
								'User-Agent':
									'github.com/ElCholoGamer/advent-of-code by josedanielgrayson@gmail.com',
							},
							responseType: 'text',
							transformResponse: res => res,
						}
					);

					rawInput = res.data;
					await writeFile(inputPath, rawInput);
				} catch (err: unknown) {
					console.error(chalk.bold.red('Error: Could not fetch input, read below:'));

					const axiosErr = err as AxiosError;
					if (axiosErr.response) {
						console.error(chalk.bold.red(axiosErr.response.statusText));
					} else {
						throw axiosErr;
					}
					return;
				}
			}
		}

		const input = rawInput.replace(/\r?\n$/, '').split(/\r?\n/);

		let funcs: { part1?: AoCPart; part2?: AoCPart; visualization?: Visualization };

		try {
			funcs = await import(path.resolve(__dirname, `../days/${year}/${day}`));
		} catch {
			console.error(chalk.bold.red(`Error: Could not import day ${day} module`));
			return;
		}

		if (visualize) {
			if (!funcs.visualization) {
				console.error(chalk.bold.red('Error: Missing visualization function'));
				return;
			}

			await funcs.visualization(input);
			return;
		}

		console.log(chalk.bold.yellow`Running ${year} - Day ${day}`);

		if (part !== 2) {
			console.log(chalk.bold.blue('──────── Part 1 ────────'));
			await runPart(funcs.part1, input);
		}

		if (day !== 25 && part !== 1) {
			console.log(chalk.bold.blue('──────── Part 2 ────────'));
			await runPart(funcs.part2, input);
		}
	},
};

async function runPart(func: AoCPart | undefined, input: string[]) {
	if (!func) {
		console.error(chalk.bold.red('Error: Unimplemented.'));
		return;
	}

	const start = performance.now();

	try {
		const result = await func(input, {});
		console.log(chalk.green`${chalk.bold('Result:')} ${result}`);
	} catch (err) {
		console.error(err);
	}

	console.log(chalk.yellow(`${chalk.bold('Elapsed:')} ${Math.floor(performance.now() - start)}ms`));
}

export default runCommand;
