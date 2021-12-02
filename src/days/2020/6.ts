import { AoCPart } from '../../types';

export const part1: AoCPart = input => {
	const groups = input.reduce<string[]>((acc, line) => {
		if (line === '') {
			return [...acc, ''];
		} else {
			return [...acc.slice(0, acc.length - 1), (acc[acc.length - 1] || '') + line];
		}
	}, []);

	return groups.reduce((acc, group) => {
		const found = group.split('').reduce<string[]>((acc, char) => {
			if (acc.includes(char)) return acc;
			return [...acc, char];
		}, []);

		return acc + found.length;
	}, 0);
};

export const part2: AoCPart = input => {
	const groups = input.reduce<string[][]>((acc, line) => {
		if (line === '') {
			return [...acc, []];
		} else {
			return [...acc.slice(0, acc.length - 1), [...(acc[acc.length - 1] || []), line]];
		}
	}, []);

	return groups.reduce((acc, group) => {
		const { length } = group;
		const counts = group
			.join('')
			.split('')
			.reduce<Record<string, number>>((acc, char) => {
				const { [char]: curr = 0 } = acc;
				return { ...acc, [char]: curr + 1 };
			}, {});

		return acc + Object.values(counts).filter(count => count >= length).length;
	}, 0);
};
