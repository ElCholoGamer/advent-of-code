import { AoCPart } from '../../types';
import { gcd, PI_OVER_2, wrapRotation } from '../../utils/math';
import { Vector2 } from '../../utils/vector';

function parseAsteroids(input: string[]): Vector2[] {
	const out: Vector2[] = [];

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			if (input[y][x] === '#') {
				out.push(new Vector2(x, y));
			}
		}
	}

	return out;
}

function canDetectAsteroid(from: Vector2, to: Vector2, asteroids: Vector2[]) {
	const diff = to.clone().subtract(from);
	const divisor = gcd(diff.x, diff.y);

	const increment = diff.clone().divideScalar(Math.abs(divisor));

	for (let i = 1; true; i++) {
		const checking = from.clone().add(increment.clone().multiplyScalar(i));

		if (checking.equals(to)) break;

		if (asteroids.some(other => other.equals(checking))) {
			// An asteroid is blocking the way
			return false;
		}
	}

	return true;
}

function detectAsteroids(from: Vector2, asteroids: Vector2[]): Vector2[] {
	const out: Vector2[] = [];

	for (const otherAsteroid of asteroids) {
		if (otherAsteroid === from) continue;

		if (canDetectAsteroid(from, otherAsteroid, asteroids)) {
			out.push(otherAsteroid.clone());
		}
	}

	return out;
}

function bestAsteroid(asteroids: Vector2[]): Vector2 {
	let maxDetections = 0;
	let bestAsteroid: Vector2 = asteroids[0];

	for (const asteroid of asteroids) {
		const detections = detectAsteroids(asteroid, asteroids);
		if (detections.length > maxDetections) {
			maxDetections = detections.length;
			bestAsteroid = asteroid;
		}
	}

	return bestAsteroid;
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
			asteroids = asteroids.filter(
				asteroid => !detected.some(detectedAsteroid => detectedAsteroid.equals(asteroid))
			);
			vaporized += detected.length;
			continue;
		}

		// Last iteration
		const rotations = detected.map(asteroid => {
			const rotation = asteroid.clone().subtract(laser).toRotation();
			return { asteroid, rotation: wrapRotation(rotation + PI_OVER_2) };
		});

		rotations.sort((a, b) => a.rotation - b.rotation);

		const result = rotations[targetAsteroid - vaporized - 1].asteroid;
		return result.x * 100 + result.y;
	}
};
