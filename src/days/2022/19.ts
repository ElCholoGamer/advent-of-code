import { AoCPart } from '../../types';

interface Blueprint {
	oreRobotCost: number;
	clayRobotCost: number;
	obsidianRobotCost: {
		ore: number;
		clay: number;
	};
	geodeRobotCost: {
		ore: number;
		obsidian: number;
	};
}

interface State {
	ore: number;
	clay: number;
	obsidian: number;
	geode: number;
	oreRobots: number;
	clayRobots: number;
	obsidianRobots: number;
	geodeRobots: number;
	timeLeft: number;
}

function stringifyState(state: State) {
	return `${state.ore}/${state.clay}/${state.obsidian}/${state.geode}&${state.oreRobots}/${state.clayRobots}/${state.obsidianRobots}/${state.geodeRobots}-${state.timeLeft}`;
}

function parseBlueprint(line: string): Blueprint {
	const result = line.match(/\d+/g)?.map(Number);
	if (!result) throw new Error('what');

	return {
		oreRobotCost: result[1],
		clayRobotCost: result[2],
		obsidianRobotCost: {
			ore: result[3],
			clay: result[4],
		},
		geodeRobotCost: {
			ore: result[5],
			obsidian: result[6],
		},
	};
}

function elapseTime(state: State, time: number): State {
	return {
		...state,
		ore: state.ore + state.oreRobots * time,
		clay: state.clay + state.clayRobots * time,
		obsidian: state.obsidian + state.obsidianRobots * time,
		geode: state.geode + state.geodeRobots * time,
		timeLeft: state.timeLeft - time,
	};
}

function maxGeodes(blueprint: Blueprint, time: number): number {
	const maxOreCost = Math.max(
		blueprint.oreRobotCost,
		blueprint.clayRobotCost,
		blueprint.obsidianRobotCost.ore,
		blueprint.geodeRobotCost.ore
	);

	const queue: State[] = [
		{
			ore: 0,
			clay: 0,
			obsidian: 0,
			geode: 0,
			oreRobots: 1,
			clayRobots: 0,
			obsidianRobots: 0,
			geodeRobots: 0,
			timeLeft: time,
		},
	];
	const seenStates = new Set<string>();

	let maxGeodes = 0;

	while (queue.length > 0) {
		const state = queue.pop()!;

		if (state.timeLeft <= 0) {
			if (state.geodeRobots === 0) continue;

			const producedGeodes = state.geode + state.timeLeft * state.geodeRobots;
			if (producedGeodes > maxGeodes) maxGeodes = producedGeodes;
			continue;
		}

		if (state.obsidianRobots > 0) {
			// Geode robot
			const oreNeeded = Math.max(blueprint.geodeRobotCost.ore - state.ore, 0);
			const obsidianNeeded = Math.max(blueprint.geodeRobotCost.obsidian - state.obsidian, 0);
			const timeElapsed =
				Math.max(
					Math.ceil(oreNeeded / state.oreRobots),
					Math.ceil(obsidianNeeded / state.obsidianRobots)
				) + 1;

			const newState = elapseTime(state, timeElapsed);
			newState.ore -= blueprint.geodeRobotCost.ore;
			newState.obsidian -= blueprint.geodeRobotCost.obsidian;
			newState.geodeRobots++;
			queue.push(newState);
			if (timeElapsed === 1) continue;
		}

		if (state.oreRobots < maxOreCost) {
			// Ore robot
			const oreNeeded = Math.max(blueprint.oreRobotCost - state.ore, 0);
			const timeElapsed = Math.ceil(oreNeeded / state.oreRobots) + 1;

			const newState = elapseTime(state, timeElapsed);
			newState.ore -= blueprint.oreRobotCost;
			newState.oreRobots++;
			queue.push(newState);
		}

		if (state.clayRobots < blueprint.obsidianRobotCost.clay) {
			// Clay robot
			const oreNeeded = Math.max(blueprint.clayRobotCost - state.ore, 0);
			const timeElapsed = Math.ceil(oreNeeded / state.oreRobots) + 1;

			const newState = elapseTime(state, timeElapsed);
			newState.ore -= blueprint.clayRobotCost;
			newState.clayRobots++;
			queue.push(newState);
		}

		if (state.clayRobots > 0) {
			// Obsidian robot
			const oreNeeded = Math.max(blueprint.obsidianRobotCost.ore - state.ore, 0);
			const clayNeeded = Math.max(blueprint.obsidianRobotCost.clay - state.clay, 0);
			const timeElapsed =
				Math.max(Math.ceil(oreNeeded / state.oreRobots), Math.ceil(clayNeeded / state.clayRobots)) +
				1;

			const newState = elapseTime(state, timeElapsed);
			newState.ore -= blueprint.obsidianRobotCost.ore;
			newState.clay -= blueprint.obsidianRobotCost.clay;
			newState.obsidianRobots++;
			queue.push(newState);
		}
	}

	return maxGeodes;
}

export const part1: AoCPart = input => {
	const blueprints = input.map(parseBlueprint);
	return blueprints.map((b, i) => maxGeodes(b, 24) * (i + 1)).reduce((a, b) => a + b);
};

export const part2: AoCPart = input => {
	const blueprints = input.map(parseBlueprint).slice(0, 3);
	return blueprints.map(b => maxGeodes(b, 32)).reduce((a, b) => a * b);
};
