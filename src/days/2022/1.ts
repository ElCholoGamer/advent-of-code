import { AoCPart } from '../../types';

const parseCaloriesList = (input: string[]) => {
	const caloriesList: number[] = [];
	let tmp = 0;

	for (const line of input) {
		if (line === '') {
			caloriesList.push(tmp);
			tmp = 0;
		} else {
			tmp += parseInt(line);
		}
	}

	return caloriesList;
};

export const part1: AoCPart = (input) => {
	const caloriesList = parseCaloriesList(input);
	return Math.max(...caloriesList);
};

export const part2: AoCPart = (input) => {
	const caloriesList = parseCaloriesList(input);
	caloriesList.sort((a, b) => b - a);

	return caloriesList[0] + caloriesList[1] + caloriesList[2];
};
