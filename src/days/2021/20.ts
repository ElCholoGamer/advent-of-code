import { AoCPart } from '../../types';

interface Rectangle {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
}

function parseGrid(rows: string[]): boolean[][] {
	const grid: boolean[][] = [];

	for (let y = 0; y < rows.length; y++) {
		const row = rows[y];
		for (let x = 0; x < row.length; x++) {
			grid[x] ||= [];
			grid[x][y] = row[x] === '#';
		}
	}

	return grid;
}

function getBounds(grid: any[][]): Rectangle {
	const xIndices = Object.keys(grid).map(Number);
	const yIndices = [
		...new Set(
			Object.values(grid)
				.map(col => Object.keys(col).map(Number))
				.flat()
		),
	];

	return {
		x1: Math.min(...xIndices),
		x2: Math.max(...xIndices),
		y1: Math.min(...yIndices),
		y2: Math.max(...yIndices),
	};
}

function addBorder<T>(grid: T[][], value: T) {
	const bounds = getBounds(grid);

	for (let x = bounds.x1 - 1; x <= bounds.x2 + 1; x++) {
		grid[x] ||= [];
		grid[x][bounds.y1 - 1] = value;
		grid[x][bounds.y2 + 1] = value;
	}

	for (let y = bounds.y1; y <= bounds.y2; y++) {
		grid[bounds.x1 - 1] ||= [];
		grid[bounds.x1 - 1][y] = value;
		grid[bounds.x2 + 1] ||= [];
		grid[bounds.x2 + 1][y] = value;
	}
}

function enhanceImage(base: boolean[][], algorithmString: string, iterations: number): boolean[][] {
	const algorithm = algorithmString.split('').map(char => char === '#');
	if (algorithm.length < 512)
		throw new Error('Enhancement algorithm must be at least 512 characters long');

	let image = base;
	addBorder(image, false);
	addBorder(image, false);

	for (let i = 0; i < iterations; i++) {
		const newImage: typeof image = [];
		const bounds = getBounds(image);

		for (let x = bounds.x1 + 1; x < bounds.x2; x++) {
			for (let y = bounds.y1 + 1; y < bounds.y2; y++) {
				let binary = '';

				for (let offY = -1; offY <= 1; offY++) {
					for (let offX = -1; offX <= 1; offX++) {
						binary += image[x + offX]?.[y + offY] ? '1' : '0';
					}
				}

				newImage[x] ||= [];
				newImage[x][y] = algorithm[parseInt(binary, 2)];
			}
		}

		const borderAlgoIndex = image[bounds.x1][bounds.y1] ? 511 : 0;
		addBorder(newImage, algorithm[borderAlgoIndex]);
		addBorder(newImage, algorithm[borderAlgoIndex]);

		image = newImage;
	}

	return image;
}

function countLitPixels(grid: boolean[][]) {
	const counts = Object.values(grid).map(column =>
		Object.values(column).reduce((sum, pixel) => sum + +pixel, 0)
	);
	return counts.reduce((a, b) => a + b);
}

export const part1: AoCPart = input => {
	const image = enhanceImage(parseGrid(input.slice(2)), input[0], 2);
	return countLitPixels(image);
};

export const part2: AoCPart = input => {
	const image = enhanceImage(parseGrid(input.slice(2)), input[0], 50);
	return countLitPixels(image);
};
