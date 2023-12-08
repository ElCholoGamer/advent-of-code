import { AoCPart } from '../../types';

function reverseSelection<T>(arr: T[], position: number, length: number): T[] {
	const out = [...arr];

	for (let i = 0; i < length; i++) {
		const to = (position + i) % arr.length;
		const from = (position + length - 1 - i) % arr.length;

		out[to] = arr[from];
	}

	return out;
}

export const part1: AoCPart = ([input]) => {
	const lengths = input.split(',').map(Number);
	let marks = [...Array(256)].map((_, index) => index);

	let skipSize = 0;
	let position = 0;

	for (const length of lengths) {
		marks = reverseSelection(marks, position, length);
		position = (position + length + skipSize) % marks.length;
		skipSize++;
	}

	return marks[0] * marks[1];
};

export const part2: AoCPart = ([input]) => {
	let marks = [...Array(256)].map((_, index) => index);

	const lengths = input.split('').map((char) => char.charCodeAt(0));
	lengths.push(17, 31, 73, 47, 23);

	let skipSize = 0;
	let position = 0;

	for (let round = 0; round < 64; round++) {
		for (const length of lengths) {
			marks = reverseSelection(marks, position, length);
			position = (position + length + skipSize) % marks.length;
			skipSize++;
		}
	}

	const denseHash: number[] = [];

	for (let i = 0; i < marks.length; i += 16) {
		const block = marks.slice(i, i + 16);
		denseHash.push(block.reduce((a, b) => a ^ b));
	}

	const hexChars = denseHash.map((num) => num.toString(16).padStart(2, '0'));
	return hexChars.join('');
};
