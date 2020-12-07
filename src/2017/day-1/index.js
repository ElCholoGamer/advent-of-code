const [input] = require('./input.json');

// Part 1
const nums = input.split('').map(num => parseInt(num));

const sum = nums.reduce((acc, num, index, arr) => {
	const next = arr[index === arr.length - 1 ? 0 : index + 1];
	return acc + (num === next && num);
}, 0);

console.log('Part 1:', sum);

// Part 2
const newSum = nums.reduce((acc, num, index, arr) => {
	let nextIndex = index + arr.length / 2;
	if (nextIndex >= arr.length) nextIndex -= arr.length;

	return acc + (num === arr[nextIndex] && num);
}, 0);

console.log('Part 2:', newSum);
