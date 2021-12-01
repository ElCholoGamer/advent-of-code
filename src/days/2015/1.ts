import { AoCPart } from '../../types';
import { parseInput } from '../../utils';

export const part1: AoCPart = input => {
	return input.split('').reduce((acc, char) => acc + (char === '(' ? 1 : -1), 0);
};

export const part2: AoCPart = input => {
	let floor = 0;
	let basementChar;

	for (let i = 0; i < input.length; i++) {
		floor += input[i] === '(' ? 1 : -1;

		if (floor === -1) {
			basementChar = i + 1;
			break;
		}
	}

	if (basementChar === undefined) throw new Error('Could not find basement position');

	return basementChar;
};
