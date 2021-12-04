import { AoCPart } from '../../types';

function getSumOfValues(obj: any, ignoreRed: boolean) {
	const values = Object.values(obj);
	if (ignoreRed && !Array.isArray(obj) && values.includes('red')) return 0;

	return values.reduce<number>((sum, value) => {
		if (typeof value === 'number') {
			sum += value;
		} else if (typeof value === 'object') {
			sum += getSumOfValues(value, ignoreRed);
		}

		return sum;
	}, 0);
}

export const part1: AoCPart = ([input]) => {
	const json = JSON.parse(input);
	return getSumOfValues(json, false);
};

export const part2: AoCPart = ([input]) => {
	const json = JSON.parse(input);
	return getSumOfValues(json, true);
};
