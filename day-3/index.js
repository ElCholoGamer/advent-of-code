const { readFileSync } = require('fs');
const { resolve } = require('path');

const input = readFileSync(resolve(__dirname, 'input.txt')).toString();
const lines = input.split('\r\n');

// Part 1
// Get coordinates
const coords = [];
lines.forEach((row, y) => {
	row.split('').forEach((letter, x) => {
		if (!coords[x]) coords[x] = [];
		coords[x][y] = letter;
	});
});

let trees = 0;
let x = 0;

// Loop until Y reaches end of input
for (let y = 0; y < coords[0].length; y++) {
	if (x >= coords.length) x -= coords.length; // This wraps the X position around
	if (coords[x][y] === '#') trees++;

	x += 3;
}

console.log('Part 1:', trees);

// Part 2
const slopes = [
	[1, 1],
	[3, 1],
	[5, 1],
	[7, 1],
	[1, 2],
];

const total = slopes.reduce((acc, slope) => {
	let trees = 0;
	let x = 0;

	// Loop until Y reaches end of input
	for (let y = 0; y < coords[0].length; y += slope[1]) {
		if (x >= coords.length) x -= coords.length; // This wraps the X position around
		if (coords[x][y] === '#') trees++;

		x += slope[0];
	}

	return acc * trees;
}, 1);

console.log('Part 2:', total);
