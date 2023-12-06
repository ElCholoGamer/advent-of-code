import { AoCPart } from '../../types';

// Naive way
export const part1: AoCPart = (input) => {
	const times = input[0].split(/:\s+/)[1].split(/\s+/).map(Number);
	const distances = input[1].split(/:\s+/)[1].split(/\s+/).map(Number);

	let prod = 1;

	for (let r = 0; r < times.length; r++) {
		let winCount = 0;

		const totalTime = times[r];
		const record = distances[r];

		for (let t = 0; t <= totalTime; t++) {
			const travelled = t * (totalTime - t);
			if (travelled > record) {
				winCount++;
			}
		}

		prod *= winCount;
	}

	return prod;
};

// Cool way in O(1)
export const part2: AoCPart = (input) => {
	const time = Number(input[0].split(/:\s+/)[1].replace(/\s+/g, ''));
	const distance = Number(input[1].split(/:\s+/)[1].replace(/\s+/g, ''));

	const midPoint = time / 2;
	const diff = Math.sqrt(time ** 2 - 4 * distance) / 2;

	let x1 = midPoint + diff;
	let x2 = midPoint - diff;

	x1 = Number.isInteger(x1) ? x1 + 1 : Math.floor(x1);
	x2 = Number.isInteger(x2) ? x2 + 1 : Math.ceil(x2);

	return x1 - x2 + 1;
};
