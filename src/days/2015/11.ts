import { AoCPart } from '../../types';

const letters = 'abcdefghijklmnopqrstuvwxyz';

function incrementString(str: string) {
	if (str === '') return '';

	const indexes = str.split('').map(char => {
		const index = letters.indexOf(char);
		if (index === -1) throw new Error(`Cannot increment character "${char}"`);

		return index;
	});

	indexes[indexes.length - 1]++;

	let wrapIndex: number;
	while ((wrapIndex = indexes.findIndex(i => i >= letters.length)) !== -1) {
		indexes[wrapIndex] -= letters.length;
		indexes[wrapIndex - 1]++;
	}

	return indexes.map(index => letters[index]).join('');
}

function hasStraight(str: string): boolean {
	for (let i = 0; i < str.length - 2; i++) {
		const charIndexes = str
			.substr(i, 3)
			.split('')
			.map(char => letters.indexOf(char));

		if (charIndexes[1] - 1 === charIndexes[0] && charIndexes[2] - 1 === charIndexes[1]) {
			return true;
		}
	}

	return false;
}

function hasPairs(str: string, pairCount: number): boolean {
	let pairs = 0;

	for (let i = 0; i < str.length - 1; i++) {
		if (str[i] !== str[i + 1]) continue;

		pairs++;
		if (pairs >= pairCount) return true;

		i++;
	}

	return false;
}

function matchesRules(password: string) {
	const forbiddenChars = ['i', 'o', 'l'];
	return (
		forbiddenChars.every(char => !password.includes(char)) &&
		hasStraight(password) &&
		hasPairs(password, 2)
	);
}

export const part1: AoCPart = async ([input]) => {
	let password = input;

	while (!matchesRules(password)) {
		password = incrementString(password);
	}

	return password;
};

export const part2: AoCPart = async input => {
	let password = <string>await part1(input);

	do {
		password = incrementString(password);
	} while (!matchesRules(password));

	return password;
};
