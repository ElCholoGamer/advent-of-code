import { AoCPart } from '../../types';

export const part1: AoCPart = ([input]) => {
	const alreadyVisited = [[0, 0]];
	const pos = [0, 0];

	return input.split('').reduce((acc, char, index) => {
		// Change respective coordinate
		switch (char) {
			case '>':
				pos[0]++;
				break;
			case '<':
				pos[0]--;
				break;
			case '^':
				pos[1]--;
				break;
			case 'v':
				pos[1]++;
				break;
			default:
				throw new Error(`Invalid movement character at index ${index}`);
		}

		// Check if coordinates were already visited
		const already = alreadyVisited.some(([x, y]) => x === pos[0] && y === pos[1]);

		if (!already) {
			alreadyVisited.push([...pos]);
			return acc + 1;
		} else {
			return acc;
		}
	}, 1);
};

export const part2: AoCPart = ([input]) => {
	const alreadyVisited = [[0, 0]];

	const santa = [0, 0];
	const roboSanta = [0, 0];

	return input.split('').reduce((acc, char, index) => {
		// Choose which position to move
		const pos = index % 2 ? roboSanta : santa;

		// Change respective coordinate
		switch (char) {
			case '>':
				pos[0]++;
				break;
			case '<':
				pos[0]--;
				break;
			case '^':
				pos[1]--;
				break;
			case 'v':
				pos[1]++;
				break;
			default:
				throw new Error(`Invalid movement character at index ${index}`);
		}

		// Check if coordinates were already visited
		const already = alreadyVisited.some(([x, y]) => x === pos[0] && y === pos[1]);
		if (!already) {
			alreadyVisited.push([...pos]);
			return acc + 1;
		} else {
			return acc;
		}
	}, 1);
};
