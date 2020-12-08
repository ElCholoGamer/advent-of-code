const [input] = require('./test.json');

const pos = [0, 0];
const target = parseInt(input);

/**
 * 0: north
 * 1: east
 * 2: south
 * 3: west
 */
let direction = 1;
let distance = 0;

for (let i = 0; i < target; i += distance) {
	if (direction === 3 || direction === 1) {
		console.log('Changing distance at direction', direction);
		distance++;
	}
	switch (direction) {
		case 0:
			pos[1] -= distance;
			break;
		case 1:
			pos[0] += distance;
			break;
		case 2:
			pos[1] += distance;
			break;
		case 3:
			pos[0] -= distance;
			break;
		default:
			throw new Error(`Invalid direction: ${direction}`);
	}
	console.log('Pos:', pos);
	console.log('Distance:', distance);
	console.log('Direction:', direction);
	console.log('='.repeat(30));

	direction--;
	if (direction < 0) direction = 3;
}

console.log(pos);
