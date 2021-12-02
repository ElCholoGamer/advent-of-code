import { AoCPart } from '../../types';

export const part1: AoCPart = inputStrings => {
	const input = inputStrings.map(Number);

	let increments = 0;

	for (let i = 1; i < input.length; i++) {
		increments += +(input[i] > input[i - 1]);
	}

	return increments;
};

export const part2: AoCPart = inputStrings => {
	const input = inputStrings.map(Number);
	const windows = [];

	for (let i = 0; i < input.length; i += 4) {
		windows.push(input[i] + input[i + 1] + input[i + 2]);
	}

	let increments = 0;

	for (let i = 1; i < input.length; i++) {
		const window = input[i] + input[i + 1] + input[i + 2];
		const prevWindow = input[i - 1] + input[i] + input[i + 1];

		increments += +(window > prevWindow);
	}

	return increments;
};
