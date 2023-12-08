import { AoCPart } from '../../types';
import { isNumber } from '../../utils/strings';

const isSymbol = (char: string) => char !== '.' && !isNumber(char);

export const part1: AoCPart = (input) => {
	let sum = 0;

	for (let l = 0; l < input.length; l++) {
		const line = input[l];

		for (let i = 0; i < line.length; i++) {
			const char = line[i];
			if (!isNumber(char)) continue;

			let end = i;
			let numStr = '';
			do {
				numStr += line[end];
				end++;
			} while (end < line.length && isNumber(line[end]));

			let isPartNumber = false;

			for (
				let col = Math.max(i - 1, 0);
				col <= Math.min(end, line.length - 1);
				col++
			) {
				if (
					(l > 0 && isSymbol(input[l - 1][col])) ||
					isSymbol(input[l][col]) ||
					(l < input.length - 1 && isSymbol(input[l + 1][col]))
				) {
					isPartNumber = true;
					break;
				}
			}

			if (isPartNumber) sum += Number(numStr);
			i = end;
		}
	}

	return sum;
};

export const part2: AoCPart = (input) => {
	function searchNumberFrom(line: number, column: number): number {
		while (column > 0 && isNumber(input[line][column - 1])) {
			column--;
		}

		let numStr = '';

		do {
			numStr += input[line][column];
			column++;
		} while (column < input[line].length && isNumber(input[line][column]));

		return Number(numStr);
	}

	let sum = 0;

	for (let l = 0; l < input.length; l++) {
		const line = input[l];

		for (let c = 0; c < line.length; c++) {
			if (line[c] !== '*') continue;

			const numbers = new Set<number>();

			function tryGearNumber(line: number, column: number) {
				if (isNumber(input[line]?.[column])) {
					numbers.add(searchNumberFrom(line, column));
				}
			}

			for (let lo = -1; lo <= 1; lo++) {
				for (let co = -1; co <= 1; co++) {
					if (lo === 0 && co === 0) continue;

					if (isNumber(input[l + lo]?.[c + co])) {
						numbers.add(searchNumberFrom(l + lo, c + co));
					}
				}
			}

			if (numbers.size === 2) {
				const numArray = Array.from(numbers.values());
				sum += numArray[0] * numArray[1];
			}
		}
	}

	return sum;
};
