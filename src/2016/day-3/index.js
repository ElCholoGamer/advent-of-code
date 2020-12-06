const input = require('./input.json');

// Part 1
const valid = input.reduce((acc, line) => {
	const [side1, side2, side3] = line.split(/\s+/).map(num => parseInt(num));

	const results = [
		[side1 + side2, side3],
		[side1 + side3, side2],
		[side2 + side3, side1],
	];
	return acc + results.every(([result, other]) => result > other);
}, 0);

console.log('Part 1:', valid);

// Part 2
const nums = input
	.join(' ')
	.split(/\s+/)
	.map(num => parseInt(num));

const triangles = nums.reduce((acc, num, index) => {
	if (index % 9 > 2) return acc;
	return [...acc, [num, nums[index + 3], nums[index + 6]]];
}, []);

const newValid = triangles.reduce((acc, triangle) => {
	const [side1, side2, side3] = triangle;

	const results = [
		[side1 + side2, side3],
		[side1 + side3, side2],
		[side2 + side3, side1],
	];
	return acc + results.every(([result, other]) => result > other);
}, 0);

console.log('Part 2:', newValid);
