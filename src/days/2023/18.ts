import { AoCPart } from '../../types';
import { Vector2 } from '../../utils/structures/vector';

const enum Direction {
	RIGHT,
	DOWN,
	LEFT,
	UP,
}

interface Step {
	direction: Direction;
	distance: number;
}

function findRegionArea(steps: Step[]): number {
	const pos = new Vector2(0, 0);
	const vertices: { pos: Vector2; directions: Set<Direction> }[] = [];

	let perimeter = 0;

	for (const { distance, direction } of steps) {
		vertices.at(-1)?.directions.add(direction);

		switch (direction) {
			case Direction.UP:
				pos.y += distance;
				break;
			case Direction.RIGHT:
				pos.x += distance;
				break;
			case Direction.DOWN:
				pos.y -= distance;
				break;
			case Direction.LEFT:
				pos.x -= distance;
		}

		vertices.push({
			pos: pos.clone(),
			directions: new Set([direction]),
		});

		perimeter += distance;
	}

	let shoelaceArea = 0;
	vertices.push(vertices[0]);

	for (let i = 0; i < vertices.length - 1; i++) {
		shoelaceArea +=
			vertices[i].pos.x * vertices[i + 1].pos.y -
			vertices[i + 1].pos.x * vertices[i].pos.y;
	}

	shoelaceArea = Math.abs(shoelaceArea / 2);

	return shoelaceArea + perimeter / 2 + 1;
}

export const part1: AoCPart = (input) => {
	const steps = input.map((line) => {
		const [dirChar, distanceStr] = line.split(' ');
		return {
			direction: 'RDLU'.indexOf(dirChar),
			distance: Number(distanceStr),
		};
	});

	return findRegionArea(steps);
};

export const part2: AoCPart = (input) => {
	const steps = input.map<Step>((line) => {
		const hexStr = line.split(' ')[2].substring(2, 8);
		return {
			distance: parseInt(hexStr.substring(0, 5), 16),
			direction: parseInt(hexStr.at(-1)!, 16),
		};
	});

	return findRegionArea(steps);
};
