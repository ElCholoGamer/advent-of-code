const input = require('./input.json');

// Part 1
const letters = [];
input.forEach((line, y) => {
	line.split('').forEach((char, x) => {
		if (!letters[x]) letters[x] = [];
		letters[x][y] = char;
	});
});

const repeated = letters.map(chars => {
	const count = chars.reduce((acc, char) => {
		const { [char]: curr = 0 } = acc;
		return { ...acc, [char]: curr + 1 };
	}, {});

	const arr = Object.keys(count).map(key => [key, count[key]]);
	arr.sort((a, b) => b[1] - a[1]);
	return arr[0][0];
});

const word = repeated.join('');
console.log('Part 1:', word);

// Part 2
const newRepeated = letters.map(chars => {
	const count = chars.reduce((acc, char) => {
		const { [char]: curr = 0 } = acc;
		return { ...acc, [char]: curr + 1 };
	}, {});

	const arr = Object.keys(count).map(key => [key, count[key]]);
	arr.sort((a, b) => a[1] - b[1]);
	return arr[0][0];
});

const newWord = newRepeated.join('');
console.log('Part 2:', newWord);
