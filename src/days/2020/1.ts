import { AoCPart } from '../../types';

export const part1: AoCPart = (inputStrings) => {
	const input = inputStrings.map(Number);

	for (const num of input) {
		const found = input.find(
			(otherNum) => otherNum !== num && otherNum + num === 2020,
		);
		if (found) return found * num;
	}

	throw new Error('Unable to find result');
};

export const part2: AoCPart = (inputStrings) => {
	const input = inputStrings.map(Number);

	for (const num1 of input) {
		for (const num2 of input) {
			const found = input.find(
				(otherNum) =>
					![num1, num2].includes(otherNum) && num1 + num2 + otherNum === 2020,
			);

			if (found) return num1 * num2 * found;
		}
	}

	throw new Error('Could not find result');
};
