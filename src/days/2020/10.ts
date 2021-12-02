import { AoCPart } from '../../types';

export const part1: AoCPart = inputStrings => {
	const input = inputStrings.map(Number);
	const ordered = [0, ...input.sort((a, b) => a - b)];
	const deviceAdapter = ordered[ordered.length - 1] + 3;

	const differences = [...ordered, deviceAdapter].reduce<number[]>(
		(acc, num, index, arr) => [...acc, num - (arr[index - 1] || 0)],
		[]
	);

	const threes = differences.filter(num => num === 3).length;
	const ones = differences.filter(num => num === 1).length;

	return threes * ones;
};

export const part2: AoCPart = inputStrings => {
	const input = inputStrings.map(Number);

	const ordered = [0, ...input.sort((a, b) => a - b)];

	const groups = ordered.reduce<number[][]>(
		(acc, num, index, arr) => {
			acc[acc.length - 1].push(num);
			if (arr[index + 1] - num >= 3) acc.push([]);

			return acc;
		},
		[[]]
	);

	const isValidSequence = (arr: number[]) =>
		arr.every((num, index, arr) => (arr[index + 1] || 0) - num <= 3);

	return groups.reduce((acc, group) => {
		const removable = group.filter(
			(n, index, arr) => index > 0 && index < arr.length - 1 && arr[index + 1] - arr[index - 1] <= 3
		);

		let count = 1;
		const usedSelected: number[][] = [];

		const alreadyUsed = (selected: number[]) =>
			usedSelected.some(
				arr => selected.length === arr.length && arr.every((num, index) => selected[index] === num)
			);

		for (let index = 0; index < removable.length; index++) {
			for (let size = 1; size <= removable.length; size++) {
				const selected = removable.slice(index, size);

				if (!selected.length || alreadyUsed(selected)) continue;
				usedSelected.push(selected);

				// Copy group and delete selected elements
				const copy = [...group];
				selected.forEach(num => copy.splice(copy.indexOf(num), 1));

				// Add to count if sequence is valid
				if (isValidSequence(copy)) count++;

				// Select the rest of removable numbers
				const invertSelected = removable.filter(num => !selected.includes(num));
				if (!invertSelected.length || alreadyUsed(invertSelected)) continue;
				usedSelected.push(invertSelected);

				// Remove new selected elements from new group copy
				const invertCopy = [...group];
				invertSelected.forEach(num => invertCopy.splice(invertCopy.indexOf(num), 1));

				// Add to count if sequence is valid
				if (isValidSequence(invertCopy)) count++;
			}
		}

		return acc * count;
	}, 1);
};
