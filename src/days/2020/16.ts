import { AoCPart } from '../../types';

const bypass = ['', 'your ticket:', 'nearby tickets:'];

function part1WithRules(input: string[]): [number, Record<string, number[][]>] {
	const rules: Record<string, number[][]> = {};

	const result = input.reduce((acc, line, index, arr) => {
		if (bypass.indexOf(line) !== -1 || arr[index - 1] === 'your ticket:')
			return acc;

		const nums = line.split(',').map((num) => Number(num));

		if (nums.some(isNaN)) {
			// Line establishes a rule
			const [name, values] = line.split(': ');
			const ranges = values
				.split(' or ')
				.map((group) => group.split('-').map(Number));

			rules[name] = ranges;
			return acc;
		}

		// Line is a nearby ticket
		for (const num of nums) {
			// Find a rule with a valid range
			const found = Object.values(rules).some((ranges) =>
				ranges.some((range) => num >= range[0] && num <= range[1]),
			);

			if (!found) {
				acc += num;
				break;
			}
		}

		return acc;
	}, 0);

	return [result, rules];
}

export const part1: AoCPart = (input) => {
	return part1WithRules(input)[0];
};

export const part2: AoCPart = (input) => {
	const rules = part1WithRules(input)[1];
	const validTickets = input
		.filter((line, index, arr) => {
			if (bypass.indexOf(line) !== -1) return false;

			const nums = line.split(',').map((num) => Number(num));
			if (nums.some((n) => isNaN(n)) || arr[index - 1] === 'your ticket:')
				return false;

			const rangeList: number[][][] = Object.values(rules);

			const isValid = nums.every((num) => {
				const found = rangeList.some((ranges) =>
					ranges.some((range) => num >= range[0] && num <= range[1]),
				);
				return found;
			});

			return isValid;
		})
		.map((line) => line.split(',').map((n) => Number(n)));

	const fieldPositions: Record<number, Set<string>> = validTickets[0].reduce(
		(acc, e, i) => ({ ...acc, [i]: new Set() }),
		{},
	);

	while (Object.values(fieldPositions).some((set) => set.size !== 1)) {
		validTickets.forEach((nums) => {
			nums.forEach((num, index) => {
				const validFields = Object.keys(rules).filter((key) => {
					const ranges = rules[key];
					return ranges.some((range) => num >= range[0] && num <= range[1]);
				});

				const current = fieldPositions[index];

				if (!current.size) {
					validFields.forEach((field) => current.add(field));
				} else {
					// Delete invalid values
					const values = Array.from(current.values());
					values
						.filter((entry) => validFields.indexOf(entry) === -1)
						.forEach((entry) => current.delete(entry));

					// Delete values taken by completed sets
					const completedSets = Object.values(fieldPositions).filter(
						(set) => set.size === 1,
					);
					completedSets.forEach((set) =>
						set.forEach((val) => {
							if (current.size > 1) current.delete(val);
						}),
					);
				}
			});
		});
	}

	// Find indexes whose fields start with departure
	const departures = Object.keys(fieldPositions)
		.filter((key) =>
			fieldPositions[<number>(<unknown>key)]
				.values()
				.next()
				.value.startsWith('departure'),
		)
		.map(Number);

	// Get my ticket
	const selfTicket = input
		.find((l, index, arr) => arr[index - 1] === 'your ticket:')!
		.split(',');

	// Calculate result of departure fields
	return departures
		.map((index) => selfTicket[index])
		.reduce((acc, num) => acc * Number(num), 1);
};
