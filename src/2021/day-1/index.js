const input = require('./input.json').map(str => Number(str));

let increments = 0;

for (let i = 1; i < input.length; i++) {
	increments += +(input[i] > input[i - 1]);
}

console.log('Part 1:', increments);

const windows = [];

for (let i = 0; i < input.length; i += 4) {
	windows.push(input[i] + input[i + 1] + input[i + 2]);
}

increments = 0;

for (let i = 1; i < input.length; i++) {
	const window = input[i] + input[i + 1] + input[i + 2];
	const prevWindow = input[i - 1] + input[i] + input[i + 1];
	increments += +(window > prevWindow);
}

console.log('Part 2:', increments);
