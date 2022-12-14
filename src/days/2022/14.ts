import { AoCPart, Visualization } from '../../types';
import { Vector2 } from '../../utils/vector';

const SAND_ORIGIN = new Vector2(500, 0);

const enum Tile {
	AIR,
	ROCK,
	SAND,
}

function buildGrid(input: string[]): { grid: Tile[][]; floor: number } {
	const paths = input.map(line =>
		line.split(' -> ').map(s => Vector2.fromArray(s.split(',').map(Number)))
	);
	const grid = [...Array(SAND_ORIGIN.x * 2)].map(() => Array(SAND_ORIGIN.x).fill(Tile.AIR));

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

export const part1: AoCPart = input => {
	const { grid, floor } = buildGrid(input);

	for (let sandUnits = 0; ; sandUnits++) {
		const sandPos = SAND_ORIGIN.clone();

		while (true) {
			if (sandPos.y >= floor) return sandUnits;

			const nextMove = [0, -1, 1].find(
				xMove => grid[sandPos.x + xMove][sandPos.y + 1] === Tile.AIR
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

export const part2: AoCPart = input => {
	const { grid, floor } = buildGrid(input);

	for (let sandUnits = 1; ; sandUnits++) {
		const sandPos = SAND_ORIGIN.clone();

		while (true) {
			if (sandPos.y === floor - 1) {
				grid[sandPos.x][sandPos.y] = Tile.SAND;
				break;
			}

			const nextMove = [0, -1, 1].find(
				xMove => grid[sandPos.x + xMove][sandPos.y + 1] === Tile.AIR
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
