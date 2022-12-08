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
	let memo: Record<string, Command<any>> | null = null;

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

export function wrapRotation(angle: number): number {
	while (angle < 0) angle += TWO_PI;
	return angle % TWO_PI;
}

export const zip = <T>(a: T[], b: T[]): [T, T][] => a.map((e, index) => [e, b[index]]);

export function gcd(a: number, b: number): number {
	if (b === 0) return a;
	return gcd(b, a % b);
}

export function mcm(...numbers: number[]) {
	let result = 1;
	for (const num of numbers) {
		const divisor = gcd(result, num);
		result = (result * num) / divisor;
	}

	return result;
}

export function windows<T>(arr: T[], windowSize: number): T[][] {
	if (windowSize > arr.length) return [];
	return [...Array(arr.length - windowSize + 1)].map((_, index) =>
		arr.slice(index, index + windowSize)
	);
}

export function chunks<T>(arr: T[], chunkSize: number): T[][] {
	if (chunkSize > arr.length) return [];

	const out: T[][] = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		out.push(arr.slice(i, i + chunkSize));
	}

	return out;
}

export const PI_OVER_2 = Math.PI / 2;
export const TWO_PI = Math.PI * 2;
