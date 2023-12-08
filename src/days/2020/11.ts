import chalk from 'chalk';
import { AoCPart } from '../../types';
import { sleep } from '../../utils';

const copySeats = (seats: string[][]) =>
	[...Array(seats.length)].map((e, index) => [...seats[index]]);

function coordsEqual(set1: string[][], set2: string[][]) {
	try {
		return (
			set1.length === set2.length &&
			set1.every(
				(col, x) =>
					col.length === set2[x].length &&
					col.every((char, y) => set2[x][y] === char),
			)
		);
	} catch {
		return false;
	}
}

async function animated(input: string[]) {
	let seats: string[][] = [...Array(input[0].length)].map(() => []);
	input.forEach((row, y) => {
		row.split('').forEach((char, x) => (seats[x][y] = char));
	});

	const copySeats = () =>
		[...Array(seats.length)].map((e, index) => [...seats[index]]);

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

	let iteration = 0;
	let prev: string[][];
	do {
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
						if (curr !== '.') return acc + +(curr === '#');
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
			lines.forEach((line) => console.log(line));

			await sleep(100);
		}
		iteration++;
	} while (!coordsEqual(seats, prev));
}

export const part1: AoCPart = async (input) => {
	if (process.argv.includes('--animated')) {
		await animated(input);
		return '(No result)';
	}

	let seats: string[][] = [...Array(input[0].length)].map(() => []);
	input.forEach((row, y) => {
		row.split('').forEach((char, x) => (seats[x][y] = char));
	});

	let prev: string[][];
	do {
		prev = copySeats(seats);

		// Loop through every seat
		const copy = copySeats(seats);
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
				if (seats[x][y] === 'L' && adjacent.every((s) => s === 'L')) {
					copy[x][y] = '#';
				} else if (adjacent.filter((s) => s === '#').length >= 4) {
					copy[x][y] = 'L';
				}
			}
		}

		seats = [...Array(copy.length)].map((e, index) => [...copy[index]]);
	} while (!coordsEqual(seats, prev));

	return seats.reduce(
		(acc, col) => acc + col.reduce((acc, seat) => acc + +(seat === '#'), 0),
		0,
	);
};

export const part2: AoCPart = (input) => {
	let seats: string[][] = [...Array(input[0].length)].map(() => []);
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

	let prev: string[][];

	do {
		prev = copySeats(seats);

		// Loop through every seat
		const copy = copySeats(seats);
		for (let y = 0; y < copy[0].length; y++) {
			for (let x = 0; x < copy.length; x++) {
				if (copy[x][y] === '.') continue;

				// Get visible occupied seats
				const occupiedSeen = views.reduce((acc, [moveX, moveY]) => {
					const pos = [x, y];
					let curr;

					// Loop until a seat is found or no more seats left
					while ((curr = seats[(pos[0] += moveX)]?.[(pos[1] += moveY)])) {
						if (curr !== '.') return acc + +(curr === '#');
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
	} while (!coordsEqual(seats, prev));

	return seats.reduce(
		(acc, col) => acc + col.reduce((acc, seat) => acc + +(seat === '#'), 0),
		0,
	);
};
