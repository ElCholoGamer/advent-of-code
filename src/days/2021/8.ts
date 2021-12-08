import { AoCPart } from '../../types';

interface Entry {
	patterns: Record<string, number>;
	outputs: string[];
}

function parseEntry(line: string): Entry {
	const [patternsStr, outputsStr] = line.split(' | ');

	return {
		patterns: patternsStr.split(' ').reduce((obj, pattern) => {
			const key = pattern.split('').sort().join('');
			return { ...obj, [key]: -1 };
		}, {}),
		outputs: outputsStr.split(' '),
	};
}

export const part1: AoCPart = input => {
	const entries = input.map(parseEntry);

	let count = 0;

	for (const entry of entries) {
		for (const output of entry.outputs) {
			if (
				output.length === 2 ||
				output.length === 4 ||
				output.length === 3 ||
				output.length === 7
			) {
				count++;
			}
		}
	}

	return count;
};

export const part2: AoCPart = input => {
	const entries = input.map(parseEntry);

	for (const entry of entries) {
		const patterns = Object.keys(entry.patterns);

		// Set initial values by using pattern length to infer its destination
		for (const pattern of patterns) {
			if (pattern.length === 2) {
				entry.patterns[pattern] = 1;
			} else if (pattern.length === 4) {
				entry.patterns[pattern] = 4;
			} else if (pattern.length === 3) {
				entry.patterns[pattern] = 7;
			} else if (pattern.length === 7) {
				entry.patterns[pattern] = 8;
			}
		}

		// Advanced technique
		// Uses available numbers (1, 4, 7, 8) to infer the rest
		for (const pattern of patterns) {
			const chars = pattern.split('');

			if (pattern.length === 6) {
				// Might be 0, 6 or 9
				const oneChars = patterns.find(pattern => entry.patterns[pattern] === 1)!.split('');

				if (oneChars.some(oneChar => !chars.includes(oneChar))) {
					entry.patterns[pattern] = 6; // Pattern is six
				} else {
					// Might be 0 or 9
					const fourChars = patterns.find(pattern => entry.patterns[pattern] === 4)!.split('');
					const isZero = fourChars.some(fourChar => !chars.includes(fourChar));

					entry.patterns[pattern] = isZero ? 0 : 9;
				}
			} else if (pattern.length === 5) {
				// Might be 2, 3 or 5
				const oneChars = patterns.find(pattern => entry.patterns[pattern] === 1)!.split('');

				if (oneChars.every(oneChar => chars.includes(oneChar))) {
					entry.patterns[pattern] = 3; // Pattern is 3
				} else {
					// Number might be 2 or 5
					const fourChars = patterns.find(pattern => entry.patterns[pattern] === 4)!.split('');

					let missing = 0;
					for (const fourChar of fourChars) {
						if (!chars.includes(fourChar)) missing++;
					}

					// If pattern differs from 4 by 2 segments, it's a 2, else it's a 5
					entry.patterns[pattern] = missing === 2 ? 2 : 5;
				}
			}
		}
	}

	const sums = entries.map(({ patterns, outputs }) => {
		let numberStr = '';

		for (let output of outputs) {
			output = output.split('').sort().join('');
			numberStr += patterns[output].toString();
		}

		return Number(numberStr);
	});

	console.log(sums);
	return sums.reduce((total, sum) => total + sum);
};
