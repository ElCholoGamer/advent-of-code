import { AoCPart } from '../../types';

export const part1: AoCPart = ([inputStr]) => {
	const input = Number(inputStr);
	const pos: [number, number] = [0, 0];
	let direction: [number, number] = [1, 0];
	let stepsTaken = 0;
	let stepsToRotate = 1;
	let updateStepsToRotate = false;

	for (let i = 1; i < input; i++) {
		pos[0] += direction[0];
		pos[1] += direction[1];

		if (++stepsTaken >= stepsToRotate) {
			if (updateStepsToRotate) {
				stepsToRotate++;
				updateStepsToRotate = false;
			} else {
				updateStepsToRotate = true;
			}

			stepsTaken = 0;
			direction = [-direction[1], direction[0]]; // Rotate 90°
		}
	}

	return Math.abs(pos[0]) + Math.abs(pos[1]);
};

export const part2: AoCPart = ([inputStr]) => {
	const input = Number(inputStr);

	const pos: [number, number] = [0, 0];
	let direction: [number, number] = [1, 0];
	let stepsTaken = 0;
	let stepsToRotate = 1;
	let updateStepsToRotate = false;

	const grid: number[][] = [[1]];

	let value: number;

	do {
		pos[0] += direction[0];
		pos[1] += direction[1];

		value = 0;

		for (let x = -1; x <= 1; x++) {
			const checkX = pos[0] + x;
			grid[checkX] ||= [];

			for (let y = -1; y <= 1; y++) {
				const checkY = pos[1] + y;
				grid[checkY] ||= [];

				value += grid[checkX][checkY] || 0;
			}
		}

		grid[pos[0]][pos[1]] = value;

		// Rotation logic
		if (++stepsTaken >= stepsToRotate) {
			if (updateStepsToRotate) {
				stepsToRotate++;
				updateStepsToRotate = false;
			} else {
				updateStepsToRotate = true;
			}

			stepsTaken = 0;
			direction = [-direction[1], direction[0]]; // Rotate 90°
		}
	} while (value < input);

	return value;
};
