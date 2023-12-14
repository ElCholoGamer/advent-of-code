import console from 'node:console';
import { AoCPart } from '../../types';

const enum Tile {
	EMPTY,
	CUBE,
	ROUND,
}

const enum Direction {
	NORTH,
	SOUTH,
	EAST,
	WEST,
}

type Grid = Tile[][];

function parseGrid(input: string[]): Grid {
	const grid = [...Array(input[0].length)].map(() =>
		Array(input.length).fill(Tile.EMPTY),
	);

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			const char = input[y][x];
			if (char === '#') grid[x][y] = Tile.CUBE;
			else if (char === 'O') grid[x][y] = Tile.ROUND;
		}
	}

	return grid;
}

function tiltNorth(grid: Grid) {
	for (let y = 0; y < grid[0].length; y++) {
		for (let x = 0; x < grid.length; x++) {
			if (grid[x][y] !== Tile.ROUND) continue;

			let newY = y;
			while (newY > 0 && grid[x][newY - 1] === Tile.EMPTY) {
				newY--;
			}

			grid[x][y] = Tile.EMPTY;
			grid[x][newY] = Tile.ROUND;
		}
	}
}

function tiltSouth(grid: Grid) {
	for (let y = grid[0].length - 1; y >= 0; y--) {
		for (let x = 0; x < grid.length; x++) {
			if (grid[x][y] !== Tile.ROUND) continue;

			let newY = y;
			while (newY < grid[0].length - 1 && grid[x][newY + 1] === Tile.EMPTY) {
				newY++;
			}

			grid[x][y] = Tile.EMPTY;
			grid[x][newY] = Tile.ROUND;
		}
	}
}

function tiltWest(grid: Grid) {
	for (let x = 0; x < grid.length; x++) {
		for (let y = 0; y < grid[0].length; y++) {
			if (grid[x][y] !== Tile.ROUND) continue;

			let newX = x;
			while (newX > 0 && grid[newX - 1][y] === Tile.EMPTY) {
				newX--;
			}

			grid[x][y] = Tile.EMPTY;
			grid[newX][y] = Tile.ROUND;
		}
	}
}

function tiltEast(grid: Grid) {
	for (let x = grid.length - 1; x >= 0; x--) {
		for (let y = 0; y < grid[0].length; y++) {
			if (grid[x][y] !== Tile.ROUND) continue;

			let newX = x;
			while (newX < grid.length - 1 && grid[newX + 1][y] === Tile.EMPTY) {
				newX++;
			}

			grid[x][y] = Tile.EMPTY;
			grid[newX][y] = Tile.ROUND;
		}
	}
}

function calculateLoad(grid: Grid) {
	let sum = 0;

	for (let y = 0; y < grid[0].length; y++) {
		for (let x = 0; x < grid.length; x++) {
			if (grid[x][y] === Tile.ROUND) {
				sum += grid[0].length - y;
			}
		}
	}

	return sum;
}

export const part1: AoCPart = (input) => {
	const grid = parseGrid(input);
	tiltNorth(grid);
	return calculateLoad(grid);
};

export const part2: AoCPart = (input) => {
	const grid = parseGrid(input);
	const seenStates = new Map<string, number>();

	const TOTAL_CYCLES = 1_000_000_000;

	for (let currentCycle = 0; currentCycle < TOTAL_CYCLES; currentCycle++) {
		tiltNorth(grid);
		tiltWest(grid);
		tiltSouth(grid);
		tiltEast(grid);

		const stateHash = grid.map((col) => col.join('')).join('');

		if (seenStates.has(stateHash)) {
			const loopLength = currentCycle - seenStates.get(stateHash)!;
			currentCycle +=
				Math.floor((TOTAL_CYCLES - currentCycle) / loopLength) * loopLength;
		} else {
			seenStates.set(stateHash, currentCycle);
		}
	}

	return calculateLoad(grid);
};
