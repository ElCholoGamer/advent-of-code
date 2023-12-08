import { AoCPart } from '../../types';

interface Board {
	data: BoardItem[][];
	completed: boolean;
}

interface BoardItem {
	value: number;
	marked: boolean;
}

function formatBoard(board: Board) {
	const lines: string[] = [];

	for (let y = 0; y < board.data.length; y++) {
		const chars: string[] = [];
		for (let x = 0; x < board.data[0].length; x++) {
			chars.push(board.data[x][y].value.toString());
		}

		lines.push(chars.join(' '));
	}

	return lines.join('\n');
}

function parseInput(input: string[]): [number[], Board[]] {
	input = [...input, ''];
	const numbers = input[0].split(',').map(Number);
	const boards: Board[] = [];

	let index: number;
	while ((index = input.indexOf('')) !== -1) {
		const rows = input.splice(index, 6).filter((e) => e !== '');
		if (rows.length === 0) continue;

		const board: Board = { data: [[]], completed: false };
		boards.push(board);

		const rowNumbers = rows.map((row) => row.trim().split(/\s+/).map(Number));

		for (let x = 0; x < rowNumbers[0].length; x++) {
			for (let y = 0; y < rowNumbers.length; y++) {
				board.data[x] ||= [];
				board.data[x][y] = {
					value: rowNumbers[y][x],
					marked: false,
				};
			}
		}
	}

	return [numbers, boards];
}

function cycleBoard(num: number, board: Board) {
	for (let x = 0; x < board.data.length; x++) {
		for (let y = 0; y < board.data[x].length; y++) {
			if (board.data[x][y].value === num) {
				board.data[x][y].marked = true;
			}
		}
	}

	const columnCheck = board.data.some((col) =>
		col.every((item) => item.marked),
	);
	const rowCheck = board.data[0].some((_, rowIndex) =>
		board.data.every((column) => column[rowIndex].marked),
	);

	return columnCheck || rowCheck;
}

export const part1: AoCPart = (input) => {
	const [numbers, boards] = parseInput(input);

	for (const num of numbers) {
		for (const board of boards) {
			const completed = cycleBoard(num, board);

			if (completed) {
				const unmarkedSum = board.data.reduce(
					(acc, col) =>
						acc +
						col.filter((i) => !i.marked).reduce((acc, i) => acc + i.value, 0),
					0,
				);

				return num * unmarkedSum;
			}
		}
	}

	throw new Error('Couls not find result');
};

export const part2: AoCPart = (input) => {
	const [numbers, boards] = parseInput(input);

	for (const num of numbers) {
		for (const board of boards) {
			if (board.completed) continue;
			const completed = cycleBoard(num, board);

			if (completed) {
				board.completed = true;

				if (!boards.some((board) => !board.completed)) {
					const unmarkedSum = board.data.reduce(
						(acc, col) =>
							acc +
							col.filter((i) => !i.marked).reduce((acc, i) => acc + i.value, 0),
						0,
					);

					return num * unmarkedSum;
				}
			}
		}
	}

	throw new Error('Could not find result');
};
