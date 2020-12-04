const input = require('./input.json');

// Part 1
for (const num of input) {
	const found = input.find(
		otherNum => otherNum !== num && otherNum + num === 2020
	);
	if (!found) continue;

	const result = found * num;
	console.log('Part 1:', result);
	break;
}

// Part 2
for (const num1 of input) {
	for (const num2 of input) {
		const found = input.find(
			otherNum =>
				![num1, num2].includes(otherNum) && num1 + num2 + otherNum === 2020
		);
		if (!found) continue;

		const result = num1 * num2 * found;
		console.log('Part 2:', result);
		return;
	}
}
