import { AoCPart } from '../../types';
import { count } from '../../utils/arrays';

interface Tree {
	height: number;
	markedVisible: boolean;
}

function parseInput(input: string[]): Tree[][] {
	return [...Array(input[0].length)].map((_, x) =>
		input.map(line => ({
			height: parseInt(line[x]),
			markedVisible: false,
		}))
	);
}

export const part1: AoCPart = input => {
	const trees = parseInput(input);

	for (let y = 0; y < trees.length; y++) {
		let maxHeight = -1;

		for (let x = 0; x < trees[y].length; x++) {
			if (trees[y][x].height > maxHeight) {
				trees[y][x].markedVisible = true;

				maxHeight = trees[y][x].height;
				if (maxHeight === 9) break;
			}
		}

		maxHeight = -1;

		for (let x = trees[y].length - 1; x >= 0; x--) {
			if (trees[y][x].height > maxHeight) {
				trees[y][x].markedVisible = true;

				maxHeight = trees[y][x].height;
				if (maxHeight === 9) break;
			}
		}
	}

	for (let x = 0; x < trees[0].length; x++) {
		let maxHeight = -1;

		for (let y = 0; y < trees.length; y++) {
			if (trees[y][x].height > maxHeight) {
				trees[y][x].markedVisible = true;

				maxHeight = trees[y][x].height;
				if (maxHeight === 9) break;
			}
		}

		maxHeight = -1;

		for (let y = trees.length - 1; y >= 0; y--) {
			if (trees[y][x].height > maxHeight) {
				trees[y][x].markedVisible = true;

				maxHeight = trees[y][x].height;
				if (maxHeight === 9) break;
			}
		}
	}

	return trees.reduce((sum, row) => sum + count(row, tree => tree.markedVisible), 0);
};

interface ViewingTree extends Tree {
	score: number;
}

export const part2: AoCPart = input => {
	const trees: ViewingTree[][] = parseInput(input).map(col =>
		col.map(tree => ({ ...tree, score: -1 }))
	);

	function viewingDistanceX(treeX: number, treeY: number, step: 1 | -1): number {
		let viewingDistance = 0;
		for (let x = treeX + step; x < trees[treeY].length && x >= 0; x += step) {
			viewingDistance++;
			if (trees[treeY][x].height >= trees[treeY][treeX].height) break;
		}

		return viewingDistance;
	}

	function viewingDistanceY(treeX: number, treeY: number, step: 1 | -1): number {
		let viewingDistance = 0;
		for (let y = treeY + step; y < trees.length && y >= 0; y += step) {
			viewingDistance++;
			if (trees[y][treeX].height >= trees[treeY][treeX].height) break;
		}

		return viewingDistance;
	}

	let maxScore = 0;

	for (let y = 0; y < trees.length; y++) {
		for (let x = 0; x < trees[y].length; x++) {
			const up = viewingDistanceY(x, y, -1);
			const left = viewingDistanceX(x, y, -1);
			const down = viewingDistanceY(x, y, 1);
			const right = viewingDistanceX(x, y, 1);

			const score = up * left * down * right;
			if (score > maxScore) maxScore = score;
		}
	}

	return maxScore;
};
