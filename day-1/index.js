const { readFileSync } = require('fs');
const { resolve } = require('path');

const input = readFileSync(resolve(__dirname, 'input.txt')).toString();
const nums = input.split('\r\n').map(str => parseInt(str));

// Part 1
for (const num of nums) {
	const found = nums.find(
		otherNum => otherNum !== num && otherNum + num === 2020
	);
	if (!found) continue;

	const result = found * num;
	console.log('Part 1:', result);
	break;
}

// Part 2
for (const num1 of nums) {
	for (const num2 of nums) {
		const found = nums.find(
			otherNum =>
				![num1, num2].includes(otherNum) && num1 + num2 + otherNum === 2020
		);
		if (!found) continue;

		const result = num1 * num2 * found;
		console.log('Part 2:', result);
		return;
	}
}
