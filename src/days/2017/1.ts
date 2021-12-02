import { AoCPart } from '../../types';

export const part1: AoCPart = input => {
	const nums = input.trim().split('').map(Number);

	return nums.reduce((acc, num, index, arr) => {
		const next = arr[index === arr.length - 1 ? 0 : index + 1];
		return acc + +(num === next && num);
	}, 0);
};

export const part2: AoCPart = input => {
	const nums = input.trim().split('').map(Number);

	return nums.reduce((acc, num, index, arr) => {
		let nextIndex = index + arr.length / 2;
		if (nextIndex >= arr.length) nextIndex -= arr.length;

		return acc + +(num === arr[nextIndex] && num);
	}, 0);
};
