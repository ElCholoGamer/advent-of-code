const input = require('./input.json');

// Part 1
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

const countOccupied = () =>
	seats.reduce(
		(acc, col) => acc + col.reduce((acc, seat) => acc + (seat === '#'), 0),
		0
	);

const copySeats = () =>
	[...Array(seats.length)].map((e, index) => [...seats[index]]);

let prev;
while (!coordsEqual(seats, prev)) {
	prev = copySeats();

	// Loop through every seat
	const copy = copySeats();
	for (let y = 0; y < copy[0].length; y++) {
		for (let x = 0; x < copy.length; x++) {
			if (copy[x][y] === '.') continue;

			// Get adjacent seats
			const adjacent = [];
			for (let offsetX = -1; offsetX < 2; offsetX++) {
				for (let offsetY = -1; offsetY < 2; offsetY++) {
					if (offsetX === 0 && offsetY === 0) continue;

					const seat = seats[x + offsetX]?.[y + offsetY];
					if (seat && seat !== '.') adjacent.push(seat);
				}
			}

			// Change seat depending on adjacent seats
			if (seats[x][y] === 'L' && adjacent.every(s => s === 'L')) {
				copy[x][y] = '#';
			} else if (adjacent.filter(s => s === '#').length >= 4) {
				copy[x][y] = 'L';
			}
		}
	}

	seats = [...Array(copy.length)].map((e, index) => [...copy[index]]);
}

const occupied = countOccupied();
console.log('Part 1:', occupied);

// Part 2
seats = [...Array(input[0].length)].map(() => []);
input.forEach((row, y) => {
	row.split('').forEach((char, x) => (seats[x][y] = char));
});

// Directions to check for seats
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
}

const newOccupied = countOccupied();
console.log('Part 2:', newOccupied);
