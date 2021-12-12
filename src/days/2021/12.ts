import { AoCPart } from '../../types';

interface CaveData {
	small: boolean;
	connections: Set<string>;
	visited: number;
}

function parseInput(input: string[]): Record<string, CaveData> {
	const caves: Record<string, CaveData> = {};

	function addCave(name: string) {
		caves[name] ||= {
			small: name.toLowerCase() === name,
			connections: new Set(),
			visited: 0,
		};
	}

	for (const line of input) {
		const [from, to] = line.split('-');

		addCave(from);
		addCave(to);

		caves[from].connections.add(to);
		caves[to].connections.add(from);
	}

	return caves;
}

export const part1: AoCPart = input => {
	const caves = parseInput(input);
	let paths = 0;

	function checkPaths(caveName: string): string[] {
		const cave = caves[caveName];

		if (caveName === 'end') {
			paths++;
			return [];
		}

		cave.visited++;
		const out: string[] = [caveName];

		for (const childName of cave.connections) {
			const child = caves[childName];
			if (child.small && child.visited > 0) continue;

			const affectedCaves = checkPaths(childName);
			out.push(childName);

			for (const affectedCave of affectedCaves) {
				caves[affectedCave].visited = 0;
			}
		}

		return out;
	}

	checkPaths('start');

	return paths;
};

export const part2: AoCPart = input => {
	const caves = parseInput(input);
	let paths = 0;

	let doubleCaveAvailable = true;

	function checkPaths(caveName: string) {
		const cave = caves[caveName];
		cave.visited++;

		for (const childName of cave.connections) {
			if (childName === 'start') continue;
			if (childName === 'end') {
				paths++;
				continue;
			}

			const child = caves[childName];

			if (child.small) {
				if (child.visited >= 2) continue;

				if (doubleCaveAvailable) {
					if (child.visited === 1) {
						doubleCaveAvailable = false;
					}
				} else if (child.visited > 0) {
					continue;
				}
			}

			checkPaths(childName);
			if (!doubleCaveAvailable && child.small && child.visited >= 2) {
				doubleCaveAvailable = true;
			}

			child.visited--;
		}
	}

	checkPaths('start');

	return paths;
};
