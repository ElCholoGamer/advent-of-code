import { AoCPart } from '../../types';

const serializeBanks = (banks: number[]) => banks.join(',');

function cycleBanks(banks: number[]) {
	let index = 0;

	for (let i = 1; i < banks.length; i++) {
		if (banks[i] > banks[index]) index = i;
	}

	let distribute = banks[index];
	banks[index] = 0;

	while (distribute > 0) {
		index = ++index % banks.length;

		banks[index]++;
		distribute--;
	}
}

function part1WithBanks(input: string): [number, number[]] {
	const banks = input.split(/\s+/).map(Number);
	const seenScenarios: string[] = [];
	let cycles = 0;

	do {
		seenScenarios.push(serializeBanks(banks));
		cycleBanks(banks);
		cycles++;
	} while (!seenScenarios.includes(serializeBanks(banks)));

	return [cycles, banks];
}

export const part1: AoCPart = ([input]) => {
	return part1WithBanks(input)[0];
};

export const part2: AoCPart = async ([input]) => {
	const banks = part1WithBanks(input)[1];
	const seenScenarios: string[] = [];
	let cycles = 0;

	do {
		seenScenarios.push(serializeBanks(banks));
		cycleBanks(banks);
		cycles++;
	} while (!seenScenarios.includes(serializeBanks(banks)));

	return cycles;
};
