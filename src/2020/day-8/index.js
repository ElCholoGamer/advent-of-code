const input = require('./input.json');

// Part 1
const passed = [];
let currentIndex = 0;
let acc = 0;

while (!passed.includes(currentIndex)) {
	passed.push(currentIndex);
	const [action, numStr] = input[currentIndex].split(' ');
	if (action === 'nop') {
		currentIndex++;
		continue;
	}

	const num = parseInt(numStr);
	if (action === 'acc') {
		acc += num;
		currentIndex++;
	} else {
		currentIndex += num;
	}
}

console.log('Part 1:', acc);

// Part 2
const tests = input.map((line, index, arr) => {
	const newInput = [...arr];

	if (line.includes('nop')) line = line.replace('nop', 'jmp');
	else if (line.includes('jmp')) line = line.replace('jmp', 'nop');

	newInput[index] = line;
	return newInput;
});

main: for (const test of tests) {
	let acc = 0;
	const passed = [];
	let currentIndex = 0;

	while (!passed.includes(currentIndex)) {
		passed.push(currentIndex);

		const [action, numStr] = test[currentIndex].split(' ');
		if (action === 'nop') {
			currentIndex++;
			continue;
		}

		const num = parseInt(numStr);
		if (action === 'acc') {
			acc += num;
			currentIndex++;
		} else {
			currentIndex += num;
		}

		if (currentIndex === test.length) {
			console.log('Part 2:', acc);
			break main;
		}
	}
}
