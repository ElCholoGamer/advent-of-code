import { AoCPart } from '../../types';

interface Fold {
	axis: string;
	position: number;
}

function parseInput(input: string[]): [boolean[][], Fold[]] {
	const folds: Fold[] = [];
	const dots: number[][] = [];

	let makeGrid = true;
	for (const line of input) {
		if (line === '') {
			makeGrid = false;
			continue;
		}

		if (makeGrid) {
			dots.push(line.split(',').map(Number));
		} else {
			const [axis, positionStr] = line.split(' ').slice(-1)[0].split('=');
			folds.push({ axis, position: Number(positionStr) });
		}
	}

	const maxWidth = Math.max(...dots.map(dot => dot[0])) + 1;
	const maxHeight = Math.max(...dots.map(dot => dot[1])) + 1;

	const paper: boolean[][] = [...Array(maxWidth)].map(() => Array(maxHeight).fill(false));

	for (const [x, y] of dots) {
		paper[x][y] = true;
	}

	return [paper, folds];
}

function foldPaper(grid: boolean[][], fold: Fold) {
	if (fold.axis === 'y') {
		// Horizontal fold (up)
		let foldSize = grid[0].length - fold.position;

		for (let yOffset = 0; yOffset < foldSize; yOffset++) {
			for (let x = 0; x < grid.length; x++) {
				const mirrorY = fold.position + yOffset;

				if (grid[x][mirrorY]) {
					grid[x][fold.position - yOffset] = true;
				}

				grid[x][mirrorY] = false;
			}
		}
	} else {
		// Vertical fold (left)
		let foldSize = grid.length - fold.position;

		for (let xOffset = 0; xOffset < foldSize; xOffset++) {
			const mirrorX = fold.position + xOffset;

			for (let y = 0; y < grid[0].length; y++) {
				if (grid[mirrorX][y]) {
					grid[fold.position - xOffset][y] = true;
				}

				grid[mirrorX][y] = false;
			}
		}
	}
}

export const part1: AoCPart = input => {
	const [paper, folds] = parseInput(input);

	foldPaper(paper, folds[0]);

	let count = 0;

	for (let x = 0; x < paper.length; x++) {
		for (let y = 0; y < paper[x].length; y++) {
			if (paper[x][y]) count++;
		}
	}

	return count;
};

export const part2: AoCPart = input => {
	const [paper, folds] = parseInput(input);

	for (const fold of folds) {
		foldPaper(paper, fold);
	}

	// Reduce paper width
	for (let x = paper.length - 1; x >= 0; x--) {
		if (paper[x].some(Boolean)) {
			paper.length = x + 1;
			break;
		}
	}

	// Reduce paper height
	for (let y = paper[0].length - 1; y >= 0; y--) {
		if (paper.some(col => col[y])) {
			for (let x = 0; x < paper.length; x++) {
				paper[x].length = y + 1;
			}
			break;
		}
	}

	let result = '';

	for (let y = 0; y < paper[0].length; y++) {
		result += '\n' + paper.map(col => (col[y] ? '#' : '.')).join(' ');
	}

	return result;
};
