import { AoCPart } from '../../types';

interface Game {
	id: number;
	picks: Pick[];
}

interface Pick {
	entries: Entry[];
}

interface Entry {
	color: 'red' | 'green' | 'blue';
	amount: number;
}

function parseGames(input: string[]) {
	const out: Game[] = [];

	for (const line of input) {
		const [gameLabel, pickStrings] = line.split(': ');
		const gameId = Number(gameLabel.split(' ')[1]);

		const picks: Pick[] = pickStrings.split('; ').map((pickStr) => {
			const entryStrings = pickStr.split(', ');
			return {
				entries: entryStrings.map((str) => {
					const words = str.split(' ');
					return {
						color: words[1] as any,
						amount: Number(words[0]),
					};
				}),
			};
		});

		out.push({ id: gameId, picks });
	}

	return out;
}

export const part1: AoCPart = (input) => {
	let sum = 0;

	const CUBE_COUNT = {
		red: 12,
		green: 13,
		blue: 14,
	};

	const games = parseGames(input);

	for (const game of games) {
		const isGamePossible = game.picks.every((pick) => {
			const pickedCubes = {
				red: 0,
				green: 0,
				blue: 0,
			};

			for (const { color, amount } of pick.entries) {
				pickedCubes[color] += amount;
				if (pickedCubes[color] > CUBE_COUNT[color]) {
					return false;
				}
			}

			return true;
		});

		if (isGamePossible) {
			sum += game.id;
		}
	}

	return sum;
};

export const part2: AoCPart = (input) => {
	const games = parseGames(input);
	let sum = 0;

	for (const game of games) {
		const minRequiredCubes = {
			red: 0,
			green: 0,
			blue: 0,
		};

		for (const pick of game.picks) {
			const pickedCubes = {
				red: 0,
				green: 0,
				blue: 0,
			};

			for (const { color, amount } of pick.entries) {
				pickedCubes[color] += amount;
			}

			minRequiredCubes.red = Math.max(minRequiredCubes.red, pickedCubes.red);
			minRequiredCubes.green = Math.max(minRequiredCubes.green, pickedCubes.green);
			minRequiredCubes.blue = Math.max(minRequiredCubes.blue, pickedCubes.blue);
		}

		sum += minRequiredCubes.red * minRequiredCubes.green * minRequiredCubes.blue;
	}

	return sum;
};
