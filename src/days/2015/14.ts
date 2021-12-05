import { AoCPart } from '../../types';

const TIME_LIMIT = 2503;

interface Reindeer {
	name: string;
	speed: number;
	flyTime: number;
	restTime: number;
	distance: number;
	currently: 'flying' | 'resting';
	timer: number;
}

function parseReindeer(line: string): Reindeer {
	const [name, , , speedStr, , , flyTimeStr, , , , , , , restTimeStr] = line.split(' ');
	const flyTime = Number(flyTimeStr);

	return {
		name,
		speed: Number(speedStr),
		flyTime,
		restTime: Number(restTimeStr),
		distance: 0,
		currently: 'flying',
		timer: flyTime - 1,
	};
}

function cycleReindeer(reindeer: Reindeer) {
	if (reindeer.currently === 'flying') {
		// Flying
		reindeer.distance += reindeer.speed;

		if (reindeer.timer <= 0) {
			reindeer.timer = reindeer.restTime;
			reindeer.currently = 'resting';
		}
	} else {
		// Resting
		if (reindeer.timer <= 0) {
			reindeer.timer = reindeer.flyTime;
			reindeer.currently = 'flying';
		}
	}

	reindeer.timer--;
}

export const part1: AoCPart = input => {
	const reindeers = input.map(parseReindeer);

	for (let second = 0; second < TIME_LIMIT; second++) {
		for (const reindeer of reindeers) {
			cycleReindeer(reindeer);
		}
	}

	return reindeers.reduce((a, b) => (a.distance > b.distance ? a : b)).distance;
};

export const part2: AoCPart = input => {
	const reindeers = input.map(line => ({ ...parseReindeer(line), points: 0 }));

	for (let i = 0; i < TIME_LIMIT; i++) {
		for (const reindeer of reindeers) {
			cycleReindeer(reindeer);
		}

		const maxDistance = reindeers.reduce((a, b) => (a.distance > b.distance ? a : b)).distance;

		const leads = reindeers.filter(r => r.distance >= maxDistance);

		leads.forEach(l => l.points++);
	}

	return reindeers.reduce((a, b) => (a.points > b.points ? a : b)).points;
};
