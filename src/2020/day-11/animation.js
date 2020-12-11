const chalk = require('chalk');
const input = require('./input.json');

let seats = [...Array(input[0].length)].map(() => []);
input.forEach((row, y) => {
	row.split('').forEach((char, x) => (seats[x][y] = char));
});

function coordsEqual(set1, set2) {
	try {
		return (
			set1.length === set2.length &&
			set1.every(
				(col, x) =>
					col.length === set2[x].length &&
					col.every((char, y) => set2[x][y] === char)
			)
		);
	} catch {
		return false;
	}
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const copySeats = () =>
	[...Array(seats.length)].map((e, index) => [...seats[index]]);

let prev;
const views = [
	[0, -1],
	[1, -1],
	[1, 0],
	[1, 1],
	[0, 1],
	[-1, 1],
	[-1, 0],
	[-1, -1],
];

(async () => {
	let iteration = 0;
	while (!coordsEqual(seats, prev)) {
		prev = copySeats();

		// Loop through every seat
		const copy = copySeats();
		for (let y = 0; y < copy[0].length; y++) {
			for (let x = 0; x < copy.length; x++) {
				if (copy[x][y] === '.') continue;

				// Get visible occupied seats
				const occupiedSeen = views.reduce((acc, [moveX, moveY]) => {
					const pos = [x, y];
					let curr;

					// Loop until a seat is found or no more seats left
					while ((curr = seats[(pos[0] += moveX)]?.[(pos[1] += moveY)])) {
						if (curr !== '.') return acc + (curr === '#');
					}

					return acc;
				}, 0);

				// Change seats acordingly
				if (seats[x][y] === '#' && occupiedSeen >= 5) {
					copy[x][y] = 'L';
				} else if (occupiedSeen === 0) {
					copy[x][y] = '#';
				}
			}
		}

		seats = [...Array(copy.length)].map((e, index) => [...copy[index]]);

		if (iteration % 2 !== 0) {
			const lines = [];
			for (let y = seats[0].length - 20; y < seats[0].length; y++) {
				let line = '';
				for (let x = 0; x < seats.length; x++) {
					let seat = seats[x][y];
					if (seat === '#') seat = chalk.green('▮');
					if (seat === '.') seat = chalk.gray('▮');
					if (seat === 'L') seat = chalk.red('▮');

					line += seat;
				}
				lines.push(line);
			}

			console.clear();
			lines.forEach(line => console.log(line));

			await sleep(100);
		}
		iteration++;
	}
})();
