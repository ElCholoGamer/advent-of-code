import { AoCPart } from '../../types';

export const part1: AoCPart = (input) => {
	return input.map(Number).reduce((a, b) => a + b);
};

export const part2: AoCPart = (input) => {
	const seenFrequencies = new Set<number>();
	const changes = input.map(Number);

	let index = 0;
	let freq = 0;

	while (true) {
		freq += changes[index];

		if (seenFrequencies.has(freq)) break;

		seenFrequencies.add(freq);
		index = ++index % changes.length;
	}

	return freq;
};
