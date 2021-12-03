import { AoCPart } from '../../types';

export const part1: AoCPart = input => {
	let gamma = '';
	let epsilon = '';

	for (let i = 0; i < input[0].length; i++) {
		let ones = 0;
		let zeros = 0;

		for (const line of input) {
			if (line[i] === '1') {
				ones++;
			} else {
				zeros++;
			}
		}

		gamma += ones > zeros ? '1' : '0';
		epsilon += ones > zeros ? '0' : '1';
	}

	return parseInt(gamma, 2) * parseInt(epsilon, 2);
};

export const part2: AoCPart = input => {
	let inputCopy = [...input];

	for (let i = 0; i < inputCopy[0].length; i++) {
		if (inputCopy.length === 1) break;

		let ones = 0;
		let zeros = 0;

		for (const line of inputCopy) {
			if (line[i] === '1') {
				ones++;
			} else {
				zeros++;
			}
		}

		const digit = ones >= zeros ? '1' : '0';

		inputCopy = inputCopy.filter(num => num[i] === digit);
	}

	if (inputCopy.length !== 1) throw new Error('Invalid length left at input copy');

	const oxygen = parseInt(inputCopy[0], 2);

	inputCopy = [...input];

	for (let i = 0; i < inputCopy[0].length; i++) {
		if (inputCopy.length === 1) break;

		let ones = 0;
		let zeros = 0;

		for (const line of inputCopy) {
			if (line[i] === '1') {
				ones++;
			} else {
				zeros++;
			}
		}

		const digit = zeros <= ones ? '0' : '1';

		inputCopy = inputCopy.filter(num => num[i] === digit);
	}

	if (inputCopy.length !== 1) throw new Error('Invalid length left at input copy');

	const scrubber = parseInt(inputCopy[0], 2);

	return oxygen * scrubber;
};
