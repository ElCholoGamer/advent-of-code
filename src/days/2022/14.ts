import { AoCPart } from '../../types';
import { ExtendableGrid } from '../../utils/extendable-grid';
import { Vector2 } from '../../utils/vector';

const enum Tile {
	AIR,
	ROCK,
	SAND,
}

function buildGrid(input: string[]) {
	const paths = input.map(line =>
		line.split(' -> ').map(s => Vector2.fromArray(s.split(',').map(Number)))
	);
	const grid = new ExtendableGrid(Tile.AIR);

	for (const path of paths) {
		for (let i = 0; i < path.length - 1; i++) {
			let from = path[i].clone();
			const to = path[i + 1];
			const step = to.clone().subtract(from).sign();

			while (!from.equals(to)) {
				grid.set(from.x, from.y, Tile.ROCK);
				from.add(step);
			}
			grid.set(to.x, to.y, Tile.ROCK);
		}
	}

	return grid;
}

export const part1: AoCPart = input => {
	const grid = buildGrid(input);

	for (let sandUnits = 0; ; sandUnits++) {
		const sandPos = new Vector2(500, 0);

		while (true) {
			if (sandPos.y >= grid.height - 1) return sandUnits;

			const nextMove = [0, -1, 1].find(
				xMove => grid.get(sandPos.x + xMove, sandPos.y + 1) === Tile.AIR
			);

			if (nextMove === undefined) {
				grid.set(sandPos.x, sandPos.y, Tile.SAND);
				break;
			}

			sandPos.x += nextMove;
			sandPos.y++;
		}
	}
};

export const part2: AoCPart = input => {
	const grid = buildGrid(input);
	const floor = grid.height;

	for (let sandUnits = 0; ; sandUnits++) {
		const sandPos = new Vector2(500, 0);

		while (true) {
			if (sandPos.y === floor) {
				grid.set(sandPos.x, sandPos.y, Tile.SAND);
				break;
			}

			const nextMove = [0, -1, 1].find(
				xMove => grid.get(sandPos.x + xMove, sandPos.y + 1, Tile.AIR) === Tile.AIR
			);

			if (nextMove === undefined) {
				if (sandPos.y === 0) return sandUnits + 1;

				grid.set(sandPos.x, sandPos.y, Tile.SAND);
				break;
			}

			sandPos.x += nextMove;
			sandPos.y++;
		}
	}
};
