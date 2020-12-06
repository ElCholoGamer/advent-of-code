const input = require('./input.json');

// Part 1
const lights = [...Array(1000)].map(() => Array(1000).fill(false));

for (const line of input) {
	const [startX, startY, endX, endY] = line
		.match(/[0-9]{1,3}/g)
		.map(str => parseInt(str));

	const toggle = line.indexOf('toggle') !== -1;
	const value = line.indexOf('on') !== -1;

	for (let x = startX; x <= endX; x++) {
		for (let y = startY; y <= endY; y++) {
			lights[x][y] = toggle ? !lights[x][y] : value;
		}
	}
}

// Count lit lights
const lit = lights.reduce(
	(acc, col) => acc + col.reduce((acc, light) => acc + light, 0),
	0
);

console.log('Part 1:', lit);

// Part 2
const newLights = [...Array(1000)].map(() => Array(1000).fill(0));

for (const line of input) {
	const [startX, startY, endX, endY] = line
		.match(/[0-9]{1,3}/g)
		.map(str => parseInt(str));

	const toggle = line.indexOf('toggle') !== -1;
	const value = line.indexOf('on') !== -1;

	const add = toggle ? 2 : value ? 1 : -1;

	for (let x = startX; x <= endX; x++) {
		for (let y = startY; y <= endY; y++) {
			newLights[x][y] = Math.max(newLights[x][y] + add, 0);
		}
	}
}

const brightness = newLights.reduce(
	(acc, col) => acc + col.reduce((acc, light) => acc + light, 0),
	0
);

console.log('Part 2:', brightness);
