import { AoCPart } from '../../types';

const enum Move {
	ROCK,
	PAPER,
	SCISSORS,
}

type Round = [Move, Move];

const parseRounds = (input: string[]): Round[] =>
	input.map(
		line =>
			line.split(' ').map(char => {
				if (char === 'A' || char === 'X') return Move.ROCK;
				if (char === 'B' || char === 'Y') return Move.PAPER;
				return Move.SCISSORS;
			}) as Round
	);

export const part1: AoCPart = input => {
	return parseRounds(input).reduce(
		(score, [enemyMove, ownMove]) => score + ownMove + 1 + ((ownMove - enemyMove + 4) % 3) * 3,
		0
	);
};

export const part2: AoCPart = input => {
	return parseRounds(input).reduce(
		(score, [enemyMove, outcome]) => score + ((enemyMove + outcome + 2) % 3) + 1 + outcome * 3,
		0
	);
};
