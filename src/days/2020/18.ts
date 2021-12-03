import { AoCPart } from '../../types';

function parseExpression(e: string): [number[], string[]] {
	const numbers = e
		.split(/\s+(\+|\*)\s+/)
		.map(Number)
		.filter(n => !isNaN(n));
	const operators = e.split(/\s*[0-9]+\s*/).filter(op => !!op);

	return [numbers, operators];
}

function solveExpressionPart1(e: string) {
	const [numbers, operators] = parseExpression(e);

	let result = numbers[0];

	for (let i = 1; i < numbers.length; i++) {
		const op = operators[i - 1];
		if (op === '+') {
			result += numbers[i];
		} else if (op === '*') {
			result *= numbers[i];
		} else {
			throw new Error(`Invalid operator: "${op}"`);
		}
	}

	return result;
}

export const part1: AoCPart = input => {
	const regex = /\([0-9]+(\s*(\+|\*)\s*[0-9]+)+\)/; // Matches parenthesis in operation
	const results = input.map(line => {
		let matchInfo: RegExpMatchArray | null;

		while ((matchInfo = line.match(regex))) {
			const match = matchInfo[0];
			const index = line.indexOf(match);
			const solvedExp = solveExpressionPart1(match.replace(/\(|\)/g, ''));
			line =
				line.substr(0, matchInfo.index) +
				solvedExp +
				line.substr(index + match.length, line.length);
		}

		return solveExpressionPart1(line);
	});

	return results.reduce((a, b) => a + b);
};

function solveExpressionPart2(e: string) {
	const sumRegex = /[0-9]+\s*\+\s*[0-9]+/; // Matches a sum in operation
	let matchInfo: RegExpMatchArray | null;

	// Replace sum operations with their result
	while ((matchInfo = e.match(sumRegex))) {
		const { 0: match, index = 0 } = matchInfo;
		const solvedExp = solveExpressionPart1(match);
		e = e.substr(0, matchInfo.index) + solvedExp + e.substr(index + match.length, e.length);
	}

	const [numbers, operators] = parseExpression(e);
	let result = numbers[0];

	for (let i = 1; i < numbers.length; i++) {
		const op = operators[i - 1];
		if (op === '+') {
			result += numbers[i];
		} else if (op === '*') {
			result *= numbers[i];
		} else {
			throw new Error(`Invalid operator: "${op}"`);
		}
	}

	return result;
}

export const part2: AoCPart = input => {
	const regex = /\([0-9]+(\s*(\+|\*)\s*[0-9]+)+\)/; // Matches parenthesis in operation
	const results = input.map(line => {
		let matchInfo: RegExpMatchArray | null;

		while ((matchInfo = line.match(regex))) {
			const { 0: match, index = 0 } = matchInfo;
			const solvedExp = solveExpressionPart2(match.replace(/\(|\)/g, ''));
			line =
				line.substr(0, matchInfo.index) +
				solvedExp +
				line.substr(index + match.length, line.length);
		}

		return solveExpressionPart2(line);
	});

	return results.reduce((a, b) => a + b);
};
