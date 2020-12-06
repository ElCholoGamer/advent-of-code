const [input] = require('./input.json');

const steps = input.split(', ');

// Part 1
/**
 * 0: north
 * 1: east
 * 2: south
 * 3: west
 */
let direction = 0;
const pos = [0, 0];

steps.forEach(step => {
	const [, rotate, num] = step.match(/^([RL])([0-9]+)$/);
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

const distance = Math.abs(pos[0]) + Math.abs(pos[1]);
console.log('Part 1:', distance);

// Part 2
pos[0] = 0;
pos[1] = 0;
direction = 0;
const visited = [];

main: for (const step of steps) {
	const [, rotate, num] = step.match(/^([RL])([0-9]+)$/);
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

const newDistance = Math.abs(pos[0]) + Math.abs(pos[1]);
console.log('Part 2:', newDistance);
