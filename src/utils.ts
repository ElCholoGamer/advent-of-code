import { readdir } from 'fs/promises';
import path from 'path';
import { Command } from './types';

export const getAllCommands = (() => {
	let memo: Record<string, Command<any>> | null = null;

	return async () => {
		if (!memo) {
			const dir = path.join(__dirname, 'commands');
			const paths = await readdir(dir);

			const imports = await Promise.all(
				paths.map((file) => import(path.resolve(dir, file))),
			);
			const commands = imports.map((module) => module.default);

			memo = commands.reduce<Record<string, Command>>(
				(obj, command) => ({ ...obj, [command.name]: command }),
				{},
			);
		}

		return memo;
	};
})();

export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
