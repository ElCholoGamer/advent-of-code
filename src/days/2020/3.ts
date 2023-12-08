import { AoCPart } from '../../types';
import { sleep } from '../../utils';

function part1WithCoords(input: string[]): [number, string[][]] {
	const coords: string[][] = [];
	input.forEach((row, y) => {
		row.split('').forEach((letter, x) => {
			if (!coords[x]) coords[x] = [];
			coords[x][y] = letter;
		});
	});

	let trees = 0;
	let x = 0;

	// Loop until Y reaches end of input
	for (let y = 0; y < coords[0].length; y++) {
		if (x >= coords.length) x -= coords.length; // This wraps the X position around
		if (coords[x][y] === '#') trees++;

		x += 3;
	}

	return [trees, coords];
}

export const part1: AoCPart = (input) => {
	return part1WithCoords(input)[0];
};

export const part2: AoCPart = async (input, options) => {
	if (process.argv.includes('--animated')) {
		return await part2Animated(input, options);
	} else {
		return part2Normal(input, options);
	}
};

const part2Normal: AoCPart = (input) => {
	const coords = part1WithCoords(input)[1];
	const slopes = [
		[1, 1],
		[3, 1],
		[5, 1],
		[7, 1],
		[1, 2],
	];

	return slopes.reduce((acc, slope) => {
		let trees = 0;
		let x = 0;

		// Loop until Y reaches end of input
		for (let y = 0; y < coords[0].length; y += slope[1]) {
			if (x >= coords.length) x -= coords.length; // This wraps the X position around
			if (coords[x][y] === '#') trees++;

			x += slope[0];
		}

		return acc * trees;
	}, 1);
};

const part2Animated: AoCPart = async (input) => {
	const coords = [...Array(input[0].length)].map(() => Array(input.length));

	input.forEach((line, y) => {
		line.split('').forEach((char, x) => (coords[x][y] = char === '#'));
	});

	const pos = [0, 0];
	const slope = [3, 1];

	while (pos[1] < coords[0].length) {
		const [extraX, extraY] = [60, 15];
		const sliced = coords
			.slice(Math.max(pos[0] - extraX, 0), pos[0] + extraX)
			.map((col) => col.slice(Math.max(pos[1] - extraY, 0), pos[1] + extraY));

		const lines = [];
		for (let y = 0; y < sliced[0].length; y++) {
			let line = '';
			for (let x = pos[0] - extraX; x < pos[0] + extraX; x++) {
				let copy = x;
				while (copy < 0) copy += sliced.length;
				copy = copy % sliced.length;

				line += sliced[copy][y] ? '△' : '.';
			}
			lines.push(line);
		}

		if (lines.length > extraY) {
			const middleLine = lines[extraY];
			lines[extraY] =
				middleLine.substr(0, extraX - 1) + '▮' + middleLine.substr(extraX);
		}

		console.clear();
		lines.forEach((line) => console.log(line));

		pos[0] += slope[0];
		pos[1] += slope[1];

		if (pos[0] >= coords.length) pos[0] -= coords.length;
		await sleep(100);
	}

	return '(No result)';
};
