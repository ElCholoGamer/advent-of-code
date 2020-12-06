const input = require('./input.json');

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// Part 1
const buttons = [
	['1', '4', '7'],
	['2', '5', '8'],
	['3', '6', '9'],
];

const pos = [1, 1];
const password = input.reduce((acc, line) => {
	line.split('').forEach(char => {
		switch (char) {
			case 'U':
				pos[1]--;
				break;
			case 'R':
				pos[0]++;
				break;
			case 'D':
				pos[1]++;
				break;
			case 'L':
				pos[0]--;
				break;
			default:
				throw new Error(`Invalid movement char: ${char}`);
		}

		pos[0] = clamp(pos[0], 0, 2);
		pos[1] = clamp(pos[1], 0, 2);
	});

	return acc + buttons[pos[0]][pos[1]];
}, '');

console.log('Part 1:', password);

// Part 2
const newButtons = [
	[null, null, '5', null, null],
	[null, '2', '6', 'A', null],
	['1', '3', '7', 'B', 'D'],
	[null, '4', '8', 'C', null],
	[null, null, '9', null, null],
];

pos[0] = 0;
pos[1] = 2;

const newPassword = input.reduce((acc, line) => {
	line.split('').forEach(char => {
		const [prevX, prevY] = [...pos];
		switch (char) {
			case 'U':
				pos[1]--;
				break;
			case 'R':
				pos[0]++;
				break;
			case 'D':
				pos[1]++;
				break;
			case 'L':
				pos[0]--;
				break;
			default:
				throw new Error(`Invalid movement char: ${char}`);
		}

		if (!newButtons[pos[0]] || !newButtons[pos[0]][pos[1]]) {
			pos[0] = prevX;
			pos[1] = prevY;
		}
	});

	return acc + newButtons[pos[0]][pos[1]];
}, '');

console.log('Part 1:', newPassword);
