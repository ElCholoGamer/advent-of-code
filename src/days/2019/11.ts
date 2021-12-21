import { AoCPart, Coordinate2D } from '../../types';
import { IntcodeProgram } from './intcode';

function paintTiles(tiles: Map<string, boolean>, programBody: string) {
	const program = new IntcodeProgram(programBody);

	const pos: Coordinate2D = [0, 0];
	let direction: Coordinate2D = [0, 1];

	// true: white, false: black, undefined: black & unpainted
	while (true) {
		program.input(+(tiles.get(pos.join(',')) || 0));

		const color = program.nextOutput();
		if (color === undefined) break;

		const turnDirection = program.nextOutput();
		if (turnDirection === undefined) throw new Error('checking just in case');

		tiles.set(pos.join(','), Number(color) === 1);

		if (turnDirection === 0) {
			// Turn left
			direction = [direction[1], -direction[0]];
		} else {
			// Turn right
			direction = [-direction[1], direction[0]];
		}

		pos[0] += direction[0];
		pos[1] += direction[1];
	}
}

export const part1: AoCPart = ([input]) => {
	const tiles = new Map<string, boolean>();
	paintTiles(tiles, input);

	return tiles.size;
};

export const part2: AoCPart = ([input]) => {
	const tiles = new Map<string, boolean>();
	tiles.set('0,0', true);

	paintTiles(tiles, input);

	const coords = [...tiles.keys()].map(coords => coords.split(',').map(Number));
	const xs = coords.map(c => c[0]);
	const ys = coords.map(c => c[1]);

	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);

	const lines: string[] = [];

	for (let y = maxY; y >= minY; y--) {
		let line = '';

		for (let x = maxX; x >= minX; x--) {
			line += tiles.get(`${x},${y}`) ? '▮' : ' ';
		}

		lines.push(line.split('').join(' '));
	}

	return '\n' + lines.join('\n');
};
