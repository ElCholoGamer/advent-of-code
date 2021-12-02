import { AoCPart } from '../../types';

export const part1: AoCPart = input => {
	let hPos = 0;
	let depth = 0;

	for (const line of input) {
		const [action, valueStr] = line.split(' ');
		const value = Number(valueStr);

		if (action === 'forward') {
			hPos += value;
		} else {
			depth += value * (action === 'down' ? 1 : -1);
		}
	}

	return hPos * depth;
};

export const part2: AoCPart = input => {
	let hPos = 0;
	let depth = 0;
	let aim = 0;

	for (const line of input) {
		const [action, valueStr] = line.split(' ');
		const value = Number(valueStr);

		if (action === 'forward') {
			hPos += value;
			depth += aim * value;
		} else {
			aim += value * (action === 'down' ? 1 : -1);
		}
	}

	return hPos * depth;
};
