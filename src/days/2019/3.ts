import { AoCPart, Coordinate2D } from '../../types';

interface WireInstruction {
	distance: number;
	side: string;
}

function parseWire(line: string): WireInstruction[] {
	const instructionStrings = line.split(',');
	return instructionStrings.map(str => ({ side: str[0], distance: Number(str.substring(1)) }));
}

function movePosition(pos: Coordinate2D, side: string) {
	switch (side) {
		case 'U': // Up
			pos[1]++;
			break;
		case 'D': // Down
			pos[1]--;
			break;
		case 'R': // Right
			pos[0]++;
			break;
		case 'L': // Left
			pos[0]--;
			break;
		default:
			throw new Error('Invalid instruction side: ' + side);
	}
}

function getIntersections(wires: WireInstruction[][]): string[] {
	const grid = new Map<string, number>();

	for (const instructions of wires) {
		const pos: Coordinate2D = [0, 0];
		const visited = new Set<string>();

		for (const instruction of instructions) {
			for (let i = 0; i < instruction.distance; i++) {
				movePosition(pos, instruction.side);
				visited.add(pos.join(','));
			}
		}

		for (const pos of visited) {
			grid.set(pos, (grid.get(pos) || 0) + 1);
		}
	}

	const entries = [...grid.entries()];
	return entries.filter(entry => entry[1] >= 2).map(entry => entry[0]);
}

export const part1: AoCPart = input => {
	const wires = input.map(parseWire);
	const intersections = getIntersections(wires);

	const distances = intersections.map(pos => {
		const [x, y] = pos.split(',').map(Number);
		return Math.abs(x) + Math.abs(y);
	});

	return Math.min(...distances);
};

export const part2: AoCPart = input => {
	const wires = input.map(parseWire);
	const intersections = getIntersections(wires);

	const sums: number[] = [];

	for (const intersection of intersections) {
		const [x, y] = intersection.split(',').map(Number);
		const distances: number[] = [];

		for (const instructions of wires) {
			const pos: Coordinate2D = [0, 0];
			let steps = 0;

			main: for (const instruction of instructions) {
				for (let i = 0; i < instruction.distance; i++) {
					movePosition(pos, instruction.side);
					steps++;

					if (pos[0] === x && pos[1] === y) {
						break main;
					}
				}
			}

			distances.push(steps);
		}

		sums.push(distances.reduce((a, b) => a + b));
	}

	return Math.min(...sums);
};
