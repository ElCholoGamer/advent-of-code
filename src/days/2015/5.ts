import { AoCPart } from '../../types';
import { splitInput } from '../../utils';

export const part1: AoCPart = inputStr => {
	const input = splitInput(inputStr);

	return input.reduce((acc, string) => {
		// Rule 1
		const vowels = string.match(/[aeiou]/g)?.length || 0;
		if (vowels < 3) return acc;

		// Rule 2
		const repeated = string.split('').find((letter, index, arr) => letter === arr[index + 1]);
		if (!repeated) return acc;

		// Rule 3
		const regex = /(ab|cd|pq|xy)/;
		if (regex.test(string)) return acc;

		return acc + 1;
	}, 0);
};

export const part2: AoCPart = inputStr => {
	const input = splitInput(inputStr);

	return input.reduce((acc, string) => {
		const chars = string.split('');

		// Rule 1
		const pairFound = chars.find((char, index) => {
			if (index >= chars.length - 2) return false;

			const pair = char + chars[index + 1];
			return string.replace(pair, '  ').indexOf(pair) !== -1;
		});
		if (!pairFound) return acc;

		// Rule 2
		const centerRepeat = chars.find((char, index) => char === chars[index + 2]);
		if (!centerRepeat) return acc;

		return acc + 1;
	}, 0);
};
