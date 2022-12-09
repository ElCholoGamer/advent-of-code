import { AoCPart } from '../../types';
import { Vector2 } from '../../utils/vector';

const enum Direction {
	UP = 'U',
	DOWN = 'D',
	LEFT = 'L',
	RIGHT = 'R',
}

interface Move {
	direction: Direction;
	distance: number;
}

function parseMove(str: string): Move {
	const [direction, distanceStr] = str.split(/\s+/);
	return {
		direction: direction as Direction,
		distance: parseInt(distanceStr),
	};
}

function simulateRope(moves: Move[], ropeLength: number): number {
	if (ropeLength < 2) throw new Error('Rope length must be at least 2');

	const visitedPositions = new Set<string>();
	const knots = [...Array(ropeLength)].map(() => new Vector2(0, 0));

	for (const { direction, distance } of moves) {
		for (let i = 0; i < distance; i++) {
			switch (direction) {
				case Direction.UP:
					knots[0].y++;
					break;
				case Direction.DOWN:
					knots[0].y--;
					break;
				case Direction.RIGHT:
					knots[0].x++;
					break;
				case Direction.LEFT:
					knots[0].x--;
			}

			for (let i = 1; i < knots.length; i++) {
				const follower = knots[i];
				const lead = knots[i - 1];

				if (lead.y === follower.y) {
					const diffX = lead.x - follower.x;
					if (Math.abs(diffX) >= 2) {
						follower.x += Math.sign(diffX);
					}
				} else if (lead.x === follower.x) {
					const diffY = lead.y - follower.y;
					if (Math.abs(diffY) >= 2) {
						follower.y += Math.sign(diffY);
					}
				} else {
					const diff = lead.clone().subtract(follower);
					const absDiff = diff.clone().abs();
					if (absDiff.x >= 2 || absDiff.y >= 2) {
						follower.add(diff.sign());
					}
				}
			}

			visitedPositions.add(knots.at(-1)!.toString());
		}
	}

	return visitedPositions.size;
}

export const part1: AoCPart = async input => simulateRope(input.map(parseMove), 2);

export const part2: AoCPart = async input => simulateRope(input.map(parseMove), 10);
