import { AoCPart } from '../../types';

interface Tile {
	id: number;
	patterns: boolean[][][];
	chosenPatternIndex: number | null;
	up: Tile | null;
	down: Tile | null;
	right: Tile | null;
	left: Tile | null;
}

function parseTiles(input: string[]): Tile[] {
	const tiles: Tile[] = [];

	for (const line of input) {
		if (line === '') continue;

		if (line.startsWith('Tile')) {
			const idStr = line.split(' ')[1].replace(':', '');
			tiles.push({
				id: Number(idStr),
				patterns: [[]],
				chosenPatternIndex: null,
				up: null,
				down: null,
				right: null,
				left: null,
			});
			continue;
		}

		const currentTile = tiles.at(-1)!;
		currentTile.patterns[0].push(line.split('').map((char) => char === '#'));
	}

	for (const tile of tiles) {
		// Generate permutations
		const basePattern = tile.patterns[0];
		const basePatternFlipped = basePattern.map((row) => [...row]).reverse();
		tile.patterns.push(basePatternFlipped);

		for (const base of [basePattern, basePatternFlipped]) {
			tile.patterns.push(
				// To the right
				[...Array(base.length)].map((_, i) =>
					[...Array(base.length)].map((_, j) => base[base.length - 1 - j][i]),
				),
				// To the left
				[...Array(base.length)].map((_, i) =>
					[...Array(base.length)].map((_, j) => base[j][base.length - 1 - i]),
				),
				// To the right x2
				[...Array(base.length)].map((_, i) =>
					[...Array(base.length)].map(
						(_, j) => base[base.length - 1 - i][base.length - 1 - j],
					),
				),
			);
		}
	}

	return tiles;
}

export const part1: AoCPart = (input) => {
	const tiles = parseTiles(input);

	// console.log(
	// 	tiles[0].patterns
	// 		.map((pat) =>
	// 			pat.map((row) => row.map((b) => (b ? '██' : '  ')).join('')).join('\n'),
	// 		)
	// 		.join('\n\n'),
	// );
};
