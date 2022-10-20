import { AoCPart } from '../../types';
import { PI_OVER_2 } from '../../utils';
import { Vector2 } from '../../utils/vector';
import { ExtendedIntcodeVM } from './intcode';

function paintTiles(tiles: Map<string, boolean>, programBody: string) {
	const program = new ExtendedIntcodeVM(programBody);

	const pos = new Vector2(0, 0);
	let direction = new Vector2(0, 1);

	// true: white, false: black, undefined: black & unpainted
	while (true) {
		const posKey = `${pos.x},${pos.y}`;
		program.queueInput(+(tiles.get(posKey) || 0));

		const color = program.runUntilNextOutput();
		if (color === undefined) break;

		const turnDirection = program.runUntilNextOutput();
		if (turnDirection === undefined) throw new Error('checking just in case');

		tiles.set(posKey, Number(color) === 1);

		if (turnDirection === 0) {
			direction.rotateBy(-PI_OVER_2);
		} else {
			direction.rotateBy(PI_OVER_2);
		}

		direction.round(); // Because Math.PI + sin/cos isn't completely accurate
		pos.add(direction);
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
