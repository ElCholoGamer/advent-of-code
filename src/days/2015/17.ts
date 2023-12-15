import { AoCPart } from '../../types';
import { count } from '../../utils/arrays';

interface Options {
	target: number;
}

function findCombinations(totalSpace: number, containers: number[]) {
	function _findCombinations(
		availableContainersIndex: number,
		containersUsed: number[],
	): number[][] {
		const spaceUsed = containersUsed.reduce((a, b) => a + b, 0);
		if (spaceUsed > totalSpace) return [];
		if (spaceUsed === totalSpace) return [containersUsed];

		const combinations = [];

		for (let c = availableContainersIndex; c < containers.length; c++) {
			const subCombinations = _findCombinations(c + 1, [
				...containersUsed,
				containers[c],
			]);
			combinations.push(...subCombinations);
		}

		return combinations;
	}

	return _findCombinations(0, []);
}

export const part1: AoCPart<Options> = (input, { target = 150 }) => {
	const containers = input.map(Number);
	const combinations = findCombinations(target, containers);
	return combinations.length;
};

export const part2: AoCPart<Options> = (input, { target = 150 }) => {
	const containers = input.map(Number);
	const combinations = findCombinations(target, containers);

	const minLength = Math.min(...combinations.map((comb) => comb.length));
	return count(combinations, (comb) => comb.length === minLength);
};
