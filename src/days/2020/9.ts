import { AoCPart } from '../../types';

interface Options {
	preambleLength: number;
}

export const part1: AoCPart<Options> = (
	inputStrings,
	{ preambleLength = 25 },
) => {
	const input = inputStrings.map(Number);

	for (let i = 25; i < input.length; i++) {
		const num = input[i];
		const prev = input.slice(i - preambleLength, i);

		if (
			!prev.some((n) => prev.some((other) => other !== n && other + n === num))
		) {
			return num;
		}
	}

	throw new Error('Could not find result');
};

export const part2: AoCPart<Options> = async (input, options) => {
	const result = <number>await part1(input, options);

	const index = input.indexOf(result.toString());

	for (let size = 2; size < index; size++) {
		for (let i = 0; i < index - size; i++) {
			const part = input.slice(i, i + size).map(Number);
			const sum = part.reduce((acc, num) => acc + num, 0);

			if (sum === Number(result)) {
				return Math.min(...part) + Math.max(...part);
			}
		}
	}

	throw new Error('Unable to find result');
};
