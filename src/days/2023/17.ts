import { AoCPart } from '../../types';

enum Direction {
	UP,
	RIGHT,
	DOWN,
	LEFT,
}

interface Block {
	heatLoss: number;
	visitedStates: [Direction, number][];
}

interface State {
	totalHeatLoss: number;
	direction: number;
	stepsInSameDirection: number;
	position: [number, number];
}

const opposite = (direction: Direction) => (direction + 2) % 4;

function parseGrid(input: string[]): Block[][] {
	return input.map<Block[]>((line) =>
		line.split('').map<Block>((char) => ({
			heatLoss: Number(char),
			visitedStates: [],
		})),
	);
}

export const part1: AoCPart = (input) => {
	const grid = parseGrid(input);

	const states: State[] = [
		{
			totalHeatLoss: 0,
			stepsInSameDirection: 0,
			direction: Direction.RIGHT,
			position: [0, 0],
		},
	];

	while (states.length > 0) {
		const { totalHeatLoss, stepsInSameDirection, direction, position } =
			states.pop()!;

		if (position[0] === grid.length - 1 && position[1] === grid[0].length - 1)
			return totalHeatLoss;

		for (const newDirection of [
			Direction.UP,
			Direction.RIGHT,
			Direction.DOWN,
			Direction.LEFT,
		]) {
			if (
				newDirection === opposite(direction) ||
				(newDirection === direction && stepsInSameDirection >= 3)
			)
				continue;

			const newPos: [number, number] = [...position];

			switch (newDirection) {
				case Direction.UP:
					newPos[0]--;
					break;
				case Direction.RIGHT:
					newPos[1]++;
					break;
				case Direction.DOWN:
					newPos[0]++;
					break;
				case Direction.LEFT:
					newPos[1]--;
					break;
			}

			if (
				newPos[0] < 0 ||
				newPos[0] >= grid.length ||
				newPos[1] < 0 ||
				newPos[1] >= grid[0].length
			)
				continue;

			const newStepsInSameDirection =
				direction === newDirection ? stepsInSameDirection + 1 : 1;

			const newBlock = grid[newPos[0]][newPos[1]];
			if (
				newBlock.visitedStates.some(
					([dir, steps]) =>
						dir === newDirection && steps <= newStepsInSameDirection,
				)
			)
				continue;

			newBlock.visitedStates.push([newDirection, newStepsInSameDirection]);

			const newHeatLoss = totalHeatLoss + newBlock.heatLoss;

			let insertIndex = 0;
			while (
				insertIndex < states.length &&
				states[insertIndex].totalHeatLoss > newHeatLoss
			) {
				insertIndex++;
			}

			states.splice(insertIndex, 0, {
				totalHeatLoss: newHeatLoss,
				stepsInSameDirection: newStepsInSameDirection,
				direction: newDirection,
				position: newPos,
			});
		}
	}

	throw new Error('impossible');
};

export const part2: AoCPart = (input) => {
	const grid = parseGrid(input);

	const states: State[] = [
		{
			totalHeatLoss: 0,
			stepsInSameDirection: 0,
			direction: Direction.RIGHT,
			position: [0, 0],
		},
	];

	while (states.length > 0) {
		const { totalHeatLoss, stepsInSameDirection, direction, position } =
			states.pop()!;

		if (
			position[0] === grid.length - 1 &&
			position[1] === grid[0].length - 1 &&
			stepsInSameDirection >= 4
		)
			return totalHeatLoss;

		for (const newDirection of [
			Direction.UP,
			Direction.RIGHT,
			Direction.DOWN,
			Direction.LEFT,
		]) {
			if (
				newDirection === opposite(direction) ||
				(stepsInSameDirection < 4 && newDirection !== direction) ||
				(stepsInSameDirection >= 10 && newDirection === direction)
			)
				continue;

			const newPos: [number, number] = [...position];

			switch (newDirection) {
				case Direction.UP:
					newPos[0]--;
					break;
				case Direction.RIGHT:
					newPos[1]++;
					break;
				case Direction.DOWN:
					newPos[0]++;
					break;
				case Direction.LEFT:
					newPos[1]--;
					break;
			}

			if (
				newPos[0] < 0 ||
				newPos[0] >= grid.length ||
				newPos[1] < 0 ||
				newPos[1] >= grid[0].length
			)
				continue;

			const newStepsInSameDirection =
				direction === newDirection ? stepsInSameDirection + 1 : 1;

			const newBlock = grid[newPos[0]][newPos[1]];
			if (
				newBlock.visitedStates.some(
					([dir, steps]) =>
						dir === newDirection && steps === newStepsInSameDirection,
				)
			)
				continue;

			newBlock.visitedStates.push([newDirection, newStepsInSameDirection]);

			const newHeatLoss = totalHeatLoss + newBlock.heatLoss;

			let insertIndex = 0;
			while (
				insertIndex < states.length &&
				states[insertIndex].totalHeatLoss > newHeatLoss
			) {
				insertIndex++;
			}

			states.splice(insertIndex, 0, {
				totalHeatLoss: newHeatLoss,
				stepsInSameDirection: newStepsInSameDirection,
				direction: newDirection,
				position: newPos,
			});
		}
	}

	throw new Error('impossible');
};
