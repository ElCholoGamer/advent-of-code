import { AoCPart } from '../../types';
import { zip } from '../../utils/arrays';
import { lcm } from '../../utils/math';
import { Vector3 } from '../../utils/structures/vector';

interface Moon {
	position: Vector3;
	velocity: Vector3;
}

function parseMoon(line: string): Moon {
	const coords = line.substring(1, line.length - 1);
	const values = coords.split(', ').map((pair) => Number(pair.split('=')[1]));
	return {
		position: Vector3.fromArray(values),
		velocity: new Vector3(0, 0, 0),
	};
}

function cycleMoons(moons: Moon[]) {
	const oldMoons: Moon[] = moons.map((moon) => ({
		position: moon.position.clone(),
		velocity: moon.velocity.clone(),
	}));

	for (let m = 0; m < moons.length; m++) {
		const moon = moons[m];

		for (let otherM = 0; otherM < oldMoons.length; otherM++) {
			if (m === otherM) continue;

			const diff = oldMoons[otherM].position.clone().subtract(oldMoons[m].position);
			moon.velocity.add(diff.sign());
		}

		moon.position.add(moon.velocity);
	}
}

export const part1: AoCPart = (input) => {
	let moons = input.map(parseMoon);

	for (let step = 0; step < 1000; step++) {
		cycleMoons(moons);
	}

	const energies = moons.map(
		(moon) => moon.position.manhattanLength() * moon.velocity.manhattanLength()
	);

	return energies.reduce((a, b) => a + b);
};

interface MoonAxisState {
	position: number;
	velocity: number;
}

function cycleMoonsAxis(axisStates: MoonAxisState[]) {
	const oldStates = axisStates.map((state) => ({ ...state }));

	for (let m = 0; m < axisStates.length; m++) {
		const state = axisStates[m];

		for (let otherM = 0; otherM < oldStates.length; otherM++) {
			if (m === otherM) continue;

			const diff = oldStates[otherM].position - oldStates[m].position;
			state.velocity += Math.sign(diff);
		}

		state.position += state.velocity;
	}
}

const moonAxis =
	(axis: 'x' | 'y' | 'z') =>
	(moon: Moon): MoonAxisState => {
		return {
			position: moon.position[axis],
			velocity: moon.velocity[axis],
		};
	};

const statesEqual = (a: MoonAxisState[], b: MoonAxisState[]) => {
	return zip(a, b).every(
		([a, b]) => a.position === b.position && a.velocity === b.velocity
	);
};

function findRepetitionPoint(axisStates: MoonAxisState[]) {
	const initialStates = axisStates.map((state) => ({ ...state }));
	for (let step = 1; true; step++) {
		cycleMoonsAxis(axisStates);
		if (statesEqual(axisStates, initialStates)) {
			return step;
		}
	}
}

export const part2: AoCPart = (input) => {
	let moons = input.map(parseMoon);

	const repeatX = findRepetitionPoint(moons.map(moonAxis('x')));
	const repeatY = findRepetitionPoint(moons.map(moonAxis('y')));
	const repeatZ = findRepetitionPoint(moons.map(moonAxis('z')));

	return lcm(repeatX, repeatY, repeatZ);
};
