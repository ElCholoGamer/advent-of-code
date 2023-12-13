import { AoCPart } from '../../types';

const enum Tile {
	ASH,
	ROCK,
}

type Pattern = Tile[][];

function parsePatterns(input: string[]): Pattern[] {
	const patterns: Pattern[] = [[]];

	for (const line of input) {
		if (line === '') {
			patterns.push([]);
			continue;
		}

		const tiles = line
			.split('')
			.map((char) => (char === '#' ? Tile.ROCK : Tile.ASH));
		const lastPattern = patterns[patterns.length - 1];

		lastPattern.push(tiles);
	}

	return patterns;
}

export const part1: AoCPart = (input) => {
	const patterns = parsePatterns(input);

	let sum = 0;

	for (const pattern of patterns) {
		const patternWidth = pattern[0].length;
		const patternHeight = pattern.length;

		nextCol: for (let colMid = 1; colMid < patternWidth; colMid++) {
			let left = colMid - 1;
			let right = colMid;

			while (left >= 0 && right < patternWidth) {
				for (let y = 0; y < patternHeight; y++) {
					if (pattern[y][left] !== pattern[y][right]) {
						continue nextCol;
					}
				}

				left--;
				right++;
			}

			sum += colMid;
			break;
		}

		nextRow: for (let rowMid = 1; rowMid < patternHeight; rowMid++) {
			let up = rowMid - 1;
			let down = rowMid;

			while (up >= 0 && down < patternHeight) {
				for (let x = 0; x < patternWidth; x++) {
					if (pattern[up][x] !== pattern[down][x]) {
						continue nextRow;
					}
				}

				up--;
				down++;
			}

			sum += 100 * rowMid;
			break;
		}
	}

	return sum;
};

export const part2: AoCPart = (input) => {
	const patterns = parsePatterns(input);

	let sum = 0;

	nextPattern: for (const pattern of patterns) {
		const patternWidth = pattern[0].length;
		const patternHeight = pattern.length;

		nextCol: for (let colMid = 1; colMid < patternWidth; colMid++) {
			let left = colMid - 1;
			let right = colMid;

			let smudge = false;

			while (left >= 0 && right < patternWidth) {
				for (let y = 0; y < patternHeight; y++) {
					if (pattern[y][left] !== pattern[y][right]) {
						if (!smudge) {
							smudge = true;
						} else {
							// More than 1 discrepancy between columns
							continue nextCol;
						}
					}
				}

				left--;
				right++;
			}

			if (smudge) {
				sum += colMid;
				continue nextPattern;
			}
		}

		nextRow: for (let rowMid = 1; rowMid < patternHeight; rowMid++) {
			let up = rowMid - 1;
			let down = rowMid;

			let smudge = false;

			while (up >= 0 && down < patternHeight) {
				for (let x = 0; x < patternWidth; x++) {
					if (pattern[up][x] !== pattern[down][x]) {
						if (!smudge) {
							smudge = true;
						} else {
							continue nextRow;
						}
					}
				}

				up--;
				down++;
			}

			if (smudge) {
				sum += 100 * rowMid;
				continue nextPattern;
			}
		}
	}

	return sum;
};
