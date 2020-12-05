const input = require('./input.json');

// Part 1
const paperAmount = input.reduce((acc, sizes) => {
	const [w, l, h] = sizes.split('x');

	const sides = [w * l, l * h, w * h];
	const area = sides.reduce((acc, side) => acc + side * 2, 0);

	// Extra is the area of the smaller side
	const extra = sides.reduce((acc, side) => Math.min(acc, side), sides[0]);

	return acc + area + extra;
}, 0);

console.log('Part 1:', paperAmount);

// Part 2
const ribbonAmount = input.reduce((acc, size) => {
	const sizes = size.split('x');
	const [w, h, l] = sizes;

	const [small1, small2] = sizes.sort((a, b) => a - b);
	const wrap = small1 * 2 + small2 * 2;
	const bow = w * h * l;

	return acc + wrap + bow;
}, 0);

console.log('Part 2:', ribbonAmount);
