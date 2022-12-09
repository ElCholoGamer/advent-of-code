import chalk from 'chalk';
import { AoCPart, Visualization } from '../../types';
import { sleep } from '../../utils';
import { HIDE_CURSOR, SHOW_CURSOR } from '../../utils/strings';
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

function step(direction: Direction, knots: Vector2[]) {
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
}

function simulateRope(moves: Move[], ropeLength: number): number {
	const visitedPositions = new Set<string>();
	const knots = [...Array(ropeLength)].map(() => new Vector2(0, 0));

	for (const { direction, distance } of moves) {
		for (let i = 0; i < distance; i++) {
			step(direction, knots);
			visitedPositions.add(knots.at(-1)!.toString());
		}
	}

	return visitedPositions.size;
}

export const part1: AoCPart = input => simulateRope(input.map(parseMove), 2);

export const part2: AoCPart = input => simulateRope(input.map(parseMove), 10);

function findMovementBounds(moves: Move[], ropeLength: number): [Vector2, Vector2] {
	const min = new Vector2(0, 0);
	const max = new Vector2(0, 0);
	const knots = [...Array(ropeLength)].map(() => new Vector2(0, 0));

	for (const { direction, distance } of moves) {
		for (let i = 0; i < distance; i++) {
			step(direction, knots);

			const { x, y } = knots[0];
			if (x > max.x) max.x = x;
			else if (x < min.x) min.x = x;
			if (y > max.y) max.y = y;
			else if (y < min.y) min.y = y;
		}
	}

	return [min, max];
}

export const visualization: Visualization = async input => {
	const moves = input.map(parseMove);
	const ROPE_LEN = 10;
	const [min, max] = findMovementBounds(moves, ROPE_LEN);

	const knots = [...Array(ROPE_LEN)].map(() => new Vector2(0, 0));
	const visitedPositions = new Set<string>();

	function render(finished: boolean) {
		const lines: string[] = [];
		for (let y = max.y; y >= min.y; y--) {
			let line = Array(max.x - min.x + 1).fill(chalk.grey('.'));

			for (const positionStr of visitedPositions) {
				const [posX, posY] = positionStr.split(',').map(Number);
				if (posY === y) {
					line[posX - min.x] = chalk[finished ? 'green' : 'grey']('#');
				}
			}

			if (!finished) {
				if (y === 0) line[-min.x] = chalk.grey('s');

				for (let k = knots.length - 1; k >= 0; k--) {
					if (knots[k].y === y) {
						line[knots[k].x - min.x] = k === 0 ? chalk.bold.yellow('H') : chalk.yellow(k);
					}
				}
			}

			lines.push(line.join(' '));
		}

		console.clear();
		console.log(lines.join('\n'));
	}

	console.log(HIDE_CURSOR);

	for (const { direction, distance } of moves) {
		for (let i = 0; i < distance; i++) {
			step(direction, knots);
			const tail = knots.at(-1)!;
			visitedPositions.add(`${tail.x},${tail.y}`);

			render(false);
			await sleep(100);
		}
	}

	await sleep(1000);
	render(true);

	console.log();
	console.log(chalk.green`${chalk.bold('Visited positions:')} ${visitedPositions.size}`);
	await sleep(3000);

	console.log(SHOW_CURSOR);
};
