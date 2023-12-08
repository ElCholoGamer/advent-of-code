import { AoCPart } from '../../types';

interface SpaceObject {
	parent: string | null;
}

function parseObjects(input: string[]): Record<string, SpaceObject> {
	const objects: Record<string, SpaceObject> = {};

	for (const line of input) {
		const [parent, object] = line.split(')');

		objects[parent] ||= { parent: null };
		objects[object] = { parent };
	}

	return objects;
}

function getAllOrbits(
	objects: Record<string, SpaceObject>,
	object: string,
): string[] {
	const out: string[] = [];

	let current = objects[object];

	while (current.parent !== null) {
		out.push(current.parent);
		current = objects[current.parent];
	}

	return out;
}

export const part1: AoCPart = (input) => {
	const objects = parseObjects(input);

	let orbitCount = 0;

	for (const key in objects) {
		orbitCount += getAllOrbits(objects, key).length;
	}

	return orbitCount;
};

export const part2: AoCPart = (input) => {
	const objects = parseObjects(input);

	const youOrbits = getAllOrbits(objects, 'YOU');
	const santaOrbits = getAllOrbits(objects, 'SAN');

	const commonOrbits = youOrbits.filter((orbit) => santaOrbits.includes(orbit));

	return youOrbits.length + santaOrbits.length - commonOrbits.length * 2;
};
