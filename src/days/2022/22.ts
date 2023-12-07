import { AoCPart } from '../../types';
import { sleep } from '../../utils';
import { Vector2 } from '../../utils/structures/vector';

const enum Direction {
	RIGHT,
	DOWN,
	LEFT,
	UP,
}

const enum Rotation {
	RIGHT = 'R',
	LEFT = 'L',
}

const enum Tile {
	OPEN,
	WALL,
}

function parseInput(input: string[]) {
	const gridLines = input.slice(0, input.length - 2);
	const width = Math.max(...gridLines.map((l) => l.length));
	const height = gridLines.length;

	const grid = [...Array(width)].map(() => Array<Tile | null>(height).fill(null));

	for (let y = 0; y < height; y++) {
		const line = gridLines[y];
		for (let x = 0; x < line.length; x++) {
			const char = line[x];
			if (char === '.') {
				grid[x][y] = Tile.OPEN;
			} else if (char === '#') {
				grid[x][y] = Tile.WALL;
			}
		}
	}

	const instructionsLine = input.at(-1)!;
	const instructions: (number | Rotation)[] = [];

	for (let c = 0; c < instructionsLine.length; c++) {
		const char = instructionsLine[c];
		if (isNaN(Number(char))) {
			instructions.push(char as Rotation);
			continue;
		}

		let numStr = char;
		while (!isNaN(parseInt(instructionsLine[c + 1]))) {
			c++;
			numStr += instructionsLine[c];
		}

		instructions.push(parseInt(numStr));
	}

	return { grid, instructions };
}

export const part1: AoCPart = (input) => {
	const { grid, instructions } = parseInput(input);
	let pos = new Vector2(
		grid.findIndex((column) => column[0] === Tile.OPEN),
		0
	);
	let facing = Direction.RIGHT;

	for (const instruction of instructions) {
		if (typeof instruction === 'number') {
			for (let i = 0; i < instruction; i++) {
				const newPos = pos.clone();

				switch (facing) {
					case Direction.RIGHT:
						newPos.x++;
						if (newPos.x >= grid.length || grid[newPos.x][newPos.y] === null) {
							newPos.x = grid.findIndex((column) => column[newPos.y] !== null);
						}
						break;
					case Direction.DOWN:
						newPos.y++;
						if (newPos.y >= grid[0].length || grid[newPos.x][newPos.y] === null) {
							newPos.y = grid[newPos.x].findIndex((tile) => tile !== null);
						}
						break;
					case Direction.LEFT:
						newPos.x--;
						if (newPos.x < 0 || grid[newPos.x][newPos.y] === null) {
							newPos.x = grid.findLastIndex((column) => column[newPos.y] !== null);
						}
						break;
					case Direction.UP:
						newPos.y--;
						if (newPos.y < 0 || grid[newPos.x][newPos.y] === null) {
							newPos.y = grid[newPos.x].findLastIndex((tile) => tile !== null);
						}
				}

				if (grid[newPos.x][newPos.y] === Tile.WALL) break;

				pos = newPos;
			}
		} else if (instruction === Rotation.RIGHT) {
			facing = (facing + 1) % 4;
		} else {
			facing--;
			if (facing < 0) facing += 4;
		}
	}

	return 1000 * (pos.y + 1) + 4 * (pos.x + 1) + facing;
};

interface Options {
	sideLength: number;
}

interface Side {
	topLeft: Vector2;
	bottomRight: Vector2;
	connects: Record<Direction, Connection | null>;
}

interface Connection {
	index: number;
	newDirection: Direction;
}

export const part2: AoCPart<Options> = async (input, { sideLength = 50 }) => {
	const { grid, instructions } = parseInput(input);
	const sides: Side[] = [];

	for (let y = 0; y < grid[0].length; y += sideLength) {
		for (let x = 0; x < grid.length; x += sideLength) {
			if (grid[x][y] !== null && grid[x + sideLength - 1][y + sideLength - 1] !== null) {
				sides.push({
					topLeft: new Vector2(x, y),
					bottomRight: new Vector2(x + sideLength - 1, y + sideLength - 1),
					connects: {
						[Direction.RIGHT]: null,
						[Direction.DOWN]: null,
						[Direction.LEFT]: null,
						[Direction.UP]: null,
					},
				});
			}
		}
	}

	if (sides.length !== 6) throw new Error('cube must have 6 sides');

	sides[0].connects[Direction.UP] = {
		index: 5,
		newDirection: Direction.RIGHT,
	};
	sides[0].connects[Direction.LEFT] = {
		index: 3,
		newDirection: Direction.RIGHT,
	};

	sides[1].connects[Direction.UP] = {
		index: 5,
		newDirection: Direction.UP,
	};
	sides[1].connects[Direction.RIGHT] = {
		index: 4,
		newDirection: Direction.LEFT,
	};
	sides[1].connects[Direction.DOWN] = {
		index: 2,
		newDirection: Direction.LEFT,
	};

	sides[2].connects[Direction.LEFT] = {
		index: 3,
		newDirection: Direction.DOWN,
	};
	sides[2].connects[Direction.RIGHT] = {
		index: 1,
		newDirection: Direction.UP,
	};

	sides[3].connects[Direction.UP] = {
		index: 2,
		newDirection: Direction.RIGHT,
	};
	sides[3].connects[Direction.LEFT] = {
		index: 0,
		newDirection: Direction.RIGHT,
	};

	sides[4].connects[Direction.RIGHT] = {
		index: 1,
		newDirection: Direction.LEFT,
	};
	sides[4].connects[Direction.DOWN] = {
		index: 5,
		newDirection: Direction.LEFT,
	};

	sides[5].connects[Direction.RIGHT] = {
		index: 4,
		newDirection: Direction.UP,
	};
	sides[5].connects[Direction.DOWN] = {
		index: 1,
		newDirection: Direction.DOWN,
	};
	sides[5].connects[Direction.LEFT] = {
		index: 0,
		newDirection: Direction.DOWN,
	};

	let pos = sides[0].topLeft.clone();
	let facing = Direction.RIGHT;

	for (const instruction of instructions) {
		if (typeof instruction === 'number') {
			for (let i = 0; i < instruction; i++) {
				const currentSide = sides.find(
					(side) =>
						pos.x >= side.topLeft.x &&
						pos.x <= side.bottomRight.x &&
						pos.y >= side.topLeft.y &&
						pos.y <= side.bottomRight.y
				);
				if (!currentSide) throw new Error('out of bounds');

				let newPos = pos.clone();
				let newFacing: Direction = facing;

				switch (facing) {
					case Direction.RIGHT:
						newPos.x++;
						break;
					case Direction.DOWN:
						newPos.y++;
						break;
					case Direction.LEFT:
						newPos.x--;
						break;
					case Direction.UP:
						newPos.y--;
				}

				const nextTile = grid[newPos.x]?.[newPos.y] ?? null;
				if (nextTile === null) {
					const nextSideInfo: Connection | null = currentSide.connects[facing];
					if (!nextSideInfo) throw new Error('missing side connection');

					let relativeOffset: number;

					switch (facing) {
						case Direction.RIGHT:
							relativeOffset = pos.y - currentSide.topLeft.y;
							break;
						case Direction.LEFT:
							relativeOffset = currentSide.bottomRight.y - pos.y;
							break;
						case Direction.UP:
							relativeOffset = pos.x - currentSide.topLeft.x;
							break;
						case Direction.DOWN:
							relativeOffset = currentSide.bottomRight.x - pos.x;
							break;
						default:
							throw new Error('invalid facing direction');
					}

					const newSide = sides[nextSideInfo.index];

					switch (nextSideInfo.newDirection) {
						case Direction.DOWN:
							newPos.x = newSide.bottomRight.x - relativeOffset;
							newPos.y = newSide.topLeft.y;
							break;
						case Direction.UP:
							newPos.x = newSide.topLeft.x + relativeOffset;
							newPos.y = newSide.bottomRight.y;
							break;
						case Direction.LEFT:
							newPos.x = newSide.bottomRight.x;
							newPos.y = newSide.bottomRight.y - relativeOffset;
							break;
						case Direction.RIGHT:
							newPos.x = newSide.topLeft.x;
							newPos.y = newSide.topLeft.y + relativeOffset;
					}

					newFacing = nextSideInfo.newDirection;
				}

				if (grid[newPos.x][newPos.y] === Tile.WALL) break;

				pos = newPos;
				facing = newFacing;
			}
		} else if (instruction === Rotation.RIGHT) {
			facing = (facing + 1) % 4;
		} else {
			facing--;
			if (facing < 0) facing += 4;
		}
	}

	return 1000 * (pos.y + 1) + 4 * (pos.x + 1) + facing;
};
