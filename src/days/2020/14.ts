import { AoCPart } from '../../types';

function replaceAt(str: string, index: number, replacement: string) {
	return str.substr(0, index) + replacement + str.substr(index + 1, str.length);
}

const posRegex = /\[([0-9]+)\]/;

export const part1: AoCPart = (input) => {
	let mask: [string, number][] = [];
	const memory: number[] = [];

	input.forEach((line) => {
		const [action, value] = line.split(' = ');

		// Assign mask
		if (action === 'mask') {
			mask = value
				.split('')
				.map<[string, number]>((v, i) => [v, i])
				.filter((e) => e[0] !== 'X');
			return;
		}

		// Convert value to binary and fill missing zeros
		let binary = Number(value).toString(2).padStart(36, '0');

		// Apply mask to binary
		mask.forEach(([v, i]) => (binary = replaceAt(binary, i, v)));

		// Assing position to number
		const pos = Number((action.match(posRegex) || [])[1]);
		memory[pos] = parseInt(binary, 2);
	});

	return Object.values(memory).reduce((acc, val) => acc + val);
};

export const part2: AoCPart = (input) => {
	let mask = '0'.repeat(36);
	const memory: number[] = [];

	input.forEach((line) => {
		const [action, value] = line.split(' = ');

		// Assign a new mask
		if (action === 'mask') {
			mask = value;
			return;
		}

		const numValue = Number(value);

		// Get position as binary
		const pos = Number((action.match(posRegex) || [])[1])
			.toString(2)
			.padStart(36, '0');

		// Apply mask to position
		const maskedPos = pos.split('').map((char, index) => {
			const maskChar = mask[index];
			if (maskChar === '0') return char;

			return maskChar;
		});

		// Get all positions of X
		const xIndexes = maskedPos
			.map<[string, number]>((c, i) => [c, i])
			.filter((c) => c[0] === 'X')
			.map((c) => c[1]);

		// Get all permutations for floating numbers
		const maxNumber = parseInt('1'.repeat(xIndexes.length), 2);
		const permutations = [...Array(maxNumber + 1)].map((e, i) =>
			i.toString(2).padStart(xIndexes.length, '0'),
		);

		// Apply all permutations to the string
		permutations.forEach((perm) => {
			const copy = [...maskedPos];

			// Assign X's to their value in this permutation
			xIndexes.forEach((strIndex, index) => {
				copy[strIndex] = perm[index];
			});

			// Get position as int and assign value
			const pos = parseInt(copy.join(''), 2);
			memory[pos] = numValue;
		});
	});

	return Object.values(memory).reduce((acc, num) => acc + num);
};
