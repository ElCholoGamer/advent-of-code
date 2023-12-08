import { AoCPart } from '../../types';

const pairs: Record<string, string> = {
	'(': ')',
	'{': '}',
	'[': ']',
	'<': '>',
};

export const part1: AoCPart = (input) => {
	let score = 0;

	for (let line of input) {
		const regex = /(\{\})|(\[\])|(<>)|(\(\))/;
		while (regex.test(line)) {
			line = line.replace(regex, '');
		}

		const keys = Object.keys(pairs);

		for (let i = 0; i < line.length - 1; i++) {
			const char = line[i];

			if (keys.includes(char)) {
				const nextChar = line[i + 1];
				if (!keys.includes(nextChar) && nextChar !== pairs[char]) {
					switch (nextChar) {
						case ')':
							score += 3;
							break;
						case ']':
							score += 57;
							break;
						case '}':
							score += 1197;
							break;
						case '>':
							score += 25137;
							break;
						default:
							throw new Error(`Invalid next character: "${nextChar}"`);
					}
				}
			}
		}
	}

	return score;
};

export const part2: AoCPart = (input) => {
	const regex = /(\{\})|(\[\])|(<>)|(\(\))/;
	const incompleteLines = input.filter((line) => {
		while (regex.test(line)) {
			line = line.replace(regex, '');
		}

		const keys = Object.keys(pairs);

		for (let i = 0; i < line.length - 1; i++) {
			const char = line[i];

			if (keys.includes(char)) {
				const nextChar = line[i + 1];
				if (!keys.includes(nextChar) && nextChar !== pairs[char]) {
					return false;
				}
			}
		}

		return Object.keys(pairs).includes(line[line.length - 1]);
	});

	const scores: number[] = [];

	for (let line of incompleteLines) {
		while (regex.test(line)) {
			line = line.replace(regex, '');
		}

		let score = 0;

		while (line.length > 0) {
			score *= 5;
			const autoCompleteWith = pairs[line[line.length - 1]];
			switch (autoCompleteWith) {
				case ')':
					score += 1;
					break;
				case ']':
					score += 2;
					break;
				case '}':
					score += 3;
					break;
				case '>':
					score += 4;
					break;
				default:
					throw new Error(
						`Invalid autocomplete character: "${autoCompleteWith}"`,
					);
			}

			line = line.substring(0, line.length - 1);
		}

		scores.push(score);
	}

	return scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];
};
