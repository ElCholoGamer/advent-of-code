import { AoCPart } from '../../types';

interface State {
	location: string;
	totalPressure: number;
	closedValves: Set<string>;
	timeLeft: number;
}

interface Valve {
	flowRate: number;
	leadsTo: string[];
}

function parseValves(input: string[]) {
	const valves: Record<string, Valve> = {};

	for (const line of input) {
		const id = line.split(' ')[1];
		const flowRate = Number(line.match(/\d+/)?.[0]);
		const leadsTo = line.split(/ valves? /)[1].split(', ');

		valves[id] = {
			flowRate,
			leadsTo,
		};
	}

	return valves;
}

const computeDistances = (valves: Record<string, Valve>) => {
	const distances: Record<string, Record<string, number>> = {};
	const valveNames = Object.keys(valves);
	const initialNodes: Record<string, { steps: number; visited: boolean }> = {};

	// Initialize initial nodes
	for (const name of valveNames) {
		initialNodes[name] = {
			steps: Infinity,
			visited: false,
		};
	}

	for (const from of valveNames) {
		distances[from] = {};

		for (const to of valveNames) {
			if (valves[to].flowRate === 0) continue;

			if (from === to) {
				distances[from][to] = 0;
				continue;
			}

			const nodeDistances: Record<string, number> = {};

			const queue: string[] = [];
			queue.push(from);
			nodeDistances[from] = 0;

			while (queue.length > 0) {
				const valveName = queue.shift()!;

				for (const neighborName of valves[valveName].leadsTo) {
					if (neighborName in nodeDistances) continue;

					nodeDistances[neighborName] = nodeDistances[valveName] + 1;
					distances[from][neighborName] = nodeDistances[neighborName];
					queue.push(neighborName);
				}
			}
		}
	}

	return distances;
};

export const part1: AoCPart = (input) => {
	const valves = parseValves(input);
	const distances = computeDistances(valves);

	const nonZeroValves = Object.keys(valves).filter((name) => valves[name].flowRate > 0);

	const stack = [] as State[];
	stack.push({
		location: 'AA',
		totalPressure: 0,
		closedValves: new Set(nonZeroValves),
		timeLeft: 30,
	});

	let maxPressure = 0;

	while (stack.length > 0) {
		const state = stack.pop()!;

		if (state.closedValves.size === 0) {
			if (state.totalPressure > maxPressure) {
				maxPressure = state.totalPressure;
			}
			continue;
		}

		for (const nextValveName of state.closedValves) {
			const newTimeLeft = state.timeLeft - distances[state.location][nextValveName] - 1;
			if (newTimeLeft <= 0) {
				if (state.totalPressure > maxPressure) {
					maxPressure = state.totalPressure;
				}
				continue;
			}

			const newClosedValves = new Set(state.closedValves);
			newClosedValves.delete(nextValveName);

			const newTotalPressure =
				state.totalPressure + valves[nextValveName].flowRate * newTimeLeft;
			stack.push({
				...state,
				location: nextValveName,
				timeLeft: newTimeLeft,
				closedValves: newClosedValves,
				totalPressure: newTotalPressure,
			});
		}
	}

	return maxPressure;
};

interface State2 {
	location: string;
	totalPressure: number;
	closedValves: Set<string>;
	timeLeft: number;
	elephant: boolean;
}

export const part2: AoCPart = (input) => {
	const valves = parseValves(input);
	const distances = computeDistances(valves);
	const nonZeroValves = Object.keys(valves).filter((name) => valves[name].flowRate > 0);

	const stack: State2[] = [];
	stack.push({
		location: 'AA',
		totalPressure: 0,
		closedValves: new Set(nonZeroValves),
		timeLeft: 26,
		elephant: false,
	});

	let maxPressure = 0;

	while (stack.length > 0) {
		const state = stack.pop()!;

		if (state.closedValves.size === 0) {
			if (state.totalPressure > maxPressure) {
				maxPressure = state.totalPressure;
			}
			continue;
		}

		for (const nextValveName of state.closedValves) {
			const newTimeLeft = state.timeLeft - distances[state.location][nextValveName] - 1;

			if (newTimeLeft <= 0) {
				if (!state.elephant) {
					stack.push({
						...state,
						location: 'AA',
						timeLeft: 26,
						elephant: true,
					});
				} else if (state.totalPressure > maxPressure) {
					maxPressure = state.totalPressure;
				}
				continue;
			}

			const newClosedValves = new Set(state.closedValves);
			newClosedValves.delete(nextValveName);

			stack.push({
				...state,
				location: nextValveName,
				timeLeft: newTimeLeft,
				closedValves: newClosedValves,
				totalPressure: state.totalPressure + valves[nextValveName].flowRate * newTimeLeft,
			});
		}
	}

	return maxPressure;
};
