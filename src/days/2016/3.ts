import { AoCPart } from '../../types';

export const part1: AoCPart = (input) => {
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

export const part2: AoCPart = (input) => {
	const nums = input.join(' ').split(/\s+/).map(Number);

	const triangles = nums.reduce<number[][]>((acc, num, index) => {
		if (index % 9 > 2) return acc;
		return [...acc, [num, nums[index + 3], nums[index + 6]]];
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
