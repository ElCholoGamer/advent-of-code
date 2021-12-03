import { AoCPart } from '../../types';

export const part1: AoCPart = input => {
	const instructions = input.map(Number);

	let i = 0;
	let steps = 0;

	while (i >= 0 && i < instructions.length) {
		i += instructions[i]++;
		steps++;
	}

	return steps;
};

export const part2: AoCPart = input => {
	const instructions = input.map(Number);

	let i = 0;
	let steps = 0;

	while (i >= 0 && i < instructions.length) {
		const oldInstruction = instructions[i];

		instructions[i] += oldInstruction >= 3 ? -1 : 1;

		i += oldInstruction;
		steps++;
	}

	return steps;
};
