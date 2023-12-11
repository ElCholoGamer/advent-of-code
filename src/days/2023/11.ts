import { AoCPart } from '../../types';

type Galaxy = [x: number, y: number];

function solution(input: string[], expansionSize: number): number {
	const galaxies: Galaxy[] = [];

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			if (input[y][x] === '#') {
				galaxies.push([x, y]);
			}
		}
	}

	let yLimit = input.length;
	for (let y = 0; y < yLimit; y++) {
		if (!galaxies.some((g) => g[1] === y)) {
			// Empty row. Push everything down
			for (const galaxy of galaxies) {
				if (galaxy[1] > y) {
					galaxy[1] += expansionSize - 1;
				}
			}

			yLimit += expansionSize - 1;
			y += expansionSize - 1;
		}
	}

	let xLimit = input[0].length;
	for (let x = 0; x < xLimit; x++) {
		if (!galaxies.some((g) => g[0] === x)) {
			// Empty column. Push everything to the right
			for (const galaxy of galaxies) {
				if (galaxy[0] > x) {
					galaxy[0] += expansionSize - 1;
				}
			}

			xLimit += expansionSize - 1;
			x += expansionSize - 1;
		}
	}

	let sum = 0;

	for (let g1 = 0; g1 < galaxies.length; g1++) {
		for (let g2 = g1 + 1; g2 < galaxies.length; g2++) {
			if (g1 === g2) continue;
			const ga1 = galaxies[g1];
			const ga2 = galaxies[g2];

			sum += Math.abs(ga1[0] - ga2[0]) + Math.abs(ga1[1] - ga2[1]);
		}
	}

	return sum;
}

export const part1: AoCPart = (input) => solution(input, 2);
export const part2: AoCPart = (input) => solution(input, 1_000_000);
