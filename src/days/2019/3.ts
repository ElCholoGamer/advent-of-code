import { AoCPart } from '../../types';
import { Vector2 } from '../../utils/structures/vector';

interface WireInstruction {
	distance: number;
	side: string;
}

function parseWire(line: string): WireInstruction[] {
	const instructionStrings = line.split(',');
	return instructionStrings.map((str) => ({
		side: str[0],
		distance: Number(str.substring(1)),
	}));
}

function movePosition(pos: Vector2, side: string) {
	switch (side) {
		case 'U': // Up
			pos.y++;
			break;
		case 'D': // Down
			pos.y--;
			break;
		case 'R': // Right
			pos.x++;
			break;
		case 'L': // Left
			pos.x--;
			break;
		default:
			throw new Error('Invalid instruction side: ' + side);
	}
}

function getIntersections(wires: WireInstruction[][]): Vector2[] {
	const grid = new Map<string, number>();

	for (const instructions of wires) {
		const pos = new Vector2(0, 0);
		const visited = new Set<string>();

		for (const instruction of instructions) {
			for (let i = 0; i < instruction.distance; i++) {
				movePosition(pos, instruction.side);
				visited.add(`${pos.x},${pos.y}`);
			}
		}

		for (const pos of visited) {
			grid.set(pos, (grid.get(pos) || 0) + 1);
		}
	}

	const intersections = [...grid.entries()].filter((entry) => entry[1] >= 2);
	return intersections.map((entry) => Vector2.fromArray(entry[0].split(',').map(Number)));
}

export const part1: AoCPart = (input) => {
	const wires = input.map(parseWire);
	const intersections = getIntersections(wires);

	const distances = intersections.map((pos) => pos.manhattanLength());

	return Math.min(...distances);
};

export const part2: AoCPart = (input) => {
	const wires = input.map(parseWire);
	const intersections = getIntersections(wires);

	const sums: number[] = [];

	for (const intersection of intersections) {
		const distances: number[] = [];

		for (const instructions of wires) {
			const pos = new Vector2(0, 0);
			let steps = 0;

			main: for (const instruction of instructions) {
				for (let i = 0; i < instruction.distance; i++) {
					movePosition(pos, instruction.side);
					steps++;

					if (pos.equals(intersection)) {
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
