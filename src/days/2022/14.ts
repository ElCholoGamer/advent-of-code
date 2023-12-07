import chalk from 'chalk';
import { AoCPart, Visualization } from '../../types';
import { sleep } from '../../utils';
import {
	ColorizedString,
	HIDE_CURSOR,
	joinColorizedStrings,
	SHOW_CURSOR,
} from '../../utils/strings';
import { Vector2 } from '../../utils/structures/vector';

const SAND_ORIGIN = new Vector2(500, 0);

const enum Tile {
	AIR,
	ROCK,
	SAND,
}

function buildGrid(input: string[]): { grid: Tile[][]; floor: number } {
	const paths = input.map((line) =>
		line.split(' -> ').map((s) => Vector2.fromArray(s.split(',').map(Number)))
	);
	const grid = [...Array(SAND_ORIGIN.x * 2)].map(() =>
		Array(SAND_ORIGIN.x).fill(Tile.AIR)
	);

	let maxRockY = 0;

	for (const path of paths) {
		for (let i = 0; i < path.length - 1; i++) {
			let from = path[i].clone();
			const to = path[i + 1];
			const step = to.clone().subtract(from).sign();

			maxRockY = Math.max(maxRockY, from.y, to.y);

			while (!from.equals(to)) {
				grid[from.x][from.y] = Tile.ROCK;
				from.add(step);
			}
			grid[to.x][to.y] = Tile.ROCK;
		}
	}

	return { grid, floor: maxRockY + 2 };
}

export const part1: AoCPart = (input) => {
	const { grid, floor } = buildGrid(input);

	for (let sandUnits = 0; ; sandUnits++) {
		const sandPos = SAND_ORIGIN.clone();

		while (true) {
			if (sandPos.y >= floor) return sandUnits;

			const nextMove = [0, -1, 1].find(
				(xMove) => grid[sandPos.x + xMove][sandPos.y + 1] === Tile.AIR
			);

			if (nextMove === undefined) {
				grid[sandPos.x][sandPos.y] = Tile.SAND;
				break;
			}

			sandPos.x += nextMove;
			sandPos.y++;
		}
	}
};

export const part2: AoCPart = (input) => {
	const { grid, floor } = buildGrid(input);

	for (let sandUnits = 1; ; sandUnits++) {
		const sandPos = SAND_ORIGIN.clone();

		while (true) {
			if (sandPos.y === floor - 1) {
				grid[sandPos.x][sandPos.y] = Tile.SAND;
				break;
			}

			const nextMove = [0, -1, 1].find(
				(xMove) => grid[sandPos.x + xMove][sandPos.y + 1] === Tile.AIR
			);

			if (nextMove === undefined) {
				if (sandPos.y === 0) return sandUnits;

				grid[sandPos.x][sandPos.y] = Tile.SAND;
				break;
			}

			sandPos.x += nextMove;
			sandPos.y++;
		}
	}
};

export const visualization: Visualization = async (input) => {
	const { grid, floor } = buildGrid(input);

	function render(extraSand?: Vector2) {
		const lines: string[] = [];

		for (let y = 0; y <= floor; y++) {
			const colorizedStrings: ColorizedString[] = [];

			for (let x = 488; x <= 512; x++) {
				if (x === extraSand?.x && y === extraSand.y) {
					colorizedStrings.push({ str: 'o', color: chalk.yellow });
					continue;
				}

				const tile = grid[x][y];

				if (tile === Tile.AIR && SAND_ORIGIN.x === x && SAND_ORIGIN.y === y) {
					colorizedStrings.push({ str: '+', color: chalk.green });
					continue;
				}

				if (y === floor) {
					colorizedStrings.push({ str: '#', color: chalk.blue });
					continue;
				}

				switch (tile) {
					case Tile.AIR:
						colorizedStrings.push({ str: '.', color: chalk.gray });
						break;
					case Tile.ROCK:
						colorizedStrings.push({ str: '#', color: chalk.blue });
						break;
					case Tile.SAND:
						colorizedStrings.push({ str: 'o', color: chalk.yellow });
						break;
				}
			}

			lines.push(joinColorizedStrings(colorizedStrings));
		}

		console.clear();
		console.log(lines.join('\n'));
	}

	console.log(HIDE_CURSOR);
	render();
	await sleep(1000);

	for (let sandUnits = 1; ; sandUnits++) {
		const sandPos = SAND_ORIGIN.clone();

		while (true) {
			render(sandPos);
			await sleep(20);

			if (sandPos.y === floor - 1) {
				grid[sandPos.x][sandPos.y] = Tile.SAND;
				break;
			}

			const nextMove = [0, -1, 1].find(
				(xMove) => grid[sandPos.x + xMove][sandPos.y + 1] === Tile.AIR
			);

			if (nextMove === undefined) {
				if (sandPos.y === 0) {
					render(sandPos);
					console.log();
					console.log(chalk.yellow`${chalk.bold('Sand units:')} ${sandUnits}`);
					await sleep(3000);
					console.log(SHOW_CURSOR);
					return;
				}

				grid[sandPos.x][sandPos.y] = Tile.SAND;
				break;
			}

			sandPos.x += nextMove;
			sandPos.y++;
		}
	}
};
