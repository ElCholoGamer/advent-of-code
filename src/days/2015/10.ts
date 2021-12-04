import { AoCPart } from '../../types';

function lookAndSay(sequence: string) {
	let result = '';
	let counter = 0;

	for (let i = 0; i < sequence.length; i++) {
		counter++;

		if (sequence[i] !== sequence[i + 1]) {
			result += counter.toString() + sequence[i];
			counter = 0;
		}
	}

	return result;
}

export const part1: AoCPart = ([sequence]) => {
	for (let i = 0; i < 40; i++) {
		sequence = lookAndSay(sequence);
	}

	return sequence.length;
};

export const part2: AoCPart = ([sequence]) => {
	for (let i = 0; i < 50; i++) {
		sequence = lookAndSay(sequence);
	}

	return sequence.length;
};
