import { AoCPart } from '../../types';

export const part1: AoCPart = (input) => {
	let threes = 0;
	let twos = 0;

	for (const id of input) {
		const charCounts: Record<string, number> = {};
		for (let i = 0; i < id.length; i++) {
			const char = id[i];

			charCounts[char] = (charCounts[char] || 0) + 1;
		}

		for (const char in charCounts) {
			if (charCounts[char] === 3) {
				threes++;
				break;
			}
		}

		for (const char in charCounts) {
			if (charCounts[char] === 2) {
				twos++;
				break;
			}
		}
	}

	return twos * threes;
};

export const part2: AoCPart = (input) => {
	for (let i = 0; i < input.length; i++) {
		const id = input[i];

		const matchingId = input.find((otherId, index) => {
			if (index === i || id.length !== otherId.length) return false;

			let diffChars = 0;
			for (let char = 0; char < id.length; char++) {
				if (id[char] !== otherId[char]) {
					diffChars++;
					if (diffChars > 1) return false;
				}
			}

			return diffChars === 1;
		});

		if (matchingId) {
			let chars = id
				.split('')
				.filter((char, index) => matchingId[index] === char);
			return chars.join('');
		}
	}

	throw new Error('Could not find two matching IDs');
};
