import { AoCPart } from '../../types';

interface Distance {
	from: string;
	to: string;
	value: number;
}

function parseInput(input: string[]): [string[], Distance[]] {
	const locations = new Set<string>();
	const distances: Distance[] = [];

	for (const line of input) {
		const [distanceLocations, valueStr] = line.split(' = ');
		const [from, to] = distanceLocations.split(' to ');

		locations.add(from).add(to);
		distances.push({ from, to, value: Number(valueStr) });
	}

	return [[...locations], distances];
}

function getPermutations<T>(arr: T[]): T[][] {
	const results: T[][] = [];

	function permute(arr: T[], memo: T[] = []) {
		for (let i = 0; i < arr.length; i++) {
			const curr = arr.splice(i, 1);
			if (arr.length === 0) {
				results.push(memo.concat(curr));
			}

			permute(arr.slice(), memo.concat(curr));
			arr.splice(i, 0, curr[0]);
		}

		return results;
	}

	return permute(arr);
}

function getTotalDistance(allDistances: Distance[], path: string[]) {
	let totalDistance = 0;

	for (let i = 0; i < path.length - 1; i++) {
		const step1 = path[i];
		const step2 = path[i + 1];
		const found = allDistances.find(
			(d) =>
				(d.from === step1 && d.to === step2) ||
				(d.from === step2 && d.to === step1),
		);

		if (!found)
			throw new Error(
				`Could not find distance between "${step1}" and "${step2}"`,
			);

		totalDistance += found.value;
	}

	return totalDistance;
}

export const part1: AoCPart = (input) => {
	const [locations, distances] = parseInput(input);
	const permutations = getPermutations(locations);

	const totalDistances = permutations.map((path) =>
		getTotalDistance(distances, path),
	);

	return Math.min(...totalDistances);
};

export const part2: AoCPart = (input) => {
	const [locations, distances] = parseInput(input);
	const permutations = getPermutations(locations);

	const totalDistances = permutations.map((path) =>
		getTotalDistance(distances, path),
	);

	return Math.max(...totalDistances);
};
