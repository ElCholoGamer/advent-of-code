import { AoCPart } from '../../types';

export const part1: AoCPart = ([input]) => {
	const crabs = input.split(',').map(Number);
	const fuelConsumptions: number[] = [];

	const min = Math.min(...crabs);
	const max = Math.max(...crabs);

	for (let i = min; i <= max; i++) {
		let totalFuel = 0;

		for (const crab of crabs) {
			totalFuel += Math.abs(i - crab);
		}

		fuelConsumptions.push(totalFuel);
	}

	return Math.min(...fuelConsumptions);
};

export const part2: AoCPart = ([input]) => {
	const crabs = input.split(',').map(Number);
	const fuelConsumptions: number[] = [];

	const min = Math.min(...crabs);
	const max = Math.max(...crabs);

	for (let i = min; i <= max; i++) {
		let totalFuel = 0;

		for (const crab of crabs) {
			let fuelRate = 1;
			const distance = Math.abs(i - crab);

			for (let i = 0; i < distance; i++) {
				totalFuel += fuelRate;
				fuelRate++;
			}
		}

		fuelConsumptions.push(totalFuel);
	}

	return Math.min(...fuelConsumptions);
};
