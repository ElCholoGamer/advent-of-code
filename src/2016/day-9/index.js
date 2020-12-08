const [input] = require('./input.json');

// Part 1
let decompressed = input;
const regex = /(?<!\([0-9]+x[0-9]+\))(\([0-9]+x[0-9]+\))/g;

let match;
while ((match = regex.exec(decompressed)) !== null) {
	const { index } = match;
	const [length, times] = match[0]
		.match(/[0-9]+/g)
		.map(match => parseInt(match));

	const str = decompressed.substr(index + match[0].length, length);

	// Add a space to these to prevent regex matching
	const repeated = str.replace(/\(/g, '( ').repeat(times);

	decompressed =
		decompressed.substr(0, index) +
		repeated +
		decompressed.substr(index + match[0].length + str.length);
}

console.log('Part 1:', decompressed.replace(/\s+/g, '').length);

// Part 2
function decompress(string) {
	const regex = /(?<!\([0-9]+x[0-9]+\))(\([0-9]+x[0-9]+\))/g;

	let match;
	while ((match = regex.exec(string)) !== null) {
		const { index } = match;
		const [length, times] = match[0]
			.match(/[0-9]+/g)
			.map(match => parseInt(match));

		let sub = string.substr(index + match[0].length, length);
		sub = decompress(sub);

		string =
			string.substr(0, index) +
			sub.repeat(times) +
			string.substr(index + match[0].length + length);
	}

	return string;
}

decompressed = decompress(input);
console.log(decompressed);
console.log('Part 2:', decompressed.length);
