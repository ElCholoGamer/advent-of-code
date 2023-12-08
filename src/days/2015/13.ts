import { AoCPart } from '../../types';

type PersonHappiness = Record<string, number>;

function parseInput(input: string[]) {
	const people: Record<string, PersonHappiness> = {};

	for (const line of input) {
		const [name, gainOrLose, units, nextTo] = line
			.replace(/would|happiness units by sitting next to|\./g, '')
			.split(/\s+/);

		people[name] ||= {};
		people[name][nextTo] = Number(units) * (gainOrLose === 'gain' ? 1 : -1);
	}

	return people;
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

function getArrangementHappiness(
	people: Record<string, PersonHappiness>,
	arrangement: string[],
) {
	let happinessChange = 0;

	for (let i = 0; i < arrangement.length; i++) {
		const person = arrangement[i];
		const next =
			i === arrangement.length - 1 ? arrangement[0] : arrangement[i + 1];
		const prev =
			i === 0 ? arrangement[arrangement.length - 1] : arrangement[i - 1];

		happinessChange +=
			(people[person][next] || 0) + (people[person][prev] || 0);
	}

	return happinessChange;
}

export const part1: AoCPart = (input) => {
	const people = parseInput(input);
	const arrangements = getPermutations(Object.keys(people));

	const happinessChanges = arrangements.map((arrangement) =>
		getArrangementHappiness(people, arrangement),
	);

	return Math.max(...happinessChanges);
};

export const part2: AoCPart = (input) => {
	const people = parseInput(input);
	people.me = {};

	const arrangements = getPermutations(Object.keys(people));

	const happinessChanges = arrangements.map((arrangement) =>
		getArrangementHappiness(people, arrangement),
	);

	// Manually calculate max value because stack overflow error with Math.max(...)
	let max = 0;
	for (const happiness of happinessChanges) {
		if (happiness > max) max = happiness;
	}

	return max;
};
