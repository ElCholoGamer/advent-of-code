import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { Command } from './types';

export function christmasify(s: string) {
	return s
		.split('')
		.map((char, i) => (i % 2 === 0 ? chalk.redBright(char) : chalk.whiteBright(char)))
		.join('');
}

export const getAllCommands = (() => {
	let memo: Record<string, Command<Record<string, string | number>>> | null = null;

	return async () => {
		if (!memo) {
			const dir = path.join(__dirname, 'commands');
			const paths = fs.readdirSync(dir);

			const commands = (
				await Promise.all(paths.map(async file => import(path.resolve(dir, file))))
			).map(mod => mod.default);

			memo = commands.reduce<Record<string, Command>>(
				(acc, cmd) => ({ ...acc, [cmd.name]: cmd }),
				{}
			);
		}

		return memo;
	};
})();

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
