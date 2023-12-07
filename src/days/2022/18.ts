import { AoCPart } from '../../types';
import { count } from '../../utils/arrays';
import { Vector3 } from '../../utils/structures/vector';

const SIDES = [
	new Vector3(1, 0, 0),
	new Vector3(-1, 0, 0),
	new Vector3(0, 1, 0),
	new Vector3(0, -1, 0),
	new Vector3(0, 0, 1),
	new Vector3(0, 0, -1),
];

const parseCube = (line: string) => Vector3.fromArray(line.split(',').map(Number));

export const part1: AoCPart = (input) => {
	const cubePositions = input.map(parseCube);
	const cubeStrings = new Set(cubePositions.map((p) => p.toString()));

	return cubePositions
		.map((cube) =>
			count(SIDES, (side) => !cubeStrings.has(cube.clone().add(side).toString()))
		)
		.reduce((a, b) => a + b);
};

export const part2: AoCPart = (input) => {
	const cubePositions = input.map(parseCube);
	const cubeStrings = new Set(cubePositions.map((p) => p.toString()));

	const limits = [
		{
			max: Math.max(...cubePositions.map((p) => p.x)) + 1,
			min: Math.min(...cubePositions.map((p) => p.x)) - 1,
		},
		{
			max: Math.max(...cubePositions.map((p) => p.y)) + 1,
			min: Math.min(...cubePositions.map((p) => p.y)) - 1,
		},
		{
			max: Math.max(...cubePositions.map((p) => p.z)) + 1,
			min: Math.min(...cubePositions.map((p) => p.z)) - 1,
		},
	];

	const visitedWaterTiles = new Set<string>();
	let sideCount = 0;

	const tileQueue = [new Vector3(limits[0].max, 0, 0)];

	while (tileQueue.length > 0) {
		const waterTile = tileQueue.shift()!;

		for (const side of SIDES) {
			const nextTile = waterTile.clone().add(side);

			if (
				limits.some(
					({ max, min }, axis) =>
						nextTile.axisIndex(axis) > max || nextTile.axisIndex(axis) < min
				) ||
				visitedWaterTiles.has(nextTile.toString())
			)
				continue;

			if (cubeStrings.has(nextTile.toString())) {
				sideCount++;
			} else if (!tileQueue.some((tile) => tile.equals(nextTile))) {
				tileQueue.push(nextTile);
			}
		}

		visitedWaterTiles.add(waterTile.toString());
	}

	return sideCount;
};
