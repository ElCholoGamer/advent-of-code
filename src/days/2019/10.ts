import { AoCPart, Coordinate2D } from '../../types';

const PI_OVER_2 = Math.PI / 2;
const TWO_PI = Math.PI * 2;

function greatestCommonDivisor(a: number, b: number): number {
	if (!b) return a;
	return greatestCommonDivisor(b, a % b);
}

function parseAsteroids(input: string[]): Coordinate2D[] {
	const out: Coordinate2D[] = [];

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			if (input[y][x] === '#') {
				out.push([x, y]);
			}
		}
	}

	return out;
}

function canDetectAsteroid(from: Coordinate2D, to: Coordinate2D, asteroids: Coordinate2D[]) {
	const [x1, y1] = from;
	const [x2, y2] = to;

	const diffX = x2 - x1;
	const diffY = y2 - y1;
	const gcd = greatestCommonDivisor(diffX, diffY);

	const incX = Math.abs(diffX / gcd) * Math.sign(diffX);
	const incY = Math.abs(diffY / gcd) * Math.sign(diffY);

	for (let i = 1; true; i++) {
		const checkX = x1 + incX * i;
		const checkY = y1 + incY * i;

		if (checkX === to[0] && checkY === to[1]) break;

		if (asteroids.some(other => other[0] === checkX && other[1] === checkY)) {
			// An asteroid is blocking the way
			return false;
		}
	}

	return true;
}

function detectAsteroids(from: Coordinate2D, asteroids: Coordinate2D[]): Coordinate2D[] {
	const out: Coordinate2D[] = [];

	for (const otherAsteroid of asteroids) {
		if (otherAsteroid === from) continue;

		if (canDetectAsteroid(from, otherAsteroid, asteroids)) {
			out.push([...otherAsteroid]);
		}
	}

	return out;
}

function bestAsteroid(asteroids: Coordinate2D[]): Coordinate2D {
	let maxDetections = 0;
	let bestAsteroid: Coordinate2D = asteroids[0];

	for (const asteroid of asteroids) {
		const detections = detectAsteroids(asteroid, asteroids);
		if (detections.length > maxDetections) {
			maxDetections = detections.length;
			bestAsteroid = asteroid;
		}
	}

	return bestAsteroid;
}

function rotationFromUp(vec: Coordinate2D): number {
	let rot = (Math.atan2(vec[1], vec[0]) + PI_OVER_2) % TWO_PI;
	while (rot < 0) rot += TWO_PI;

	return rot;
}

export const part1: AoCPart = input => {
	const asteroids = parseAsteroids(input);
	const best = bestAsteroid(asteroids);

	return detectAsteroids(best, asteroids).length;
};

interface Options {
	targetAsteroid: number;
}

export const part2: AoCPart<Options> = (input, { targetAsteroid = 200 }) => {
	let asteroids = parseAsteroids(input);
	const laser = bestAsteroid(asteroids);

	let vaporized = 0;

	while (true) {
		const detected = detectAsteroids(laser, asteroids);

		if (vaporized + detected.length < targetAsteroid) {
			asteroids = asteroids.filter(a => !detected.some(d => a[0] === d[0] && a[1] === d[1]));
			vaporized += detected.length;
			continue;
		}

		// Last iteration
		const rotations = detected.map(asteroid => {
			const diff: Coordinate2D = [asteroid[0] - laser[0], asteroid[1] - laser[1]];
			return { asteroid, rotation: rotationFromUp(diff) };
		});

		rotations.sort((a, b) => a.rotation - b.rotation);

		const result = rotations[targetAsteroid - vaporized - 1].asteroid;
		return result[0] * 100 + result[1];
	}
};
