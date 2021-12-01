import { AoCPart } from '../../types';

export const part1: AoCPart = input => {
	const steps = input.split(', ');
	let direction = 0;
	const pos = [0, 0];

	steps.forEach(step => {
		const [, rotate, num] = step.match(/^([RL])([0-9]+)$/) || [];
		const distance = parseInt(num);

		if (rotate === 'R') {
			direction++;
		} else {
			direction--;
			if (direction <= -1) direction = 3;
		}

		switch (direction % 4) {
			case 0:
				// Go north
				pos[1] -= distance;
				break;
			case 1:
				// Go east
				pos[0] += distance;
				break;
			case 2:
				// Go south
				pos[1] += distance;
				break;
			case 3:
				// Go west
				pos[0] -= distance;
				break;
			default:
				throw new Error(`Invalid direction: ${direction}`);
		}
	});

	return Math.abs(pos[0]) + Math.abs(pos[1]);
};

export const part2: AoCPart = input => {
	const pos: [number, number] = [0, 0];
	let direction = 0;

	const steps = input.split(', ');
	const visited: [number, number][] = [];

	main: for (const step of steps) {
		const [, rotate, num] = step.match(/^([RL])([0-9]+)$/) || [];
		const distance = parseInt(num);

		if (rotate === 'R') {
			direction++;
		} else {
			direction--;
			if (direction <= -1) direction = 3;
		}

		for (let i = 0; i < distance; i++) {
			switch (direction % 4) {
				case 0:
					// Go north
					pos[1]--;
					break;
				case 1:
					// Go east
					pos[0]++;
					break;
				case 2:
					// Go south
					pos[1]++;
					break;
				case 3:
					// Go west
					pos[0]--;
					break;
				default:
					throw new Error(`Invalid direction: ${direction}`);
			}

			const found = visited.some(([x, y]) => x === pos[0] && y === pos[1]);
			if (!found) visited.push([...pos]);
			else break main;
		}
	}

	return Math.abs(pos[0]) + Math.abs(pos[1]);
};
