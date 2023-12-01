import { AoCPart } from '../../types';

export const part1: AoCPart = (input) => {
	let sum = 0;

	for (const line of input) {
		const chars = line.split('');
		const firstDigit = chars.find((c) => !Number.isNaN(Number(c)))!;
		const lastDigit = chars.findLast((c) => !Number.isNaN(Number(c)))!;

		sum += Number(firstDigit + lastDigit);
	}

	return sum;
};

const NUMBERS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function findFirstOccurrence(str: string): number {
	let currentIndex = -1;
	let num = -1;

	for (let n = 0; n < NUMBERS.length; n++) {
		const indexOfStr = str.indexOf(NUMBERS[n]);
		if (indexOfStr !== -1 && (indexOfStr < currentIndex || currentIndex === -1)) {
			currentIndex = indexOfStr;
			num = n + 1;
		}
	}

	const digitIndex = str.split('').findIndex((c) => !Number.isNaN(Number(c)));
	if (digitIndex !== -1 && (digitIndex < currentIndex || currentIndex === -1)) {
		return Number(str[digitIndex]);
	}

	return num;
}

function findLastOccurrence(str: string): number {
	let currentIndex = -1;
	let num = -1;

	for (let n = 0; n < NUMBERS.length; n++) {
		const indexOfStr = str.lastIndexOf(NUMBERS[n]);
		if (indexOfStr !== -1 && (indexOfStr > currentIndex || currentIndex === -1)) {
			currentIndex = indexOfStr;
			num = n + 1;
		}
	}
	const digitIndex = str.split('').findLastIndex((c) => !Number.isNaN(Number(c)));
	if (digitIndex !== -1 && (digitIndex > currentIndex || currentIndex === -1)) {
		return Number(str[digitIndex]);
	}

	return num;
}

export const part2: AoCPart = (input) => {
	let sum = 0;

	for (const line of input) {
		const firstDigit = findFirstOccurrence(line);
		const lastDigit = findLastOccurrence(line);

		sum += Number(firstDigit + lastDigit);
	}

	return sum;
};
