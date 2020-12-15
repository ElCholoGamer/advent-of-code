const [input] = require('./input.json');

// Part 1
const initialNumbers = input.split(',').map(str => Number(str));
const turns = [...initialNumbers];

while (turns.length < 2020) {
	const index = turns.length - 1;
	const last = turns[index];

	const foundIndex = turns.slice(0, turns.length - 1).lastIndexOf(last);
	if (foundIndex === -1 || foundIndex === index) {
		// First time
		turns.push(0);
		continue;
	}

	// Already in array
	const diff = index - foundIndex;
	turns.push(diff);
}

console.log('Part 1:', turns[2019]);

// Part 2
turns.length = 0;
turns.push(...initialNumbers);

const target = 30000000;
const count = new Map(initialNumbers.map((num, index) => [num, index]));

while (turns.length < target) {
	const index = turns.length - 1;
	const last = turns[index];

	if (!count.has(last)) {
		count.set(last, index);
		turns.push(0);
		continue;
	}

	// Already in array
	const lastIndex = count.get(last);
	const diff = index - lastIndex;

	count.set(last, index);
	turns.push(diff);
}

console.log('Part 2:', turns[target - 1]);
