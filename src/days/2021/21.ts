import { AoCPart } from '../../types';

class DeterministicDie {
	private _rolls = 0;
	private currentValue = 0;

	public constructor(public readonly maxValue: number) {}

	public roll(): number {
		this._rolls++;
		return (this.currentValue++ % this.maxValue) + 1;
	}

	public get rolls() {
		return this._rolls;
	}
}

interface Player {
	position: number;
	score: number;
}

function parsePlayer(line: string): Player {
	const words = line.split(/\s+/);

	return {
		position: Number(words[words.length - 1]) - 1,
		score: 0,
	};
}

export const part1: AoCPart = (input) => {
	const players = input.map(parsePlayer);
	const die = new DeterministicDie(100);

	main: while (true) {
		for (const player of players) {
			const moves = die.roll() + die.roll() + die.roll();

			player.position = (player.position + moves) % 10;
			player.score += player.position + 1;

			if (player.score >= 1000) break main;
		}
	}

	const losingPlayer = players.sort((a, b) => a.score - b.score)[0];
	return losingPlayer.score * die.rolls;
};

function sizedPermutations<T>(arr: T[], size: number): T[][] {
	if (size === 1) return arr.map((e) => [e]);

	const out = [];

	for (const element of arr) {
		const subCombinations = sizedPermutations(arr, size - 1);
		out.push(...subCombinations.map((rest) => [element, ...rest]));
	}

	return out;
}

const serializeUniverse = (players: Player[], turn: number) =>
	players.map((p) => `${p.position},${p.score}`).join(';') + ':' + turn;

const deserializeUniverse = (str: string): [Player[], number] => {
	const [rest, turnStr] = str.split(':');

	const players = rest.split(';').map((str) => {
		const [position, score] = str.split(',').map(Number);
		return { position, score };
	});

	return [players, Number(turnStr)];
};

export const part2: AoCPart = (input) => {
	const players = input.map(parsePlayer);
	const winCounts: number[] = Array(players.length).fill(0);

	const possibleRolls = sizedPermutations([1, 2, 3], 3).map((roll) =>
		roll.reduce((a, b) => a + b),
	);

	let universeCounts = new Map<string, number>([
		[serializeUniverse(players, 0), 1],
	]);

	while (universeCounts.size) {
		const newUniverseCounts: typeof universeCounts = new Map();
		const entries = [...universeCounts.entries()];

		for (const [serializedUniverse, count] of entries) {
			const [players, turn] = deserializeUniverse(serializedUniverse);

			for (const roll of possibleRolls) {
				const player = { ...players[turn] }; // ✨ Quantum magic ✨

				player.position = (player.position + roll) % 10;
				player.score += player.position + 1;

				if (player.score >= 21) {
					winCounts[turn] += count;
				} else {
					const newPlayers = [...players];
					newPlayers[turn] = player;

					const key = serializeUniverse(
						newPlayers,
						(turn + 1) % newPlayers.length,
					);
					newUniverseCounts.set(key, (newUniverseCounts.get(key) || 0) + count);
				}
			}
		}

		universeCounts = newUniverseCounts;
	}

	return Math.max(...winCounts);
};
