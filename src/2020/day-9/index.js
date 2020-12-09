const input = require('./input.json');
const preamble = 25;

// Part 1
let result;
for (let i = preamble; i < input.length; i++) {
	const num = input[i];
	const prev = input.slice(i - preamble, i);

	const possible = prev.some(n =>
		prev.some(other => other !== n && other + n === num)
	);

	if (!possible) {
		result = num;
		break;
	}
}

console.log('Part 1:', result);

// Part 2
const index = input.indexOf(result);
main: for (let size = 2; size < index; size++) {
	for (let i = 0; i < index - size; i++) {
		const part = input.slice(i, i + size);
		const sum = part.reduce((acc, num) => acc + num, 0);

		if (sum === result) {
			console.log('Part 2:', Math.min(...part) + Math.max(...part));
			break main;
		}
	}
}
