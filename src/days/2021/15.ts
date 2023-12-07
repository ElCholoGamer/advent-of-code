import { AoCPart } from '../../types';
import PriorityQueue from '../../utils/structures/priority-queue';

interface Cell {
	risk: number;
	visited: boolean;
	totalRisk: number;
}

function parseInput(input: string[]): Cell[][] {
	const cells: Cell[][] = [[]];

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			cells[x] ||= [];
			cells[x][y] = {
				risk: Number(input[y][x]),
				visited: false,
				totalRisk: Infinity,
			};
		}
	}

	return cells;
}

function dijkstra(cells: Cell[][], startX: number, startY: number) {
	cells[startX][startY].totalRisk = 0;
	cells[startX][startY].visited = true;

	const queue = new PriorityQueue<[x: number, y: number]>();
	queue.push([startX, startY], 0);

	while (queue.size) {
		const [x, y] = queue.shift()!;
		const cell = cells[x][y];

		const branches = [
			[x - 1, y],
			[x + 1, y],
			[x, y - 1],
			[x, y + 1],
		];

		for (const [bX, bY] of branches) {
			const branch = cells[bX]?.[bY];
			if (!branch || branch.visited) continue;

			branch.totalRisk = cell.totalRisk + branch.risk;
			branch.visited = true;
			queue.push([bX, bY], branch.totalRisk);
		}
	}
}

export const part1: AoCPart = async (input) => {
	const cells = parseInput(input);
	dijkstra(cells, 0, 0);

	const lastColumn = cells[cells.length - 1];
	return lastColumn[lastColumn.length - 1].totalRisk;
};

export const part2: AoCPart = async (input) => {
	const cells = parseInput(input);
	const ogWidth = cells.length;
	const ogHeight = Math.max(...cells.map((column) => column.length));

	// Expand grid x5
	for (let tileX = 0; tileX < 5; tileX++) {
		for (let tileY = 0; tileY < 5; tileY++) {
			for (let x = 0; x < ogWidth; x++) {
				for (let y = 0; y < ogHeight; y++) {
					let risk = cells[x][y].risk + tileX + tileY;

					while (risk > 9) risk -= 9;

					const netX = ogWidth * tileX + x;
					const netY = ogHeight * tileY + y;

					cells[netX] ||= [];
					cells[netX][netY] = {
						risk,
						totalRisk: Infinity,
						visited: false,
					};
				}
			}
		}
	}

	dijkstra(cells, 0, 0);

	const lastColumn = cells[cells.length - 1];
	return lastColumn[lastColumn.length - 1].totalRisk;
};
