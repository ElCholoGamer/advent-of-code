import { AoCPart } from '../../types';
import { Vector2 } from '../../utils/structures/vector';

interface Tile {
	wall: boolean;
	blinkMod: number | null;
}

function parseInput(input: string[]) {
	const grid: Tile[][] = [...Array(input[0].length)].map(() =>
		[...Array(input.length)].map(() => ({
			wall: false,
			blinkMod: null,
		})),
	);

	let start = new Vector2(0, 0);

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			const char = input[y][x];
			if (char === '#') {
				grid[x][y].wall = true;
			} else if (char === 'S') {
				start = new Vector2(x, y);
			}
		}
	}

	return { grid, start };
}

interface Options {
	steps: number;
}

export const part1: AoCPart<Options> = (input, { steps = 26501365 }) => {
	const { grid, start } = parseInput(input);

	let queueQueue = [start];
	let stepQueue = [];
	grid[start.x][start.y].blinkMod = 0;

	for (let s = 1; s <= steps; s++) {
		stepQueue = queueQueue.map((pos) => pos.clone());
		queueQueue = [];

		while (stepQueue.length !== 0) {
			const pos = stepQueue.pop()!;

			for (const direction of [
				new Vector2(0, 1),
				new Vector2(0, -1),
				new Vector2(1, 0),
				new Vector2(-1, 0),
			]) {
				const neighborPos = pos.clone().add(direction);
				if (
					neighborPos.x < 0 ||
					neighborPos.x >= grid.length ||
					neighborPos.y < 0 ||
					neighborPos.y >= grid[0].length
				)
					continue;

				const neighbor = grid[neighborPos.x][neighborPos.y];

				if (neighbor.wall || neighbor.blinkMod) continue;

				neighbor.blinkMod = s % 2;
				queueQueue.push(neighborPos);
			}
		}
	}

	let count = 0;

	for (const column of grid) {
		for (const tile of column) {
			if (steps % 2 === tile.blinkMod) count++;
		}
	}

	return count;
};
