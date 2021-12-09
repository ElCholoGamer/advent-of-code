import { AoCPart } from '../../types';
import { Grid2D } from '../../utils';

function parseInput(input: string[]) {
	const grid = new Grid2D<GridItem>();

	for (let y = 0; y < input.length; y++) {
		const line = input[y];
		for (let x = 0; x < line.length; x++) {
			grid.set(x, y, { depth: Number(line[x]), added: false });
		}
	}

	return grid;
}

export const part1: AoCPart = input => {
	const grid = parseInput(input);

	let totalRisk = 0;

	for (const [x, y] of grid.keys()) {
		const item = grid.get(x, y)!;
		const def: GridItem = { depth: 10, added: false };

		if (
			grid.getOrDefault(x - 1, y, def).depth > item.depth &&
			grid.getOrDefault(x + 1, y, def).depth > item.depth &&
			grid.getOrDefault(x, y - 1, def).depth > item.depth &&
			grid.getOrDefault(x, y + 1, def).depth > item.depth
		) {
			totalRisk += item.depth + 1;
		}
	}

	return totalRisk;
};

interface GridItem {
	depth: number;
	added: boolean;
}

export const part2: AoCPart = input => {
	const grid = parseInput(input);
	const basins: number[] = [];

	function checkBasinPosition(x: number, y: number): number {
		const item = grid.get(x, y);
		if (!item || item.added || item.depth === 9) return 0;

		let sum = 1;
		item.added = true;

		function addBasin(x: number, y: number): number {
			if (!item) return 0;

			const item2 = grid.get(x, y);
			if (!item2 || item2.depth === 9 || item2.added || item2.depth < item.depth) return 0;

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

	for (const [x, y] of grid.keys()) {
		const item = grid.get(x, y)!;
		const def: GridItem = { depth: 10, added: false };

		// Only start from lowest points
		if (
			grid.getOrDefault(x - 1, y, def).depth < item.depth ||
			grid.getOrDefault(x + 1, y, def).depth < item.depth ||
			grid.getOrDefault(x, y - 1, def).depth < item.depth ||
			grid.getOrDefault(x, y + 1, def).depth < item.depth
		) {
			continue;
		}

		let sum = 1;

		sum += checkBasinPosition(x - 1, y);
		sum += checkBasinPosition(x + 1, y);
		sum += checkBasinPosition(x, y - 1);
		sum += checkBasinPosition(x, y + 1);

		basins.push(sum);
	}

	const largest = basins.sort((a, b) => b - a).slice(0, 3);
	return largest.reduce((total, basin) => total * basin);
};
