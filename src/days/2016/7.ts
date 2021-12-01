import { AoCPart } from '../../types';
import { splitInput } from '../../utils';

export const part1: AoCPart = inputStr => {
	const input = splitInput(inputStr);

	const findPair = (str: string) =>
		str.split('').some((char, index, arr) => {
			const pair = arr[index + 1];
			return char !== pair && char === arr[index + 3] && pair === arr[index + 2];
		});

	return input.reduce((acc, ip) => {
		const clear = ip.replace(/\[[a-z]+\]/g, '-');
		const inBrackets = ip.replace(/(\]|^)[a-z]+(\[|$)/g, '-');

		const allowed = findPair(clear);
		const disallowed = findPair(inBrackets);

		return acc + +(allowed && !disallowed);
	}, 0);
};

export const part2: AoCPart = inputStr => {
	const input = splitInput(inputStr);

	return input.reduce((acc, ip) => {
		const clear = ip.replace(/\[[a-z]+\]/g, '--');
		const inBrackets = ip.replace(/(\]|^)[a-z]+(\[|$)/g, '--');

		const found = clear.split('').some((char, index, arr) => {
			const next = arr[index + 1];

			if (char !== next && char === arr[index + 2]) {
				const aba = next + char + next;
				return inBrackets.indexOf(aba) !== -1;
			} else {
				return false;
			}
		});

		return acc + +found;
	}, 0);
};
