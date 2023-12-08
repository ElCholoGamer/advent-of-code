import { AoCPart } from '../../types';

function replaceAt(str: string, index: number, replacement: string) {
	return str.substr(0, index) + replacement + str.substr(index + 1, str.length);
}

export const part1: AoCPart = (input) => {
	let validPassphrases = 0;

	for (const line of input) {
		const words = line.split(/\s+/);

		if (words.every((word, index) => words.indexOf(word) === index)) {
			validPassphrases++;
		}
	}

	return validPassphrases;
};

export const part2: AoCPart = (input) => {
	let validPassphrases = 0;

	for (const line of input) {
		const words = line.split(/\s+/);

		validPassphrases += +words.every((word, index) => {
			const sortedWord = word.split('').sort().join('');
			for (let i = 0; i < words.length; i++) {
				if (i === index || words[i].length !== word.length) continue;

				const sortedOtherWord = words[i].split('').sort().join('');
				if (sortedWord === sortedOtherWord) return false;
			}

			return true;
		});
	}

	return validPassphrases;
};
