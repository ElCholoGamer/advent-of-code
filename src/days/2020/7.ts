import { AoCPart } from '../../types';

function getBags(input: string[]) {
	const bags: Record<string, any> = {};

	input.forEach((line) => {
		const [bag, rest] = line.split(' bags contain ');
		if (!bags[bag]) bags[bag] = {};

		if (rest === 'no other bags.') return;

		const bagsInside = rest.split(', ');

		bagsInside.forEach((bagInside) => {
			const [numStr, name] = bagInside
				.replace(/ bag(s)?(\.$)?/, '')
				.split(/ (.+)/);

			bags[bag][name] = Number(numStr);
		});
	});

	return bags;
}

export const part1: AoCPart = (input) => {
	const bags = getBags(input);

	function checkBag(bagName: string): boolean {
		if (!bags[bagName]) return false;

		// Recursion is really cool ngl
		return Object.keys(bags[bagName]).some(
			(bag) => bag === 'shiny gold' || checkBag(bag),
		);
	}

	return Object.keys(bags).reduce((acc, key) => acc + +checkBag(key), 0);
};

export const part2: AoCPart = (input) => {
	const bags = getBags(input);
	function getBagsInside(bagName: string): number {
		if (!bags[bagName]) return 0;

		return Object.keys(bags[bagName]).reduce((acc, key) => {
			const amount = bags[bagName][key];
			return acc + amount + getBagsInside(key) * amount;
		}, 0);
	}

	return getBagsInside('shiny gold');
};
