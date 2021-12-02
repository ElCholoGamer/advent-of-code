import md5 from 'md5';
import { AoCPart } from '../../types';

export const part1: AoCPart = input => {
	let num = 0;
	let hash: string;

	do {
		hash = md5(input + num).toString();
		num++;
	} while (!hash.startsWith('00000'));

	return num;
};

export const part2: AoCPart = input => {
	let num = 0;
	let hash: string;

	do {
		hash = md5(input + num).toString();
		num++;
	} while (!hash.startsWith('000000'));

	return num;
};
