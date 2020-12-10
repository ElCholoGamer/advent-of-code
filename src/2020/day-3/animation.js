const input = require('./input.json');

const coords = [...Array(input[0].length)].map(() => Array(input.length));

input.forEach((line, y) => {
	line.split('').forEach((char, x) => (coords[x][y] = char === '#'));
});

const pos = [0, 0];
const slope = [3, 1];

const timer = setInterval(() => {
	const [extraX, extraY] = [60, 15];
	const sliced = coords
		.slice(Math.max(pos[0] - extraX, 0), pos[0] + extraX)
		.map(col => col.slice(Math.max(pos[1] - extraY, 0), pos[1] + extraY));

	const lines = [];
	for (let y = 0; y < sliced[0].length; y++) {
		let line = '';
		for (let x = pos[0] - extraX; x < pos[0] + extraX; x++) {
			let copy = x;
			while (copy < 0) copy += sliced.length;
			copy = copy % sliced.length;

			line += sliced[copy][y] ? '△' : '.';
		}
		lines.push(line);
	}

	if (lines.length > extraY) {
		const middleLine = lines[extraY];
		lines[extraY] =
			middleLine.substr(0, extraX - 1) + '▮' + middleLine.substr(extraX);
	}

	console.clear();
	lines.forEach(line => console.log(line));

	pos[0] += slope[0];
	pos[1] += slope[1];

	if (pos[0] >= coords.length) pos[0] -= coords.length;
	if (pos[1] >= coords[0].length) clearInterval(timer);
}, 100);
