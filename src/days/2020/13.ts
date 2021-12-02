import { AoCPart } from '../../types';

export const part1: AoCPart = ([departStr, idString]) => {
	const depart = Number(departStr);
	const ids = idString
		.split(',')
		.filter(id => id !== 'x')
		.map(Number);

	let busses = ids.map(() => 0);

	let time = 0;
	while (busses.every(bus => bus < depart)) {
		time++;
		busses = busses.map((bus, index) => {
			const id = ids[index];
			if (time % id !== 0) return bus;

			return bus + id;
		});
	}

	const earliest = Math.min(...busses.filter(bus => bus >= depart));

	const id = ids[busses.indexOf(earliest)];
	const waitTime = earliest - depart;

	return id * waitTime;
};

export const part2: AoCPart = ([, input]) => {
	const busses = input
		.split(',')
		.map((n, index) => [Number(n), index])
		.filter(n => !isNaN(n[0]));

	let t = 0;
	let [increment] = busses[0];

	busses.slice(1).forEach(bus => {
		while ((t + bus[1]) % bus[0] !== 0) {
			t += increment;
		}

		increment *= bus[0];
	});

	return t;
};
