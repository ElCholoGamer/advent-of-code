import { AoCPart } from '../../types';

function parsePrograms(input: string[]) {
	const programs: Record<string, { weight: number; children: string[] }> = {};

	// Parse input
	for (const line of input) {
		const [program, weightStr, children] = line.split(/ \(|\)(?: -> )?/);

		programs[program] = {
			weight: Number(weightStr),
			children: children ? children.split(', ') : [],
		};
	}

	return programs;
}

function timesInArray<T>(arr: T[], element: T) {
	let count = 0;
	for (const obj of arr) {
		if (obj === element) count++;
	}

	return count;
}

export const part1: AoCPart = input => {
	const programs = parsePrograms(input);

	// Find the program that isn't owned by another program
	const keys = Object.keys(programs);
	const result = keys.find(
		program => !keys.some(otherProgram => programs[otherProgram].children.includes(program))
	);

	if (!result) throw new Error('Could not find result');

	return result;
};

export const part2: AoCPart = async (input, options) => {
	const programs = parsePrograms(input);
	const base = <string>await part1(input, options);

	function checkProgram(name: string): number {
		// This function assumes that the given program has one unbalanced child
		const program = programs[name];

		if (program.children.length === 0) throw new Error('Program must have at least 1 child');

		const childrenWeights = program.children.map(getWeight);

		// Finds the most common weight among the children, which is inferred to be the correct one
		const correctChildWeight = childrenWeights.reduce((a, b) =>
			timesInArray(childrenWeights, b) > timesInArray(childrenWeights, a) ? b : a
		);

		// Find the unbalanced child
		for (let i = 0; i < program.children.length; i++) {
			const childName = program.children[i];
			const child = programs[childName];
			const childWeight = childrenWeights[i];

			if (childWeight === correctChildWeight) continue;

			// ----- Current child is the unbalanced one -----

			if (child.children.length === 0)
				throw new Error('Ambiguous result: Empty child inside unbalanced child');

			const childrenOfChildWeights = child.children.map(getWeight);

			if (new Set(childrenOfChildWeights).size <= 1) {
				// Unbalanced child has balanced children. Therefore, it is the source.
				return child.weight - (childWeight - correctChildWeight);
			} else {
				// Unbalanced child has an unbalanced child
				return checkProgram(childName);
			}
		}

		throw new Error('Could not find unbalanced child');
	}

	function getWeight(name: string): number {
		const program = programs[name];
		const childrenWeights = program.children.map(getWeight);

		return program.weight + childrenWeights.reduce((acc, num) => acc + num, 0);
	}

	return checkProgram(base);
};
