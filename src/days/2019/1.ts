import { AoCPart } from '../../types';

export const part1: AoCPart = (input) => {
	const masses = input.map(Number);
	const fuelRequirements = masses.map((mass) => Math.floor(mass / 3) - 2);

	return fuelRequirements.reduce((a, b) => a + b);
};

export const part2: AoCPart = (input) => {
	const masses = input.map(Number);

	let totalFuel = 0;
	const stack: number[] = [...masses];

	while (stack.length > 0) {
		const mass = stack.pop()!;
		const fuelRequirement = Math.floor(mass / 3) - 2;
		if (fuelRequirement <= 0) continue;

		totalFuel += fuelRequirement;
		stack.push(fuelRequirement);
	}

	return totalFuel;
};
