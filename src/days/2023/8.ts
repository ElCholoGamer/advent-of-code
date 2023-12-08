import { AoCPart } from '../../types';
import { assertNonNull } from '../../utils/assertion';
import { lcm } from '../../utils/math';

const enum Instruction {
	RIGHT = 'R',
	LEFT = 'L',
}

type MapMap = Map<string, Record<Instruction, string>>;

function parseInput(input: string[]) {
	const instructions: Instruction[] = input[0].split('') as Instruction[];
	const mapMap: MapMap = new Map();

	for (let i = 2; i < input.length; i++) {
		const [from, directions] = input[i].split(' = ');
		const [left, right] = directions
			.substring(1, directions.length - 1)
			.split(', ');

		mapMap.set(from, {
			[Instruction.LEFT]: left,
			[Instruction.RIGHT]: right,
		});
	}

	return {
		instructions,
		mapMap,
	};
}

function findStepsToTarget(
	startingLocation: string,
	instructions: Instruction[],
	mapMap: MapMap,
	targetPredicate: (loc: string) => boolean,
): number {
	let i = 0;
	let location = startingLocation;
	let steps = 0;

	while (!targetPredicate(location)) {
		const directions = assertNonNull(mapMap.get(location));
		location = directions[instructions[i]];

		i = (i + 1) % instructions.length;
		steps++;
	}

	return steps;
}

export const part1: AoCPart = (input) => {
	const { instructions, mapMap } = parseInput(input);
	return findStepsToTarget('AAA', instructions, mapMap, (loc) => loc === 'ZZZ');
};

export const part2: AoCPart = (input) => {
	const { instructions, mapMap } = parseInput(input);
	const stepFactors: number[] = [];

	for (const location of mapMap.keys()) {
		if (!location.endsWith('A')) continue;

		const steps = findStepsToTarget(location, instructions, mapMap, (loc) =>
			loc.endsWith('Z'),
		);
		stepFactors.push(steps);
	}

	return lcm(...stepFactors);
};
