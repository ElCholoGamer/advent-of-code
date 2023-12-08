export interface Node<T> {
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

	public popNode(): Node<T> | undefined {
		return this.items.pop();
	}

	public pop(): T | undefined {
		return this.popNode()?.data;
	}

	public shiftNode(): Node<T> | undefined {
		return this.items.shift();
	}

	public shift(): T | undefined {
		return this.shiftNode()?.data;
	}

	public setNodePriority(node: Node<T>, priority: number) {
		const index = this.items.indexOf(node);
		if (index === -1) throw new Error('Could not find node');

		this.items.splice(index, 1);
		this.push(node.data, priority);
	}

	public findNode(
		predicate: (value: Node<T>, index: number, obj: Node<T>[]) => boolean,
	): Node<T> | undefined {
		return this.items.find(predicate);
	}

	public get size() {
		return this.items.length;
	}
}

export default PriorityQueue;
