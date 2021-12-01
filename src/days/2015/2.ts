import { AoCPart } from '../../types';
import { splitInput } from '../../utils';

export const part1: AoCPart = inputStr => {
	const input = splitInput(inputStr);

	return input.reduce((acc, sizes) => {
		const [w, l, h] = sizes.split('x').map(Number);

		const sides = [w * l, l * h, w * h];
		const area = sides.reduce((acc, side) => acc + side * 2, 0);

		// Extra is the area of the smaller side
		const extra = sides.reduce((acc, side) => Math.min(acc, side), sides[0]);

		return acc + area + extra;
	}, 0);
};

export const part2: AoCPart = inputStr => {
	const input = splitInput(inputStr);

	return input.reduce((acc, size) => {
		const sizes = size.split('x').map(Number);
		const [w, h, l] = sizes;

		const [small1, small2] = sizes.sort((a, b) => a - b);
		const wrap = small1 * 2 + small2 * 2;
		const bow = w * h * l;

		return acc + wrap + bow;
	}, 0);
};
