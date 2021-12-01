import { AoCPart } from '../../types';
import { parseInput, splitInput } from '../../utils';

export const part1: AoCPart = inputStr => {
	const input = splitInput(inputStr);

	return input.reduce((acc, line) => {
		const [side1, side2, side3] = line.trim().split(/\s+/).map(Number);

		const results = [
			[side1 + side2, side3],
			[side1 + side3, side2],
			[side2 + side3, side1],
		];

		if (results.every(([result, other]) => result > other)) acc++;
		return acc;
	}, 0);
};

export const part2: AoCPart = inputStr => {
	const input = splitInput(inputStr).join(' ').split(/\s+/).map(Number);

	const triangles = input.reduce<number[][]>((acc, num, index) => {
		if (index % 9 > 2) return acc;
		return [...acc, [num, input[index + 3], input[index + 6]]];
	}, []);

	return triangles.reduce((acc, triangle) => {
		const [side1, side2, side3] = triangle;

		const results = [
			[side1 + side2, side3],
			[side1 + side3, side2],
			[side2 + side3, side1],
		];
		return acc + +results.every(([result, other]) => result > other);
	}, 0);
};
