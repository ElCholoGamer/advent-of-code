import fs from 'fs';
import chalk from 'chalk';
import { AoCPart, Command } from '../types';
import path from 'path';
import axios, { AxiosError } from 'axios';

type Flags = {
	year: number;
	part: number;
	input: string;
};

const runCommand: Command<Flags> = {
	name: 'run',
	description: 'Runs an AoC day',
	subArgs: [
		{
			name: 'day',
			required: true,
			validate: value => {
				const num = Number(value);
				return (
					(!isNaN(num) && Number.isInteger(num) && num >= 1 && num <= 25) ||
					'Day must be an integer between 1 and 25'
				);
			},
		},
	],
	flags: {
		year: {
			type: 'Number',
			short: 'Y',
			description: 'The year to run the day of. Defaults to current year',
			validate: n => {
				const currentYear = new Date().getFullYear();
				return (
					(n >= 2015 && n <= currentYear) || 'The year must be between 2015 and ' + currentYear
				);
			},
		},
		part: {
			type: 'Number',
			short: 'P',
			description: 'The challenge part to execute. Defaults to both parts',
			validate: n => n === 1 || n === 2 || 'The part must be either 1 or 2',
		},
		input: {
			type: 'String',
			short: 'I',
			description: 'A custom input file path',
		},
	},
	async run(args, { year, part, input: inputPath }) {
		year ||= new Date().getFullYear();
		const day = Number(args[0]);

		if (new Date(Date.now() - 5 * 36e5) < new Date(year, 11, day)) {
			console.error(chalk.bold.red(`Error: Input for day ${day} is not available yet`));
			return;
		}

		let input: string;
		if (inputPath) {
			try {
				if (!fs.existsSync(inputPath)) {
					console.log(chalk.bold.red('Error: Input file does not exist'));
					return;
				}

				input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
			} catch (err) {
				console.error(chalk.bold.red('Error: Could not read input file, see below for error:'));
				console.error(err);
				return;
			}
		} else {
			const storeDir = path.join('cache', year.toString());
			inputPath = path.join(storeDir, day + '.txt');

			if (!fs.existsSync(inputPath)) {
				if (!fs.existsSync(storeDir)) {
					fs.mkdirSync(storeDir, { recursive: true });
				}

				const { SESSION_COOKIE } = process.env;
				if (!SESSION_COOKIE) {
					console.error(chalk.bold.red('Error: Could not find SESSION_COOKIE env variable'));
					return;
				}

				try {
					console.log(chalk.italic.blue('Fetching input...'));
					const res = await axios.get(`https://adventofcode.com/${year}/day/${day}/input`, {
						headers: {
							cookie: 'session=' + SESSION_COOKIE,
						},
					});
					input = res.data;

					fs.writeFileSync(inputPath, input);
				} catch (err: unknown) {
					console.error(chalk.bold.red('Error: Could not fetch input, read below:'));

					const axiosErr = <AxiosError>err;
					if (axiosErr.response) {
						console.error(chalk.bold.red(axiosErr.response.statusText));
					} else {
						console.error(chalk.bold.red(axiosErr));
					}
					return;
				}
			} else {
				input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
			}
		}

		let funcs: { part1: AoCPart; part2: AoCPart };

		try {
			funcs = await import(path.resolve(__dirname, `../days/${year}/${day}`));

			if (typeof funcs.part1 !== 'function' || typeof funcs.part2 !== 'function') {
				console.error(chalk.bold.red(`Error: Could not get both functions for day ${day} module`));
				return;
			}
		} catch {
			console.error(chalk.bold.red(`Error: Could not import day ${day} module`));
			return;
		}

		const runningMsg = chalk.bold.yellow(`Running: ${year} Day ${day} - Part {p}`);

		if (part !== 2) {
			console.log(runningMsg.replace('{p}', '1'));
			await runPart(funcs.part1, input);
		}

		if (part !== 1) {
			console.log(runningMsg.replace('{p}', '2'));
			await runPart(funcs.part2, input);
		}
	},
};

async function runPart(func: AoCPart, input: string) {
	const start = Date.now();

	try {
		const result = await func(input);
		console.log(chalk.green(chalk.bold('Result: ') + result));
	} catch (err) {
		console.error(err);
	}

	console.log(chalk.bold.blue(`Elapsed: ${Date.now() - start}ms`));
}

export default runCommand;
