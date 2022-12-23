import { AoCPart } from '../../types';
import { sleep } from '../../utils';
import { Vector2 } from '../../utils/vector';

const enum Direction {
	NORTH,
	SOUTH,
	WEST,
	EAST,
}

interface Elve {
	position: Vector2;
	nextPosition: Vector2 | null;
}

const serVector = (vec: Vector2) => `${vec.x},${vec.y}`;

function parseElves(input: string[]) {
	const elves: Elve[] = [];
	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			if (input[y][x] === '#') {
				elves.push({ position: new Vector2(x, y), nextPosition: null });
			}
		}
	}

	return elves;
}

function passRound(elves: Elve[], directionOrder: Direction[]): boolean {
	const nextPositionCounts: Record<string, number> = {};
	const elvePositions = new Set(elves.map(elve => serVector(elve.position)));
	let finished = true;

	for (const elve of elves) {
		let noNeighbors = true;

		main: for (let nX = -1; nX <= 1; nX++) {
			for (let nY = -1; nY <= 1; nY++) {
				if (nX === 0 && nY === 0) continue;
				if (elvePositions.has(`${elve.position.x + nX},${elve.position.y + nY}`)) {
					noNeighbors = false;
					break main;
				}
			}
		}

		if (noNeighbors) continue;

		for (const direction of directionOrder) {
			let newPos = elve.position.clone();

			switch (direction) {
				case Direction.NORTH:
					newPos.y--;
					break;
				case Direction.SOUTH:
					newPos.y++;
					break;
				case Direction.WEST:
					newPos.x--;
					break;
				case Direction.EAST:
					newPos.x++;
			}

			if (direction === Direction.NORTH || direction === Direction.SOUTH) {
				if ([-1, 0, 1].every(xOffset => !elvePositions.has(`${newPos.x + xOffset},${newPos.y}`))) {
					const key = newPos.toString();
					nextPositionCounts[key] = (nextPositionCounts[key] || 0) + 1;
					elve.nextPosition = newPos;
					break;
				}
			} else if (
				[-1, 0, 1].every(yOffset => !elvePositions.has(`${newPos.x},${newPos.y + yOffset}`))
			) {
				const key = newPos.toString();
				nextPositionCounts[key] = (nextPositionCounts[key] || 0) + 1;
				elve.nextPosition = newPos;
				break;
			}
		}
	}

	for (const elve of elves) {
		if (elve.nextPosition === null) continue;

		if (nextPositionCounts[elve.nextPosition.toString()] === 1) {
			elve.position = elve.nextPosition;
			finished = false;
		}

		elve.nextPosition = null;
	}

	directionOrder.push(directionOrder.shift()!);

	return finished;
}

export const part1: AoCPart = async input => {
	const elves = parseElves(input);
	const directionOrder = [Direction.NORTH, Direction.SOUTH, Direction.WEST, Direction.EAST];

	for (let r = 1; r <= 10; r++) {
		passRound(elves, directionOrder);
	}

	const minX = Math.min(...elves.map(elve => elve.position.x));
	const maxX = Math.max(...elves.map(elve => elve.position.x));
	const minY = Math.min(...elves.map(elve => elve.position.y));
	const maxY = Math.max(...elves.map(elve => elve.position.y));

	return (maxX - minX + 1) * (maxY - minY + 1) - elves.length;
};

export const part2: AoCPart = async input => {
	const elves = parseElves(input);
	const directionOrder = [Direction.NORTH, Direction.SOUTH, Direction.WEST, Direction.EAST];

	for (let r = 1; ; r++) {
		const finished = passRound(elves, directionOrder);
		if (finished) return r;
	}
};
