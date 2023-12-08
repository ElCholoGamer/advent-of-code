import { AoCPart } from '../../types';
import { count } from '../../utils/arrays';

interface Tree {
	height: number;
	markedVisible: boolean;
}

function parseTreeHeights(input: string[]): number[][] {
	return [...Array(input[0].length)].map((_, x) =>
		input.map((line) => parseInt(line[x])),
	);
}

export const part1: AoCPart = (input) => {
	const trees: Tree[][] = parseTreeHeights(input).map((col) =>
		col.map((height) => ({ height, markedVisible: false })),
	);

	for (let x = 0; x < trees.length; x++) {
		let maxHeight = -1;

		for (let y = 0; y < trees[x].length; y++) {
			if (trees[x][y].height > maxHeight) {
				trees[x][y].markedVisible = true;

				maxHeight = trees[x][y].height;
				if (maxHeight === 9) break;
			}
		}

		maxHeight = -1;

		for (let y = trees[x].length - 1; y >= 0; y--) {
			if (trees[x][y].height > maxHeight) {
				trees[x][y].markedVisible = true;

				maxHeight = trees[x][y].height;
				if (maxHeight === 9) break;
			}
		}
	}

	for (let y = 0; y < trees[0].length; y++) {
		let maxHeight = -1;

		for (let x = 0; x < trees.length; x++) {
			if (trees[x][y].height > maxHeight) {
				trees[x][y].markedVisible = true;

				maxHeight = trees[x][y].height;
				if (maxHeight === 9) break;
			}
		}

		maxHeight = -1;

		for (let x = trees.length - 1; x >= 0; x--) {
			if (trees[x][y].height > maxHeight) {
				trees[x][y].markedVisible = true;

				maxHeight = trees[x][y].height;
				if (maxHeight === 9) break;
			}
		}
	}

	return trees.reduce(
		(sum, row) => sum + count(row, (tree) => tree.markedVisible),
		0,
	);
};

export const part2: AoCPart = (input) => {
	const treeHeights = parseTreeHeights(input);

	function viewingDistance(
		treeX: number,
		treeY: number,
		axis: 'x' | 'y',
		step: 1 | -1,
	): number {
		const baseHeight = treeHeights[treeX][treeY];
		let viewingDistance = 0;

		if (axis === 'x') {
			for (let x = treeX + step; x < treeHeights.length && x >= 0; x += step) {
				viewingDistance++;
				if (treeHeights[x][treeY] >= baseHeight) break;
			}
		} else {
			for (
				let y = treeY + step;
				y < treeHeights[0].length && y >= 0;
				y += step
			) {
				viewingDistance++;
				if (treeHeights[treeX][y] >= baseHeight) break;
			}
		}

		return viewingDistance;
	}

	let maxScore = 0;

	for (let x = 0; x < treeHeights.length; x++) {
		for (let y = 0; y < treeHeights[x].length; y++) {
			const up = viewingDistance(x, y, 'y', -1);
			const left = viewingDistance(x, y, 'x', -1);
			const down = viewingDistance(x, y, 'y', 1);
			const right = viewingDistance(x, y, 'x', 1);

			const score = up * left * down * right;
			if (score > maxScore) maxScore = score;
		}
	}

	return maxScore;
};
