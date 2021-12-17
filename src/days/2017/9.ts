import { AoCPart } from '../../types';

export const part1: AoCPart = ([input]) => {
	input = input.replace(/!./g, '').replace(/<[^>]*>/g, '');

	function getGroups(score: number, data: string): number {
		if (data.length === 0) return 0;

		if (!data.match(/^\{.*\}$/)) throw new Error('Invalid data provided');

		data = data.substring(1, data.length - 1).replace(/\,/g, '');

		let start = 0;
		let openBrackets = 0;

		let subGroups = 0;

		for (let i = 0; i < data.length; i++) {
			if (data[i] === '{') {
				openBrackets++;
			} else if (data[i] === '}') {
				openBrackets--;
			}

			if (openBrackets === 0) {
				openBrackets = 0;
				subGroups += getGroups(score + 1, data.substring(start, i + 1));
				start = i + 1;
			}
		}

		return score + subGroups;
	}

	return getGroups(1, input);
};

export const part2: AoCPart = ([input]) => {
	input = input.replace(/!./g, '');

	const matches = input.match(/<[^>]*>/g) || [];
	return matches.reduce((sum, m) => sum + m.length - 2, 0);
};
