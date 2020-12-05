const input = require('./input.json');

// Part 1
// Get seat positions
const seats = input.map(line => {
	// Find row
	const row = [0, 127]; // Starts at min. 0 and  max. 127
	for (let i = 0; i < 7; i++) {
		const index = line[i] === 'F' ? 1 : 0;
		row[index] += Math.round((row[1] - row[0]) / 2) * (!index || -1);
	}

	// Find column
	const col = [0, 7]; // Starts at min. 0 and max. 7
	for (let i = 7; i < line.length; i++) {
		const index = line[i] === 'L' ? 1 : 0;
		col[index] += Math.round((col[1] - col[0]) / 2) * (!index || -1);
	}

	return [row[0], col[0]]; // Return a tuple with row and column
});

const ids = seats.map(([row, col]) => row * 8 + col);
const maxId = ids.reduce((acc, id) => Math.max(acc, id), ids[0]);

console.log('Part 1:', maxId);

// Part 2
let selfId;
const minId = ids.reduce((acc, id) => Math.min(acc, id), ids[0]);

// Find missing ID in list
for (let i = minId; i < maxId; i++) {
	if (!ids.find(id => id === i)) selfId = i;
}

console.log('Part 2:', selfId);
