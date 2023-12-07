import { AoCPart } from '../../types';
import { assertNonNull } from '../../utils/assertion';
import { isNumber } from '../../utils/strings';

export const part1: AoCPart = (input) => {
	let sum = 0;

	for (const line of input) {
		const chars = line.split('');
		const firstDigit = assertNonNull(chars.find(isNumber));
		const lastDigit = assertNonNull(chars.findLast(isNumber));

		sum += Number(firstDigit + lastDigit);
	}

	return sum;
};

const NUMBERS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function findFirstNumber(str: string): number | null {
	for (let i = 0; i < str.length; i++) {
		const c = str[i];

		if (isNumber(c)) return Number(c);

		for (let n = 0; n < NUMBERS.length; n++) {
			if (str.substring(i, i + NUMBERS[n].length) === NUMBERS[n]) {
				return n + 1;
			}
		}
	}

	return null;
}

function findLastNumber(str: string): number | null {
	for (let i = str.length - 1; i >= 0; i--) {
		const c = str[i];

		if (isNumber(c)) return Number(c);

		for (let n = 0; n < NUMBERS.length; n++) {
			if (str.substring(i - NUMBERS[n].length + 1, i + 1) === NUMBERS[n]) {
				return n + 1;
			}
		}
	}

	return null;
}

export const part2: AoCPart = (input) => {
	let sum = 0;

	for (const line of input) {
		const firstDigit = assertNonNull(findFirstNumber(line));
		const lastDigit = assertNonNull(findLastNumber(line));

		sum += 10 * firstDigit + lastDigit;
	}

	return sum;
};
