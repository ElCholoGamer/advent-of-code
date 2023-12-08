import { AoCPart } from '../../types';

interface Octopus {
	light: number;
	flashed: boolean;
}

function parseOctopuses(input: string[]): Octopus[][] {
	const octopuses: Octopus[][] = [[]];

	for (let y = 0; y < input.length; y++) {
		const line = input[y];
		for (let x = 0; x < line.length; x++) {
			octopuses[x] ||= [];
			octopuses[x][y] = {
				flashed: false,
				light: Number(line[x]),
			};
		}
	}

	return octopuses;
}

function flashOctopuses(octopuses: Octopus[][]) {
	for (let x = 0; x < octopuses.length; x++) {
		for (let y = 0; y < octopuses[x].length; y++) {
			octopuses[x][y].light++;
		}
	}

	while (
		octopuses.some((col) =>
			col.some((octopus) => octopus.light > 9 && !octopus.flashed),
		)
	) {
		for (let x = 0; x < octopuses.length; x++) {
			for (let y = 0; y < octopuses[x].length; y++) {
				const octopus = octopuses[x][y];
				if (octopus.light <= 9 || octopus.flashed) continue;

				octopus.flashed = true;

				// Flash nearby octopuses
				for (let offX = -1; offX <= 1; offX++) {
					for (let offY = -1; offY <= 1; offY++) {
						if (offX === 0 && offY === 0) continue;

						const adjX = x + offX;
						const adjY = y + offY;

						if (
							adjX >= 0 &&
							adjX < octopuses.length &&
							adjY >= 0 &&
							adjY < octopuses[adjX].length
						) {
							octopuses[adjX][adjY].light++;
						}
					}
				}
			}
		}
	}
}

export const part1: AoCPart = async (input) => {
	const octopuses = parseOctopuses(input);
	let flashes = 0;

	for (let step = 0; step < 100; step++) {
		flashOctopuses(octopuses);

		for (let x = 0; x < octopuses.length; x++) {
			for (let y = 0; y < octopuses[x].length; y++) {
				if (octopuses[x][y].flashed) {
					octopuses[x][y].flashed = false;
					flashes++;
					octopuses[x][y].light = 0;
				}
			}
		}
	}

	return flashes;
};

export const part2: AoCPart = async (input) => {
	const octopuses = parseOctopuses(input);

	for (let step = 1; true; step++) {
		flashOctopuses(octopuses);

		for (let x = 0; x < octopuses.length; x++) {
			for (let y = 0; y < octopuses[x].length; y++) {
				if (octopuses[x][y].flashed) {
					octopuses[x][y].flashed = false;
					octopuses[x][y].light = 0;
				}
			}
		}

		if (
			octopuses.every((column) =>
				column.every((octopus) => octopus.light === 0),
			)
		) {
			return step;
		}
	}
};
