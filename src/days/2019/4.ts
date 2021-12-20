import { AoCPart } from '../../types';

function hasSomePair(str: string) {
	for (let i = 0; i < str.length - 1; i++) {
		if (str[i] === str[i + 1]) return true;
	}

	return false;
}

function doesNotDescend(str: string) {
	for (let i = 0; i < str.length - 1; i++) {
		if (Number(str[i]) > Number(str[i + 1])) {
			return false;
		}
	}

	return true;
}

export const part1: AoCPart = ([input]) => {
	const [min, max] = input.split('-').map(Number);

	let validPasswords = 0;

	for (let p = min; p <= max; p++) {
		const password = p.toString();
		if (password.length !== 6) continue;

		if (hasSomePair(password) && doesNotDescend(password)) {
			validPasswords++;
		}
	}

	return validPasswords;
};

function hasSomeUniquePair(str: string) {
	for (let i = 0; i < str.length - 1; i++) {
		if (str[i] === str[i + 1] && str[i - 1] !== str[i] && str[i + 2] !== str[i]) {
			return true;
		}
	}

	return false;
}

export const part2: AoCPart = ([input]) => {
	const [min, max] = input.split('-').map(Number);

	let validPasswords = 0;

	for (let p = min; p <= max; p++) {
		const password = p.toString();
		if (password.length !== 6) continue;

		if (hasSomeUniquePair(password) && doesNotDescend(password)) {
			validPasswords++;
		}
	}

	return validPasswords;
};
