import { AoCPart } from '../../types';

export const part1: AoCPart = (input) => {
	return input.reduce((acc, curr) => {
		const [times, letter, password] = curr.split(/:? /);
		const [min, max] = times.split('-').map(Number);

		const repetitions = password.split('').filter((l) => l === letter).length;
		return acc + +(repetitions >= min && repetitions <= max);
	}, 0);
};

export const part2: AoCPart = (input) => {
	return input.reduce((acc, curr) => {
		const [indexes, letter, password] = curr.split(/:? /);
		const [pos1, pos2] = indexes.split('-').map((l) => Number(l) - 1);

		return acc + (+(password[pos1] === letter) ^ +(password[pos2] === letter));
	}, 0);
};
