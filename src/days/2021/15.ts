import { AoCPart } from '../../types';

interface Node<T> {
	data: T;
	priority: number;
}

class PriorityQueue<T> {
	public readonly items: Node<T>[] = [];

	public push(data: T, priority: number): number {
		const node: Node<T> = { data, priority };
		let contain = false;

		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].priority > node.priority) {
				this.items.splice(i, 0, node);
				contain = true;
				break;
			}
		}

		if (!contain) this.items.push(node);

		return this.size;
	}

	public pop(): T | undefined {
		if (this.size === 0) return undefined;

		return this.items.shift()?.data;
	}

	public setNodePriority(node: Node<T>, priority: number) {
		const index = this.items.indexOf(node);
		if (index === -1) throw new Error('Could not find node');

		this.items.splice(index, 1);
		this.push(node.data, priority);
	}

	public findNode(
		predicate: (value: Node<T>, index: number, obj: Node<T>[]) => boolean
	): Node<T> | undefined {
		return this.items.find(predicate);
	}

	public get size() {
		return this.items.length;
	}
}

interface Cell {
	risk: number;
	visited: boolean;
	totalRisk: number;
}

function parseInput(input: string[]): Cell[][] {
	const cells: Cell[][] = [[]];

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[y].length; x++) {
			cells[x] ||= [];
			cells[x][y] = {
				risk: Number(input[y][x]),
				visited: false,
				totalRisk: Infinity,
			};
		}
	}

	return cells;
}

function dijkstra(cells: Cell[][], startX: number, startY: number) {
	cells[startX][startY].totalRisk = 0;

	const queue = new PriorityQueue<[x: number, y: number]>();
	queue.push([startX, startY], 0);

	while (queue.size) {
		const [x, y] = queue.pop()!;
		const cell = cells[x][y];

		cell.visited = true;

		const branches = [
			[x - 1, y],
			[x + 1, y],
			[x, y - 1],
			[x, y + 1],
		];

		for (const [bX, bY] of branches) {
			const branch = cells[bX]?.[bY];
			if (!branch || branch.visited) continue;

			const branchNode = queue.findNode(({ data }) => data[0] === bX && data[1] === bY);

			const totalRisk = cell.totalRisk + branch.risk;

			if (totalRisk < branch.totalRisk) {
				branch.totalRisk = totalRisk;

				if (branchNode) {
					queue.setNodePriority(branchNode, totalRisk);
				}
			}

			if (!branchNode) {
				queue.push([bX, bY], branch.totalRisk);
			}
		}
	}
}

export const part1: AoCPart = async input => {
	const cells = parseInput(input);
	dijkstra(cells, 0, 0);

	const lastColumn = cells[cells.length - 1];
	return lastColumn[lastColumn.length - 1].totalRisk;
};

export const part2: AoCPart = async input => {
	const cells = parseInput(input);
	const ogWidth = cells.length;
	const ogHeight = Math.max(...cells.map(column => column.length));

	// Expand grid x5
	for (let tileX = 0; tileX < 5; tileX++) {
		for (let tileY = 0; tileY < 5; tileY++) {
			for (let x = 0; x < ogWidth; x++) {
				for (let y = 0; y < ogHeight; y++) {
					let risk = cells[x][y].risk + tileX + tileY;

					while (risk > 9) risk -= 9;

					const netX = ogWidth * tileX + x;
					const netY = ogHeight * tileY + y;

					cells[netX] ||= [];
					cells[netX][netY] = {
						risk,
						totalRisk: Infinity,
						visited: false,
					};
				}
			}
		}
	}

	dijkstra(cells, 0, 0);

	const lastColumn = cells[cells.length - 1];
	return lastColumn[lastColumn.length - 1].totalRisk;
};
