import { AoCPart } from '../../types';
import { enumerate } from '../../utils/arrays';

function mixNumbers(numbers: number[], rounds: number): number[] {
	const orderedNumbers = enumerate(numbers);

	for (let r = 0; r < rounds; r++) {
		for (let i = 0; i < orderedNumbers.length; i++) {
			const index = orderedNumbers.findIndex(([ogIndex]) => ogIndex === i);
			const element = orderedNumbers[index];
			orderedNumbers.splice(index, 1);

			let newIndex = (index + element[1]) % orderedNumbers.length;
			while (newIndex <= 0) newIndex += orderedNumbers.length;

			orderedNumbers.splice(newIndex, 0, element);
		}
	}

	return orderedNumbers.map((n) => n[1]);
}

function findGroveCoordinates(mixedNumbers: number[]) {
	const indexOfZero = mixedNumbers.indexOf(0);
	if (indexOfZero === -1)
		throw new Error('list of numbers does not contain a zero');

	return (
		mixedNumbers[(indexOfZero + 1000) % mixedNumbers.length] +
		mixedNumbers[(indexOfZero + 2000) % mixedNumbers.length] +
		mixedNumbers[(indexOfZero + 3000) % mixedNumbers.length]
	);
}

export const part1: AoCPart = (input) =>
	findGroveCoordinates(mixNumbers(input.map(Number), 1));
export const part2: AoCPart = (input) =>
	findGroveCoordinates(
		mixNumbers(
			input.map((str) => Number(str) * 811589153),
			10,
		),
	);
