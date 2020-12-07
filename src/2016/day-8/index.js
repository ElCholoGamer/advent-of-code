const input = require('./input.json');

const screen = [...Array(50)].map(() => Array(6).fill(false));

// Part 1
input.forEach(line => {
	const [action, rest] = line.split(/\s(.+)/);

	if (action === 'rect') {
		// Draw new rect
		const [sizeX, sizeY] = rest.split('x').map(num => parseInt(num));

		for (let x = 0; x < sizeX; x++) {
			for (let y = 0; y < sizeY; y++) {
				screen[x][y] = true;
			}
		}
	} else {
		// Rotate an axis
		const [, coords, , amountString] = rest.split(/\s+/);
		const [axis, posString] = coords.split('=');

		const pos = parseInt(posString);
		const amount = parseInt(amountString);

		if (axis === 'x') {
			const prev = [...screen[pos]];

			for (let y = 0; y < prev.length; y++) {
				let newIndex = y + amount;
				if (newIndex >= prev.length) newIndex -= prev.length;
				else if (newIndex < 0) newIndex += prev.length;

				screen[pos][newIndex] = prev[y];
			}
		} else {
			const prev = [...screen.map(col => col[pos])];

			for (let x = 0; x < prev.length; x++) {
				let newIndex = x + amount;
				if (newIndex >= prev.length) newIndex -= prev.length;
				else if (newIndex < 0) newIndex += prev.length;

				screen[newIndex][pos] = prev[x];
			}
		}
	}
});

const lit = screen.reduce(
	(acc, col) => acc + col.reduce((acc, light) => acc + light, 0),
	0
);

console.log('Part 1:', lit);

// Part 2
console.log('Part 2:');
for (let y = 0; y < screen[0].length; y++) {
	let str = '';
	for (let x = 0; x < screen.length; x++) {
		str += screen[x][y] ? '#' : '.';
	}
	console.log(str);
}
