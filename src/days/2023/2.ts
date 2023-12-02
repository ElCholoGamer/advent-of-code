import { AoCPart } from '../../types';

type Color = 'red' | 'green' | 'blue';

interface Game {
	id: number;
	picks: Pick[];
}

interface Pick {
	color: Color;
	amount: number;
}

function parseGames(input: string[]) {
	const out: Game[] = [];

	for (const line of input) {
		const [gameLabel, pickStrings] = line.split(': ');
		const gameId = Number(gameLabel.split(' ')[1]);

		const picks: Pick[] = pickStrings
			.replaceAll(';', ',')
			.split(', ')
			.map((str) => {
				const words = str.split(' ');
				return {
					color: words[1] as any,
					amount: Number(words[0]),
				};
			});

		out.push({ id: gameId, picks });
	}

	return out;
}

function getMaxPickedCubes(game: Game): Record<Color, number> {
	const out: Record<Color, number> = {
		red: 0,
		blue: 0,
		green: 0,
	};

	for (const { color, amount } of game.picks) {
		if (amount > out[color]) out[color] = amount;
	}

	return out;
}

export const part1: AoCPart = (input) => {
	const CUBE_COUNT = {
		red: 12,
		green: 13,
		blue: 14,
	};

	return parseGames(input)
		.filter((game) => {
			const maxPickedCubes = getMaxPickedCubes(game);
			return (
				maxPickedCubes.red <= CUBE_COUNT.red &&
				maxPickedCubes.green <= CUBE_COUNT.green &&
				maxPickedCubes.blue <= CUBE_COUNT.blue
			);
		})
		.map((game) => game.id)
		.reduce((a, b) => a + b);
};

export const part2: AoCPart = (input) => {
	return parseGames(input)
		.map((game) => {
			const maxPickedCubes = getMaxPickedCubes(game);
			return maxPickedCubes.red * maxPickedCubes.green * maxPickedCubes.blue;
		})
		.reduce((a, b) => a + b);
};
