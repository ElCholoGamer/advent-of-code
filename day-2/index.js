const input = require('./input.json');

// Part 1
const validCount = input.reduce((acc, curr) => {
	const [times, letter, password] = curr.split(/:? /);
	const [min, max] = times.split('-');

	const repetitions = password.split('').filter(l => l === letter).length;
	return acc + (repetitions >= min && repetitions <= max);
}, 0);

console.log('Part 1:', validCount);

// Part 2
const newValidCount = input.reduce((acc, curr) => {
	const [indexes, letter, password] = curr.split(/:? /);
	const [pos1, pos2] = indexes.split('-').map(l => parseInt(l) - 1);

	return acc + ((password[pos1] === letter) ^ (password[pos2] === letter));
}, 0);

console.log('Part 2:', newValidCount);
