const input = require('./input.json');

// Part 1
const pos = [0, 0];

/**
 * Directions:
 * 0: North
 * 1: East
 * 2: South
 * 3: West
 */
let direction = 1;

const instructions = input.map(line => [
	line[0],
	parseInt(line.substr(1, line.length - 1)),
]);

instructions.forEach(([action, num], index) => {
	switch (action) {
		case 'N':
			pos[1] -= num;
			break;
		case 'E':
			pos[0] += num;
			break;
		case 'S':
			pos[1] += num;
			break;
		case 'W':
			pos[0] -= num;
			break;
		case 'F':
			// FORWARD
			switch (direction) {
				case 0: // North
					pos[1] -= num;
					break;
				case 1: // East
					pos[0] += num;
					break;
				case 2: // South
					pos[1] += num;
					break;
				case 3: // West
					pos[0] -= num;
					break;
				default:
					throw new Error(`Invalid direction: ${direction}`);
			}
			break;
		case 'R':
			// Turn right
			direction += num / 90;
			if (direction > 3) direction -= 4;
			break;
		case 'L':
			// Turn left
			direction -= num / 90;
			if (direction < 0) direction += 4;
			break;
		default:
			throw new Error(`Invalid action at index ${index}: "${action}"`);
	}
});

const distance = Math.abs(pos[0] + pos[1]);
console.log('Part 1:', distance);

// Part 2
pos[0] = 0;
pos[1] = 0;
let waypoint = [10, -1];

instructions.forEach(([action, num], index) => {
	switch (action) {
		case 'N':
			waypoint[1] -= num;
			break;
		case 'E':
			waypoint[0] += num;
			break;
		case 'S':
			waypoint[1] += num;
			break;
		case 'W':
			waypoint[0] -= num;
			break;
		case 'F':
			const diffX = waypoint[0] * num;
			const diffY = waypoint[1] * num;

			pos[0] += diffX;
			pos[1] += diffY;
			break;
		case 'R':
			const times = num / 90;
			for (let i = 0; i < times; i++) {
				waypoint = [-waypoint[1], waypoint[0]];
			}
			break;
		case 'L':
			const times2 = num / 90;
			for (let i = 0; i < times2; i++) {
				waypoint = [waypoint[1], -waypoint[0]];
			}
			break;
		default:
			throw new Error(`Invalid action at index ${index}: "${action}"`);
	}
});

const newDistance = Math.abs(pos[0] + pos[1]);
console.log('Part 2:', newDistance);
