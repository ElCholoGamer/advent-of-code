import { AoCPart } from '../../types';
import PriorityQueue from '../../utils/structures/priority-queue';
import { Vector2 } from '../../utils/structures/vector';

interface Blizzard {
	position: Vector2;
	step: Vector2;
}

const UP = new Vector2(0, -1);
const DOWN = new Vector2(0, 1);
const RIGHT = new Vector2(1, 0);
const LEFT = new Vector2(-1, 0);

function parseBlizzards(input: string[]) {
	const blizzards: Blizzard[] = [];

	for (let y = 0; y < input.length - 2; y++) {
		const line = input[y + 1];
		for (let x = 0; x < line.length - 2; x++) {
			const char = line[x + 1];
			if (char === '.') continue;

			let step: Vector2;

			switch (char) {
				case '>':
					step = RIGHT;
					break;
				case '<':
					step = LEFT;
					break;
				case '^':
					step = UP;
					break;
				case 'v':
					step = DOWN;
					break;
				default:
					throw new Error('invalid input blizzard character: ' + char);
			}

			blizzards.push({
				position: new Vector2(x, y),
				step,
			});
		}
	}

	return blizzards;
}

function blizzardsAtTimeGen(initialBlizzards: Blizzard[], width: number, height: number) {
	const blizzards = initialBlizzards.map((b) => ({
		...b,
		position: b.position.clone(),
	}));
	const stateCache: Set<string>[] = [
		new Set(initialBlizzards.map((b) => b.position.toString())),
	];

	return (time: number) => {
		for (let i = stateCache.length; i <= time; i++) {
			for (const blizzard of blizzards) {
				blizzard.position.add(blizzard.step);

				if (blizzard.position.y >= height) {
					blizzard.position.y = 0;
				} else if (blizzard.position.y < 0) {
					blizzard.position.y = height - 1;
				} else if (blizzard.position.x >= width) {
					blizzard.position.x = 0;
				} else if (blizzard.position.x < 0) {
					blizzard.position.x = width - 1;
				}
			}

			stateCache.push(new Set(blizzards.map((b) => b.position.toString())));
		}

		return stateCache[time];
	};
}

function findShortestRoute(
	start: Vector2,
	end: Vector2,
	width: number,
	height: number,
	startTime: number,
	blizzardsFunction: (time: number) => Set<string>
): number {
	const queue: [number, Vector2][] = [[startTime, start.clone()]];

	while (queue.length > 0) {
		const [time, pos] = queue.shift()!;

		const newTime = time + 1;
		const nextBlizzards = blizzardsFunction(newTime);

		const neighbors = [
			pos.clone(),
			pos.clone().add(UP),
			pos.clone().add(DOWN),
			pos.clone().add(RIGHT),
			pos.clone().add(LEFT),
		];

		for (const neighbor of neighbors) {
			if (
				neighbor.x < 0 ||
				neighbor.x >= width ||
				(neighbor.y < 0 && (neighbor.x !== 0 || neighbor.y < -1)) ||
				(neighbor.y >= height && (neighbor.x !== width - 1 || neighbor.y > height))
			)
				continue;

			if (neighbor.equals(end)) return newTime;

			if (
				!nextBlizzards.has(neighbor.toString()) &&
				!queue.some(([time, position]) => time === newTime && position.equals(neighbor))
			) {
				queue.push([newTime, neighbor]);
			}
		}
	}

	throw new Error('route not found');
}

export const part1: AoCPart = (input) => {
	const height = input.length - 2;
	const width = input[0].length - 2;
	const blizzardsAtTime = blizzardsAtTimeGen(parseBlizzards(input), width, height);
	const shortestRoute = findShortestRoute(
		new Vector2(0, -1),
		new Vector2(width - 1, height),
		width,
		height,
		0,
		blizzardsAtTime
	);

	return shortestRoute;
};

export const part2: AoCPart = async (input) => {
	const height = input.length - 2;
	const width = input[0].length - 2;
	const blizzardsAtTime = blizzardsAtTimeGen(parseBlizzards(input), width, height);

	const start = new Vector2(0, -1);
	const end = new Vector2(width - 1, height);

	const first = findShortestRoute(start, end, width, height, 0, blizzardsAtTime);
	const second = findShortestRoute(end, start, width, height, first, blizzardsAtTime);
	return findShortestRoute(start, end, width, height, second, blizzardsAtTime);
};
