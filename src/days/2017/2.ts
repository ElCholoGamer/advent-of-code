import { AoCPart } from '../../types';

export const part1: AoCPart = input => {
	return input.reduce((acc, row) => {
		const nums = row.split(/\s+/).map(Number);
		nums.sort((a, b) => a - b);

		return acc + (nums[nums.length - 1] - nums[0]);
	}, 0);
};

export const part2: AoCPart = input => {
	return input.reduce((acc, row) => {
		const nums = row.split(/\s+/).map(num => parseInt(num));

		for (const num of nums) {
			const found = nums.find(
				otherNum => otherNum !== num && Math.max(num, otherNum) % Math.min(num, otherNum) === 0
			);
			if (!found) continue;

			return acc + Math.max(num, found) / Math.min(num, found);
		}

		return acc;
	}, 0);
};
