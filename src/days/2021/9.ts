import { AoCPart } from '../../types';
import { Vector2 } from '../../utils/structures/vector';

interface GridItem {
	depth: number;
	added: boolean;
}

function parseInput(input: string[]): GridItem[][] {
	const grid: GridItem[][] = [];

	for (let y = 0; y < input.length; y++) {
		const line = input[y];
		for (let x = 0; x < line.length; x++) {
			grid[x] ||= [];
			grid[x][y] = { depth: Number(line[x]), added: false };
		}
	}

	return grid;
}

const getNeighbors = (x: number, y: number) => [
	new Vector2(x - 1, y),
	new Vector2(x + 1, y),
	new Vector2(x, y - 1),
	new Vector2(x, y + 1),
];

export const part1: AoCPart = (input) => {
	const grid = parseInput(input);

	let totalRisk = 0;

	for (let x = 0; x < grid.length; x++) {
		for (let y = 0; y < grid[x].length; y++) {
			const item = grid[x][y];

			function isDepthHigher(pos: Vector2) {
				if (
					pos.x < 0 ||
					pos.x >= grid.length ||
					pos.y < 0 ||
					pos.y >= grid[0].length
				)
					return true;
				return grid[pos.x][pos.y].depth > item.depth;
			}

			if (getNeighbors(x, y).every(isDepthHigher)) {
				totalRisk += item.depth + 1;
			}
		}
	}

	return totalRisk;
};

export const part2: AoCPart = (input) => {
	const grid = parseInput(input);
	const basins: number[] = [];

	function checkBasinPosition(x: number, y: number): number {
		if (x < 0 || x >= grid.length || y < 0 || y >= grid[x].length) return 0;

		const item = grid[x][y];
		if (item.added || item.depth === 9) return 0;

		let sum = 1;
		item.added = true;

		function addBasin(x: number, y: number): number {
			if (x < 0 || x >= grid.length || y < 0 || y >= grid[x].length) return 0;
			if (!item) return 0;

			const item2 = grid[x][y];
			if (item2.depth === 9 || item2.added || item2.depth < item.depth)
				return 0;

			item2.added = true;

			let sum = 1;
			sum += addBasin(x - 1, y);
			sum += addBasin(x + 1, y);
			sum += addBasin(x, y - 1);
			sum += addBasin(x, y + 1);

			return sum;
		}

		sum += addBasin(x - 1, y);
		sum += addBasin(x + 1, y);
		sum += addBasin(x, y - 1);
		sum += addBasin(x, y + 1);

		return sum;
	}

	for (let x = 0; x < grid.length; x++) {
		for (let y = 0; y < grid[x].length; y++) {
			const item = grid[x][y];

			function isDepthHigher(pos: Vector2) {
				if (
					pos.x < 0 ||
					pos.x >= grid.length ||
					pos.y < 0 ||
					pos.y >= grid[0].length
				)
					return true;
				return grid[pos.x][pos.y].depth > item.depth;
			}

			// Only start from lowest points
			if (getNeighbors(x, y).some((n) => !isDepthHigher(n))) {
				continue;
			}

			let sum = 1;

			sum += checkBasinPosition(x - 1, y);
			sum += checkBasinPosition(x + 1, y);
			sum += checkBasinPosition(x, y - 1);
			sum += checkBasinPosition(x, y + 1);

			basins.push(sum);
		}
	}

	const largest = basins.sort((a, b) => b - a).slice(0, 3);
	return largest.reduce((total, basin) => total * basin);
};
