import { AoCPart } from '../../types';

interface Options {
	totalDays?: number;
}

export const part1: AoCPart<Options> = ([input], { totalDays = 80 }) => {
	let fish = input.split(',').map(Number);

	for (let d = 0; d < totalDays; d++) {
		let newFish = Array(fish.length);

		for (let i = 0; i < fish.length; i++) {
			if (fish[i] <= 0) {
				newFish[i] = 6;
				newFish.push(8);
			} else {
				newFish[i] = fish[i] - 1;
			}
		}

		fish = newFish;
	}

	return fish.length;
};

export const part2: AoCPart = ([input]) => {
	/**
	 * Optimized version of part 1
	 * Instead of using an array of fish timers,
	 * uses an array of how many fish are in each timer
	 */
	const initialState = input.split(',').map(Number);
	const fish = Array<number>(10).fill(0);

	for (const initialFish of initialState) {
		fish[initialFish]++;
	}

	for (let d = 0; d < 256; d++) {
		// Add new fish and reset fish timers
		fish[9] += fish[0];
		fish[7] += fish[0];

		// Move other fish down a timer
		for (let i = 1; i < fish.length; i++) {
			fish[i - 1] = fish[i] || 0;
			fish[i] = 0;
		}
	}

	return Array.from(fish.values()).reduce((sum, fishCount) => sum + fishCount);
};
