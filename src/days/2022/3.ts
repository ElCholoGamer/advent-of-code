import { AoCPart } from '../../types';
import { chunks } from '../../utils/arrays';

const itemPriority = (char: string) => {
	const code = char.charCodeAt(0);
	return code - (code >= 97 ? 96 : 38);
};

export const part1: AoCPart = (input) => {
	return input.reduce((sum, rucksack) => {
		const item = rucksack
			.split('')
			.find((char) => rucksack.includes(char, rucksack.length / 2));

		if (!item) throw new Error('Could not find a common item');
		return sum + itemPriority(item);
	}, 0);
};

export const part2: AoCPart = (input) => {
	return chunks(input, 3).reduce((sum, group) => {
		const item = group[0]
			.split('')
			.find((char) => group[1].includes(char) && group[2].includes(char));

		if (!item) throw new Error('Could not find a common item');
		return sum + itemPriority(item);
	}, 0);
};
