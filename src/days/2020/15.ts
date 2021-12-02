import { AoCPart } from '../../types';

export const part1: AoCPart = ([input]) => {
	const initialNumbers = input.split(',').map(str => Number(str));
	const turns = [...initialNumbers];

	while (turns.length < 2020) {
		const index = turns.length - 1;
		const last = turns[index];

		const foundIndex = turns.slice(0, turns.length - 1).lastIndexOf(last);
		if (foundIndex === -1 || foundIndex === index) {
			// First time
			turns.push(0);
			continue;
		}

		// Already in array
		const diff = index - foundIndex;
		turns.push(diff);
	}

	return turns[2019];
};

export const part2: AoCPart = ([input]) => {
	const initialNumbers = input.split(',').map(str => Number(str));
	const turns = [...initialNumbers];

	const target = 30000000;
	const count = new Map(initialNumbers.map((num, index) => [num, index]));

	while (turns.length < target) {
		const index = turns.length - 1;
		const last = turns[index];

		if (!count.has(last)) {
			count.set(last, index);
			turns.push(0);
			continue;
		}

		// Already in array
		const lastIndex = count.get(last);
		if (lastIndex === undefined) throw new Error('Could not get last index');

		const diff = index - lastIndex;

		count.set(last, index);
		turns.push(diff);
	}

	return turns[target - 1];
};
