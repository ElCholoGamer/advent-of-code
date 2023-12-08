import { AoCPart } from '../../types';
import { assertNonNull } from '../../utils/assertion';
import { lcm } from '../../utils/math';

const enum Instruction {
	RIGHT = 'R',
	LEFT = 'L',
}

function parseInput(input: string[]) {
	const instructions: Instruction[] = input[0].split('') as Instruction[];
	const mapMap = new Map<string, [string, string]>();

	for (let i = 2; i < input.length; i++) {
		const [from, directions] = input[i].split(' = ');
		const [left, right] = directions.substring(1, directions.length - 1).split(', ');
		mapMap.set(from, [left, right]);
	}

	return {
		instructions,
		mapMap,
	};
}

export const part1: AoCPart = (input) => {
	const { instructions, mapMap } = parseInput(input);

	let i = 0;
	let location = 'AAA';
	let steps = 0;

	while (location !== 'ZZZ') {
		const locationEntry = assertNonNull(mapMap.get(location), 'Invalid location');

		location =
			instructions[i] === Instruction.RIGHT ? locationEntry[1] : locationEntry[0];
		i = (i + 1) % instructions.length;
		steps++;
	}

	return steps;
};

export const part2: AoCPart = (input) => {
	const { instructions, mapMap } = parseInput(input);

	let i = 0;
	let locations = [...mapMap.keys()].filter((loc) => loc.endsWith('A'));
	const stepFactors: number[] = [];
	let steps = 0;

	while (locations.length !== 0) {
		steps++;

		for (let l = 0; l < locations.length; l++) {
			const locationEntry = assertNonNull(mapMap.get(locations[l]), 'Invalid location');
			locations[l] =
				instructions[i] === Instruction.RIGHT ? locationEntry[1] : locationEntry[0];

			if (locations[l].endsWith('Z')) {
				stepFactors.push(steps);
			}
		}

		i = (i + 1) % instructions.length;
		locations = locations.filter((loc) => !loc.endsWith('Z'));
	}

	return lcm(...stepFactors);
};
