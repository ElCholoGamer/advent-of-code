import { AoCPart } from '../../types';

const enum Direction {
	UP,
	RIGHT,
	DOWN,
	LEFT,
}

const enum TileType {
	EMPTY,
	LEFT_MIRROR,
	RIGHT_MIRROR,
	V_SPLIT,
	H_SPLIT,
}

interface Tile {
	type: TileType;
	energizes: Direction[];
}

interface Beam {
	pos: [number, number];
	direction: Direction;
}

const toTheRight = (direction: Direction) => (direction + 1) % 4;
const opposite = (direction: Direction) => (direction + 2) % 4;
const toTheLeft = (direction: Direction) => (direction + 3) % 4;

function parseGrid(input: string[]): Tile[][] {
	const grid: Tile[][] = [...Array(input[0].length)].map(() =>
		[...Array(input.length)].map(() => ({
			type: TileType.EMPTY,
			energizes: [],
		})),
	);

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			const char = input[y][x];
			const tile = grid[x][y];

			switch (char) {
				case '/':
					tile.type = TileType.LEFT_MIRROR;
					break;
				case '\\':
					tile.type = TileType.RIGHT_MIRROR;
					break;
				case '|':
					tile.type = TileType.V_SPLIT;
					break;
				case '-':
					tile.type = TileType.H_SPLIT;
					break;
			}
		}
	}

	return grid;
}

function runBeamsAndCountEnergized(
	initialGrid: Tile[][],
	start: [number, number],
	initialDirection: Direction,
) {
	const grid = initialGrid.map((row) =>
		row.map((tile) => ({ type: tile.type, energizes: [...tile.energizes] })),
	);
	let beams: Beam[] = [{ pos: start, direction: initialDirection }];
	let energizedCount = 0;

	while (beams.length !== 0) {
		const toDelete: Beam[] = [];

		for (const beam of beams) {
			switch (beam.direction) {
				case Direction.UP:
					beam.pos[1]--;
					break;
				case Direction.RIGHT:
					beam.pos[0]++;
					break;
				case Direction.DOWN:
					beam.pos[1]++;
					break;
				case Direction.LEFT:
					beam.pos[0]--;
			}

			if (
				beam.pos[0] < 0 ||
				beam.pos[0] >= grid.length ||
				beam.pos[1] < 0 ||
				beam.pos[1] >= grid[0].length
			) {
				toDelete.push(beam);
				continue;
			}

			const tile = grid[beam.pos[0]][beam.pos[1]];
			if (
				tile.energizes.includes(beam.direction) ||
				tile.energizes.includes(opposite(beam.direction))
			) {
				toDelete.push(beam);
				continue;
			}

			if (tile.energizes.length === 0) {
				energizedCount++;
			}

			tile.energizes.push(beam.direction);

			switch (tile.type) {
				case TileType.V_SPLIT:
					if (
						beam.direction === Direction.LEFT ||
						beam.direction === Direction.RIGHT
					) {
						beam.direction = Direction.UP;
						beams.push({
							direction: Direction.DOWN,
							pos: [...beam.pos],
						});
					}
					break;
				case TileType.H_SPLIT:
					if (
						beam.direction === Direction.UP ||
						beam.direction === Direction.DOWN
					) {
						beam.direction = Direction.RIGHT;
						beams.push({
							direction: Direction.LEFT,
							pos: [...beam.pos],
						});
					}
					break;
				case TileType.LEFT_MIRROR:
					if (
						beam.direction === Direction.UP ||
						beam.direction === Direction.DOWN
					) {
						beam.direction = toTheRight(beam.direction);
					} else {
						beam.direction = toTheLeft(beam.direction);
					}
					break;
				case TileType.RIGHT_MIRROR:
					if (
						beam.direction === Direction.UP ||
						beam.direction === Direction.DOWN
					) {
						beam.direction = toTheLeft(beam.direction);
					} else {
						beam.direction = toTheRight(beam.direction);
					}
					break;
			}
		}

		beams = beams.filter((beam) => !toDelete.includes(beam));
	}

	return energizedCount;
}

export const part1: AoCPart = (input) => {
	const grid = parseGrid(input);
	return runBeamsAndCountEnergized(grid, [-1, 0], Direction.RIGHT);
};

export const part2: AoCPart = (input) => {
	const grid = parseGrid(input);
	let maxCount = 0;

	for (let x = 0; x < grid.length; x++) {
		maxCount = Math.max(
			maxCount,
			runBeamsAndCountEnergized(grid, [x, -1], Direction.DOWN),
			runBeamsAndCountEnergized(grid, [x, grid[0].length], Direction.UP),
		);
	}

	for (let y = 0; y < grid[0].length; y++) {
		maxCount = Math.max(
			maxCount,
			runBeamsAndCountEnergized(grid, [-1, y], Direction.RIGHT),
			runBeamsAndCountEnergized(grid, [grid.length, y], Direction.LEFT),
		);
	}

	return maxCount;
};
