import { errorMonitor } from 'events';
import { AoCPart } from '../../types';

interface Claim {
	id: number;
	x: number;
	y: number;
	width: number;
	height: number;
}

function parseClaim(line: string): Claim {
	const [hastagId, rect] = line.split(' @ ');
	const [position, size] = rect.split(': ');
	const [x, y] = position.split(',').map(Number);
	const [width, height] = size.split('x').map(Number);

	return {
		id: Number(hastagId.replace('#', '')),
		x,
		y,
		width,
		height,
	};
}

export const part1: AoCPart = (input) => {
	const claims = input.map(parseClaim);

	const grid = new Map<string, number>();

	for (const { x, y, width, height } of claims) {
		for (let offX = 0; offX < width; offX++) {
			for (let offY = 0; offY < height; offY++) {
				const key = `${x + offX},${y + offY}`;
				grid.set(key, (grid.get(key) || 0) + 1);
			}
		}
	}

	return Array.from(grid.values()).filter((claims) => claims >= 2).length;
};

export const part2: AoCPart = (input) => {
	const claims = input.map((line) => ({
		...parseClaim(line),
		overlaps: false,
	}));
	const grid = new Map<string, number>();

	for (const { x, y, width, height } of claims) {
		for (let offX = 0; offX < width; offX++) {
			for (let offY = 0; offY < height; offY++) {
				const key = `${x + offX},${y + offY}`;
				grid.set(key, (grid.get(key) || 0) + 1);
			}
		}
	}

	for (const claim of claims) {
		for (let offX = 0; offX < claim.width; offX++) {
			for (let offY = 0; offY < claim.height; offY++) {
				const key = `${claim.x + offX},${claim.y + offY}`;
				const value = grid.get(key) || 0;
				if (value > 1) claim.overlaps = true;
			}
		}
	}

	const validClaim = claims.find((claim) => !claim.overlaps);

	if (!validClaim) throw new Error('Could not find a valid claim');

	return validClaim.id;
};
