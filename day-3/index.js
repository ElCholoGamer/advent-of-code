const input = require('./input.json');

// Part 1
// Get coordinates
const coords = [];
input.forEach((row, y) => {
	coords;
	row.split('').forEach((letter, x) => {
		if (!coords[x]) coords[x] = [];
		coords[x][y] = letter;
	});
});

let trees = 0;
let y = 0;
let x = 0;

// Loop until Y reaches end of input
while (y < coords[0].length) {
	if (x >= coords.length) x -= coords.length;
	if (coords[x][y] === '#') trees++;

	x += 3;
	y++;
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
	let y = 0;
	let x = 0;

	// Loop until Y reaches end of input
	while (y < coords[0].length) {
		if (x >= coords.length) x -= coords.length;
		if (coords[x][y] === '#') trees++;

		x += slope[0];
		y += slope[1];
	}
	return acc * trees;
}, 1);

console.log('Part 2:', total);
