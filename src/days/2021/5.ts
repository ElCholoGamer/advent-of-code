import { AoCPart } from '../../types';

interface Line {
	from: [number, number];
	to: [number, number];
}

function markLines(grid: number[][], lines: Line[]) {
	function increment(x: number, y: number) {
		grid[x] ||= [];
		grid[x][y] = (grid[x][y] || 0) + 1;
	}

	for (const { from, to } of lines) {
		const vel = [Math.sign(to[0] - from[0]), Math.sign(to[1] - from[1])];
		const pos = [...from];

		increment(pos[0], pos[1]);

		while (pos[0] !== to[0] || pos[1] !== to[1]) {
			pos[0] += vel[0];
			pos[1] += vel[1];

			increment(pos[0], pos[1]);
		}
	}

	return grid;
}

function parseLine(line: string): Line {
	const [startStr, endStr] = line.split(' -> ');

	return {
		from: startStr.split(',').map(Number) as [number, number],
		to: endStr.split(',').map(Number) as [number, number],
	};
}

export const part1: AoCPart = input => {
	const grid: number[][] = [[]];

	const lines = input
		.map(parseLine)
		.filter(line => line.from[0] === line.to[0] || line.from[1] === line.to[1]); // Ignore diagonals

	markLines(grid, lines);

	return grid.reduce((acc, column) => acc + column.reduce((a, p) => a + +(p >= 2), 0), 0);
};

export const part2: AoCPart = input => {
	const lines = input.map(parseLine);
	const grid = markLines([[]], lines);

	return grid.reduce((acc, column) => acc + column.reduce((a, p) => a + +(p >= 2), 0), 0);
};
