import chalk from 'chalk';
import { AoCPart, Visualization } from '../../types';
import { sleep } from '../../utils';
import { HIDE_CURSOR, SHOW_CURSOR } from '../../utils/strings';
import { Vector2 } from '../../utils/vector';

interface Square {
	height: number;
	neighbors: Square[];
	steps: number;
	visited: boolean;
}

function parseMap(
	input: string[],
	filterNeighbor: (height: number, neighborHeight: number) => boolean
): { grid: Square[][]; start: Square; end: Square } {
	const grid: Square[][] = [...Array(input[0].length)].map(() => []);
	let start: Vector2 | null = null;
	let end: Vector2 | null = null;

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			let char = input[y][x];

			if (char === 'S') {
				start = new Vector2(x, y);
				char = 'a';
			} else if (char === 'E') {
				end = new Vector2(x, y);
				char = 'z';
			}
			const height = char.charCodeAt(0) - 97;
			grid[x].push({
				height,
				neighbors: [],
				visited: false,
				steps: Infinity,
			});
		}
	}

	if (!end || !start) throw new Error('Start or end coordinates not found');

	for (let x = 0; x < grid.length; x++) {
		for (let y = 0; y < grid[x].length; y++) {
			const { height } = grid[x][y];
			const neighbors = [grid[x - 1]?.[y], grid[x + 1]?.[y], grid[x][y - 1], grid[x][y + 1]];
			grid[x][y].neighbors = neighbors.filter(
				neighbor => neighbor && filterNeighbor(height, neighbor.height)
			);
		}
	}

	return {
		grid,
		start: grid[start.x][start.y],
		end: grid[end.x][end.y],
	};
}

function shortestPaths(start: Square) {
	start.steps = 0;
	start.visited = true;
	const queue = [start];

	while (queue.length > 0) {
		const square = queue.shift()!;

		for (const neighbor of square.neighbors) {
			if (neighbor.visited) continue;

			neighbor.steps = square.steps + 1;
			neighbor.visited = true;
			queue.push(neighbor);
		}
	}
}

export const part1: AoCPart = input => {
	const { start, end } = parseMap(input, (h, nH) => nH <= h + 1);
	shortestPaths(start);

	return end.steps;
};

export const part2: AoCPart = input => {
	const { grid, end } = parseMap(input, (h, nH) => nH >= h - 1);
	shortestPaths(end);

	const aSquares = grid.flat().filter(square => square.height === 0);
	return Math.min(...aSquares.map(square => square.steps));
};

interface TrackedSquare extends Square {
	neighbors: TrackedSquare[];
	back: TrackedSquare | null;
}

export const visualization: Visualization = async input => {
	const { grid: baseGrid, start, end } = parseMap(input, (h, nH) => nH <= h + 1);
	const grid = baseGrid as TrackedSquare[][];

	for (const column of grid) {
		for (const square of column) {
			square.back = null;
		}
	}

	function render(finished: boolean) {
		const lines = Array(grid[0].length);

		for (let y = 0; y < grid[0].length; y++) {
			let coloring = false;
			let line = '';

			for (let x = 0; x < grid.length; x++) {
				const square = grid[x][y];
				const char =
					square === start ? 'S' : square === end ? 'E' : String.fromCharCode(square.height + 97);

				if (square === start || square === end) {
					line += chalk.bold.blue(char);
					coloring = false;
					continue;
				} else if (finished) {
					line += square.visited ? chalk.green('#') : chalk.gray(char);
					continue;
				} else if (square.visited && !coloring) {
					line += (chalk.yellow as any)._styler.open;
					coloring = true;
				} else if (!square.visited && coloring) {
					line += (chalk.reset as any)._styler.open;
					coloring = false;
				}

				line += char;
			}

			lines[y] = line + (chalk.reset as any)._styler.open;
		}

		console.clear();
		console.log(lines.join('\n'));
	}

	start.steps = 0;
	start.visited = true;
	const queue = [start as TrackedSquare];

	console.log(HIDE_CURSOR);
	render(false);
	await sleep(500);

	let level = 0;

	while (queue.length !== 0) {
		const square = queue.shift()!;

		if (square.steps === level) {
			render(false);
			await sleep(20);
			level++;
		}

		for (const neighbor of square.neighbors) {
			if (neighbor.visited) continue;

			neighbor.back = square;
			neighbor.steps = square.steps + 1;
			neighbor.visited = true;
			queue.push(neighbor);
		}

		if (end.visited) break;
	}

	for (const column of grid) {
		for (const square of column) {
			square.visited = false;
		}
	}

	let currentSquare: TrackedSquare | null = end as TrackedSquare;
	while (currentSquare) {
		currentSquare.visited = true;
		currentSquare = currentSquare.back;
	}

	await sleep(500);
	render(true);
	console.log();
	console.log(chalk.green`${chalk.bold('Shortest distance:')} ${end.steps}`);
	await sleep(5000);

	console.log(SHOW_CURSOR);
};
