import { AoCPart } from '../../types';
import { count } from '../../utils/arrays';

enum Direction {
	UP,
	RIGHT,
	DOWN,
	LEFT,
}

function opposite(direction: Direction): Direction {
	return (direction + 2) % 4;
}

function toTheRight(direction: Direction): Direction {
	return (direction + 1) % 4;
}

function toTheLeft(direction: Direction): Direction {
	return direction === Direction.UP ? Direction.LEFT : direction - 1;
}

function moveCoordinates(
	x: number,
	y: number,
	direction: Direction,
): [number, number] {
	switch (direction) {
		case Direction.UP:
			return [x, y - 1];
		case Direction.DOWN:
			return [x, y + 1];
		case Direction.RIGHT:
			return [x + 1, y];
		case Direction.LEFT:
			return [x - 1, y];
	}
}

interface Cell {
	neighbors: Direction[];
}

interface State {
	x: number;
	y: number;
	direction: Direction;
	initialDirection: Direction;
	steps: number;
}

function parseGrid(input: string[]) {
	const grid: Cell[][] = [...Array(input[0].length)].map(() => [
		...Array(input.length),
	]);

	let startX = -1;
	let startY = -1;

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			if (input[y][x] === 'S') {
				startX = x;
				startY = y;
			}

			let neighbors: Direction[];

			const char = input[y][x];
			switch (char) {
				case '-':
					neighbors = [Direction.LEFT, Direction.RIGHT];
					break;
				case '|':
					neighbors = [Direction.UP, Direction.DOWN];
					break;
				case 'L':
					neighbors = [Direction.UP, Direction.RIGHT];
					break;
				case 'J':
					neighbors = [Direction.UP, Direction.LEFT];
					break;
				case '7':
					neighbors = [Direction.LEFT, Direction.DOWN];
					break;
				case 'F':
					neighbors = [Direction.RIGHT, Direction.DOWN];
					break;
				default:
					neighbors = [];
			}

			grid[x][y] = {
				neighbors,
			};
		}
	}

	return { grid, startX, startY };
}

export const part1: AoCPart = (input) => {
	const { grid, startX, startY } = parseGrid(input);

	let states: State[] = [
		Direction.UP,
		Direction.RIGHT,
		Direction.DOWN,
		Direction.LEFT,
	].map((dir) => ({
		x: startX,
		y: startY,
		initialDirection: dir,
		direction: dir,
		steps: 0,
	}));

	while (true) {
		const toDelete: State[] = [];

		for (const state of states) {
			[state.x, state.y] = moveCoordinates(state.x, state.y, state.direction);

			const nextCell = grid[state.x][state.y];

			if (nextCell.neighbors.includes(opposite(state.direction))) {
				state.steps++;

				if (
					states.some(
						(other) =>
							other !== state && other.x === state.x && other.y === state.y,
					)
				) {
					return state.steps;
				}

				state.direction = nextCell.neighbors.find(
					(d) => d !== opposite(state.direction),
				)!;
			} else {
				toDelete.push(state);
			}
		}

		states = states.filter((s) => !toDelete.includes(s));
	}
};

export const part2: AoCPart = (input) => {
	const { grid: gridOld, startX, startY } = parseGrid(input);

	const grid = gridOld.map((col) =>
		col.map((cell) => ({
			...cell,
			loop: false,
			direction: null as Direction | null,
			marked: false,
		})),
	);

	let states: State[] = [
		Direction.UP,
		Direction.RIGHT,
		Direction.DOWN,
		Direction.LEFT,
	].map((dir) => ({
		x: startX,
		y: startY,
		initialDirection: dir,
		direction: dir,
		steps: 0,
	}));

	let startDirection: Direction;

	main: while (true) {
		const toDelete: State[] = [];

		for (const state of states) {
			[state.x, state.y] = moveCoordinates(state.x, state.y, state.direction);
			const nextCell = grid[state.x][state.y];

			if (nextCell?.neighbors.includes(opposite(state.direction))) {
				state.steps++;

				if (
					states.some(
						(other) =>
							other !== state && other.x === state.x && other.y === state.y,
					)
				) {
					startDirection = state.initialDirection;
					break main;
				}

				state.direction = nextCell.neighbors.find(
					(d) => d !== opposite(state.direction),
				)!;
			} else {
				toDelete.push(state);
			}
		}

		states = states.filter((s) => !toDelete.includes(s));
	}

	let sX = startX;
	let sY = startY;
	let direction = startDirection;
	let turns = 0;
	grid[sX][sY].loop = true;

	// Traverse loop to find orientation
	while (true) {
		[sX, sY] = moveCoordinates(sX, sY, direction);

		if (sX === startX && sY === startY) break;

		const newCell = grid[sX][sY];
		newCell.loop = true;
		const newDirection = newCell.neighbors.find(
			(n) => n !== opposite(direction),
		)!;

		if (direction !== newDirection) {
			if (newDirection === toTheRight(direction)) {
				turns++; // Turning right
			} else {
				turns--; // Turning left
			}

			direction = newDirection;
		}
	}

	const turnFn = turns > 0 ? toTheRight : toTheLeft;

	const fillQueue: [number, number][] = [];

	sX = startX;
	sY = startY;
	direction = startDirection;

	// Traverse again to fill queue with initial values
	while (true) {
		[sX, sY] = moveCoordinates(sX, sY, direction);

		const newCell = grid[sX][sY];
		const newDirection =
			newCell.neighbors.find((n) => n !== opposite(direction)) ??
			startDirection;

		const [n1x, n1y] = moveCoordinates(sX, sY, turnFn(direction));
		const [n2x, n2y] = moveCoordinates(sX, sY, turnFn(newDirection));

		direction = newDirection;

		const n1 = grid[n1x][n1y];
		const n2 = grid[n2x][n2y];

		if (!n1.loop && !n1.marked) {
			n1.marked = true;
			fillQueue.push([n1x, n1y]);
		}

		if (!n2.loop && !n2.marked) {
			n2.marked = true;
			fillQueue.push([n2x, n2y]);
		}

		if (sX === startX && sY === startY) break;
	}

	while (fillQueue.length !== 0) {
		const [x, y] = fillQueue.pop()!;

		for (const direction of [
			Direction.UP,
			Direction.RIGHT,
			Direction.DOWN,
			Direction.LEFT,
		]) {
			const [nX, nY] = moveCoordinates(x, y, direction);
			const nextCell = grid[nX][nY];

			if (!nextCell.loop && !nextCell.marked) {
				nextCell.marked = true;
				fillQueue.unshift([nX, nY]);
			}
		}
	}

	let count = 0;

	for (const column of grid) {
		for (const cell of column) {
			if (cell.marked) count++;
		}
	}

	return count;
};
