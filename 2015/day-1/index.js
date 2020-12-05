const [input] = require('./input.json');
const chars = input.split('');

// Part 1
const finalFloor = chars.reduce((acc, char) => acc + (char === '(' || -1), 0);
console.log('Part 1:', finalFloor);

// Part 2
let floor = 0;
let basementChar;
for (let i = 0; i < input.length; i++) {
	floor += input[i] === '(' || -1;
	if (floor === -1) {
		basementChar = i + 1;
		break;
	}
}

console.log('Part 2:', basementChar);
