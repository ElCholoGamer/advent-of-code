import { AoCPart } from '../../types';

interface Ingredient {
	name: string;
	capacity: number;
	durability: number;
	flavor: number;
	texture: number;
	calories: number;
}

function parseIngredient(line: string): Ingredient {
	const [name, propsStr] = line.split(': ');
	const props = propsStr.split(', ').reduce((result, prop) => {
		const [name, value] = prop.split(' ');
		return { ...result, [name]: Number(value) };
	}, {});

	return {
		name,
		...props,
	} as Ingredient;
}

function getCombinationsThatSumTo(target: number, nums: number): number[][] {
	if (target === 0) return [Array<number>(nums).fill(0)];
	if (nums <= 0) return [];

	const result: number[][] = [];

	for (let i = 0; i <= target; i++) {
		const subCombinations = getCombinationsThatSumTo(target - i, nums - 1);
		result.push(...subCombinations.map((combination) => [i, ...combination]));
	}

	return result;
}

export const part1: AoCPart = (input) => {
	const ingredients = input.map(parseIngredient);
	const combinations = getCombinationsThatSumTo(100, ingredients.length);

	const scores = combinations.map((combination) => {
		let capacity = 0;
		let durability = 0;
		let flavor = 0;
		let texture = 0;

		for (let i = 0; i < combination.length; i++) {
			const ingredient = ingredients[i];
			const amount = combination[i];

			capacity += ingredient.capacity * amount;
			durability += ingredient.durability * amount;
			flavor += ingredient.flavor * amount;
			texture += ingredient.texture * amount;
		}

		return (
			Math.max(capacity, 0) *
			Math.max(durability, 0) *
			Math.max(flavor, 0) *
			Math.max(texture, 0)
		);
	});

	return scores.reduce((a, b) => (a > b ? a : b));
};

export const part2: AoCPart = (input) => {
	// Same thing as part 1 but ignores recipes without 500 calories
	const ingredients = input.map(parseIngredient);
	const combinations = getCombinationsThatSumTo(100, ingredients.length);

	const scores = combinations.map((combination) => {
		let capacity = 0;
		let durability = 0;
		let flavor = 0;
		let texture = 0;
		let calories = 0;

		for (let i = 0; i < combination.length; i++) {
			const ingredient = ingredients[i];
			const amount = combination[i];

			capacity += ingredient.capacity * amount;
			durability += ingredient.durability * amount;
			flavor += ingredient.flavor * amount;
			texture += ingredient.texture * amount;
			calories += ingredient.calories * amount;
		}

		if (calories !== 500) return -1;

		return (
			Math.max(capacity, 0) *
			Math.max(durability, 0) *
			Math.max(flavor, 0) *
			Math.max(texture, 0)
		);
	});

	return scores.reduce((a, b) => (a > b ? a : b));
};
