import { AoCPart } from '../../types';

const enum Tile {
	OPERATIONAL,
	DAMAGED,
}

interface SpringInfo {
	tiles: (Tile | null)[];
	groups: number[];
}

function parseSpring(str: string): SpringInfo {
	const [tileStr, groupsStr] = str.split(' ');

	return {
		tiles: tileStr
			.split('')
			.map((s) =>
				s === '?' ? Tile.DAMAGED : s === '#' ? Tile.OPERATIONAL : null,
			),
		groups: groupsStr.split(',').map(Number),
	};
}

function hashState(tiles: (Tile | null)[], groups: number[]) {
	return tiles.map((t) => t ?? '.').join('') + '-' + groups.join(',');
}

function countArrangements(
	spring: SpringInfo,
	cache: Map<string, number>,
): number {
	function _countArrangements(
		currentTiles: (Tile.OPERATIONAL | null)[],
		tileStart: number,
		group: number,
	): number {
		const hashKey = hashState(
			spring.tiles.slice(tileStart),
			spring.groups.slice(group),
		);
		if (cache.has(hashKey)) return cache.get(hashKey)!;

		if (group === spring.groups.length) {
			for (let i = 0; i < currentTiles.length; i++) {
				if (
					spring.tiles[i] !== Tile.DAMAGED &&
					spring.tiles[i] !== currentTiles[i]
				)
					return 0;
			}

			return 1;
		} else if (group > spring.groups.length) {
			throw new Error('how');
		}

		const minSpaceNeeded =
			spring.groups.slice(group).reduce((a, b) => a + b) +
			spring.groups.length -
			group -
			1;

		const groupLength = spring.groups[group];
		const until = currentTiles.length - minSpaceNeeded;

		let arrangements = 0;

		main: for (let pos = tileStart; pos <= until; pos++) {
			if (spring.tiles[pos - 1] === Tile.OPERATIONAL) break;
			if (spring.tiles[pos + groupLength] === Tile.OPERATIONAL) continue;

			for (let i = pos; i < pos + groupLength; i++) {
				if (spring.tiles[i] === null) {
					continue main;
				}
			}

			const newTiles = [...currentTiles];
			newTiles.splice(
				pos,
				groupLength,
				...Array(groupLength).fill(Tile.OPERATIONAL),
			);

			arrangements += _countArrangements(
				newTiles,
				pos + groupLength + 1,
				group + 1,
			);
		}

		cache.set(hashKey, arrangements);
		return arrangements;
	}

	return _countArrangements(Array(spring.tiles.length).fill(null), 0, 0);
}

export const part1: AoCPart = (input) => {
	let springs = input.map(parseSpring);

	const cache = new Map<string, number>();
	return springs.reduce(
		(sum, spring) => sum + countArrangements(spring, cache),
		0,
	);
};

export const part2: AoCPart = (input) => {
	const springs = input.map(parseSpring).map((spring) => {
		return {
			groups: [...Array(5)].map(() => [...spring.groups]).flat(),
			tiles: [...Array(5)]
				.map(() => [Tile.DAMAGED, ...spring.tiles])
				.flat()
				.slice(1),
		};
	});

	const cache = new Map<string, number>();
	return springs.reduce(
		(sum, spring) => sum + countArrangements(spring, cache),
		0,
	);
};
