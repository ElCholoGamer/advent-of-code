import { AoCPart } from '../../types';

export const part1: AoCPart = input => {
	let result = 0;

	for (let line of input) {
		result += line.length;

		line = line
			.substr(1, line.length - 2)
			.replace(/\\x[0-9a-f]{2}/g, 'H')
			.replace(/\\"/g, '"')
			.replace(/\\\\/g, '\\');

		result -= line.length;
	}

	return result;
};

export const part2: AoCPart = input => {
	let result = 0;

	for (let line of input) {
		result -= line.length;

		line = line.replace(/(\\x[0-9a-f]{2})|\\|"/gi, s => '\\' + s);

		result += line.length + 2;
	}

	return result;
};
