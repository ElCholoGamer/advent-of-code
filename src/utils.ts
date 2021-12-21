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

export class Grid2D<T> {
	public readonly values = new Map<string, T>();

	public constructor() {}

	public getOrDefault<D extends T>(x: number, y: number, defaultValue: D) {
		const key = `${x},${y}`;
		return this.values.get(key) ?? defaultValue;
	}

	public get(x: number, y: number) {
		const key = `${x},${y}`;
		return this.values.get(key);
	}

	public has(x: number, y: number) {
		return this.values.has(`${x},${y}`);
	}

	public set(x: number, y: number, value: T): this {
		const key = `${x},${y}`;
		this.values.set(key, value);

		return this;
	}

	public keys() {
		return Array.from(this.values.keys()).map(
			key => key.split(',').map(Number) as [x: number, y: number]
		);
	}

	public get sizeTotal() {
		return this.values.size;
	}
}

export function formatGrid(grid: string[][]): string {
	const lines: string[] = [];

	const maxHeight = Math.max(...grid.map(col => col.length));

	for (let y = 0; y < maxHeight; y++) {
		let line = '';

		for (let x = 0; x < grid.length; x++) {
			line += grid[x][y];
		}

		lines.push(line);
	}

	return lines.join('\n');
}

export function wrapRotation(angle: number): number {
	while (angle < 0) angle += TWO_PI;
	return angle % TWO_PI;
}

export const PI_OVER_2 = Math.PI / 2;
export const TWO_PI = Math.PI * 2;
