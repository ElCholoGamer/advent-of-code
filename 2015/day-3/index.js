const [input] = require('./input.json');
const chars = input.split('');

// Part 1
const alreadyVisited = [[0, 0]];
const pos = [0, 0];

const visited = chars.reduce((acc, char, index) => {
	// Change respective coordinate
	switch (char) {
		case '>':
			pos[0]++;
			break;
		case '<':
			pos[0]--;
			break;
		case '^':
			pos[1]--;
			break;
		case 'v':
			pos[1]++;
			break;
		default:
			throw new Error(`Invalid movement character at index ${index}`);
	}

	// Check if coordinates were already visited
	const already = alreadyVisited.some(([x, y]) => x === pos[0] && y === pos[1]);

	if (!already) {
		alreadyVisited.push([...pos]);
		return acc + 1;
	} else {
		return acc;
	}
}, 1);

console.log('Part 1:', visited);

// Part 2
// Clear visited houses
alreadyVisited.splice(0, alreadyVisited.length);
alreadyVisited.push([0, 0]);

const santa = [0, 0];
const roboSanta = [0, 0];

const newVisited = chars.reduce((acc, char, index) => {
	// Choose which position to move
	const pos = index % 2 ? roboSanta : santa;

	// Change respective coordinate
	switch (char) {
		case '>':
			pos[0]++;
			break;
		case '<':
			pos[0]--;
			break;
		case '^':
			pos[1]--;
			break;
		case 'v':
			pos[1]++;
			break;
		default:
			throw new Error(`Invalid movement character at index ${index}`);
	}

	// Check if coordinates were already visited
	const already = alreadyVisited.some(([x, y]) => x === pos[0] && y === pos[1]);
	if (!already) {
		alreadyVisited.push([...pos]);
		return acc + 1;
	} else {
		return acc;
	}
}, 1);

console.log('Part 2:', newVisited);
