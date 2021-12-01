import { AoCPart } from '../../types';
import { splitInput } from '../../utils';

function getLetters(input: string[]): string[][] {
	const letters: string[][] = [];

	input.forEach((line, y) => {
		line.split('').forEach((char, x) => {
			if (!letters[x]) letters[x] = [];
			letters[x][y] = char;
		});
	});

	return letters;
}

export const part1: AoCPart = inputStr => {
	const input = splitInput(inputStr);
	const letters = getLetters(input);

	const repeated = letters.map(chars => {
		const count = chars.reduce<Record<string, number>>((acc, char) => {
			const { [char]: curr = 0 } = acc;
			return { ...acc, [char]: curr + 1 };
		}, {});

		const arr = Object.entries(count).sort((a, b) => b[1] - a[1]);
		return arr[0][0];
	});

	return repeated.join('');
};

export const part2: AoCPart = input => {
	const letters = getLetters(splitInput(input));

	const repeated = letters.map(chars => {
		const count = chars.reduce<Record<string, number>>((acc, char) => {
			const { [char]: curr = 0 } = acc;
			return { ...acc, [char]: curr + 1 };
		}, {});

		const arr = Object.entries(count).sort((a, b) => a[1] - b[1]);
		return arr[0][0];
	});

	return repeated.join('');
};
