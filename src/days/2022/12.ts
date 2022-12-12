import { AoCPart } from '../../types';
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
