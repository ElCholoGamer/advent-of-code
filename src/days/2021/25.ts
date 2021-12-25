import { AoCPart } from '../../types';

interface Cucumber {
	facing: 'east' | 'south';
}

function parseCucumbers(input: string[]): (Cucumber | null)[][] {
	const out: (Cucumber | null)[][] = [];

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			out[x] ||= [];

			const char = input[y][x];
			out[x][y] =
				char === '.'
					? null
					: {
							facing: char === '>' ? 'east' : 'south',
					  };
		}
	}

	return out;
}

function formatCucumbers(cucumbers: (Cucumber | null)[][]): string {
	const lines: string[] = [];

	for (let y = 0; y < cucumbers[0].length; y++) {
		let line = '';

		for (let x = 0; x < cucumbers.length; x++) {
			const cucumber = cucumbers[x][y];
			line += !cucumber ? '.' : cucumber.facing === 'east' ? '>' : 'v';
		}

		lines.push(line.split('').join(' '));
	}

	return lines.join('\n');
}

const cloneCucumbers = (cucumbers: (Cucumber | null)[][]): (Cucumber | null)[][] =>
	cucumbers.map(col => col.map(cucumber => (cucumber ? { ...cucumber } : null)));

export const part1: AoCPart = input => {
	let cucumbers = parseCucumbers(input);

	for (let step = 1; ; step++) {
		const newCucumbers = cloneCucumbers(cucumbers);
		let movedAtLeastOne = false;

		for (let x = 0; x < cucumbers.length; x++) {
			for (let y = 0; y < cucumbers[x].length; y++) {
				const cucumber = cucumbers[x][y];
				if (cucumber?.facing !== 'east') continue;

				const destX = (x + 1) % cucumbers.length;
				if (cucumbers[destX][y] === null) {
					newCucumbers[x][y] = null;
					newCucumbers[destX][y] = cucumber;
					movedAtLeastOne = true;
				}
			}
		}

		cucumbers = cloneCucumbers(newCucumbers);

		for (let x = 0; x < cucumbers.length; x++) {
			for (let y = 0; y < cucumbers[x].length; y++) {
				const cucumber = cucumbers[x][y];
				if (cucumber?.facing !== 'south') continue;

				const destY = (y + 1) % cucumbers[0].length;
				if (cucumbers[x][destY] === null) {
					newCucumbers[x][y] = null;
					newCucumbers[x][destY] = cucumber;
					movedAtLeastOne = true;
				}
			}
		}

		cucumbers = newCucumbers;

		if (!movedAtLeastOne) return step;
	}
};
