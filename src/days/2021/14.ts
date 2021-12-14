import { AoCPart } from '../../types';

interface Insertion {
	between: string;
	add: string;
}

function parseInsertion(line: string): Insertion {
	const [between, char] = line.split(' -> ');
	return { between, add: char };
}

export const part1: AoCPart = input => {
	let polymer = input[0];
	const insertions = input.slice(2).map(parseInsertion);

	for (let step = 0; step < 10; step++) {
		let newPolymer = polymer[0];

		for (let i = 0; i < polymer.length - 1; i++) {
			const pair = polymer.substring(i, i + 2);

			for (const insertion of insertions) {
				if (insertion.between === pair) {
					newPolymer += insertion.add;
				}
			}

			newPolymer += pair[1];
		}

		polymer = newPolymer;
	}

	const counts: Record<string, number> = {};

	for (const char of polymer) {
		counts[char] = (counts[char] || 0) + 1;
	}

	const maxCount = Math.max(...Object.values(counts));
	const minCount = Math.min(...Object.values(counts));

	return maxCount - minCount;
};

export const part2: AoCPart = input => {
	const insertions = input.slice(2).map(parseInsertion);

	let pairCounts: Record<string, number> = {};

	for (let i = 0; i < input[0].length - 1; i++) {
		const pair = input[0].substring(i, i + 2);
		pairCounts[pair] = (pairCounts[pair] || 0) + 1;
	}

	for (let step = 0; step < 40; step++) {
		const newPairCounts: typeof pairCounts = {};

		for (const pair in pairCounts) {
			const match = insertions.find(insertion => insertion.between === pair);
			if (!match) {
				newPairCounts[pair] = pairCounts[pair];
				continue;
			}

			newPairCounts[pair[0] + match.add + pair[1]] = pairCounts[pair];
		}

		for (const pair in newPairCounts) {
			if (pair.length !== 3) continue;

			const first = pair.substring(0, 2);
			const last = pair.substring(1, 3);

			newPairCounts[first] = (newPairCounts[first] || 0) + newPairCounts[pair];
			newPairCounts[last] = (newPairCounts[last] || 0) + newPairCounts[pair];
			delete newPairCounts[pair];
		}

		pairCounts = newPairCounts;
	}

	const keys = Object.keys(pairCounts);

	const counts: Record<string, number> = {
		[keys[0][0]]: pairCounts[keys[0]],
	};

	for (const pair of keys) {
		counts[pair[1]] = (counts[pair[1]] || 0) + pairCounts[pair];
	}

	const maxCount = Math.max(...Object.values(counts));
	const minCount = Math.min(...Object.values(counts));

	return maxCount - minCount;
};
