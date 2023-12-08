import { AoCPart } from '../../types';

class Grid3 {
	public constructor(private readonly cubes = new Set<string>()) {}

	private formatCoords(x: number, y: number, z: number) {
		return [x, y, z].join(',');
	}

	public set(x: number, y: number, z: number, value: boolean) {
		const coords = this.formatCoords(x, y, z);
		if (value) {
			this.cubes.add(coords);
		} else {
			this.cubes.delete(coords);
		}
	}

	public get(x: number, y: number, z: number) {
		return this.cubes.has(this.formatCoords(x, y, z));
	}

	public activeCount() {
		return this.cubes.size;
	}

	public getBounds(): [min: number, max: number][] {
		const coords = Array.from(this.cubes.values()).map((coords) =>
			coords.split(',').map(Number),
		);

		const xKeys = coords.map((coord) => coord[0]);
		const yKeys = coords.map((coord) => coord[1]);
		const zKeys = coords.map((coord) => coord[2]);

		return [
			[Math.min(...xKeys) - 1, Math.max(...xKeys) + 1],
			[Math.min(...yKeys) - 1, Math.max(...yKeys) + 1],
			[Math.min(...zKeys) - 1, Math.max(...zKeys) + 1],
		];
	}
}

export const part1: AoCPart = async (input) => {
	let grid = new Grid3();

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[0].length; x++) {
			grid.set(x, y, 0, input[y][x] === '#');
		}
	}

	for (let cycle = 0; cycle < 6; cycle++) {
		const newGrid = new Grid3();

		const bounds = grid.getBounds();

		for (let x = bounds[0][0]; x <= bounds[0][1]; x++) {
			for (let y = bounds[1][0]; y <= bounds[1][1]; y++) {
				for (let z = bounds[2][0]; z <= bounds[2][1]; z++) {
					const currentState = grid.get(x, y, z);
					let activeNeighbors = 0;

					// Find active neighbors
					for (let offX = -1; offX <= 1; offX++) {
						for (let offY = -1; offY <= 1; offY++) {
							for (let offZ = -1; offZ <= 1; offZ++) {
								if (offX === 0 && offY === 0 && offZ === 0) continue;

								if (grid.get(x + offX, y + offY, z + offZ)) activeNeighbors++;
							}
						}
					}

					if (currentState) {
						if (activeNeighbors === 2 || activeNeighbors === 3) {
							newGrid.set(x, y, z, true);
						}
					} else if (activeNeighbors === 3) {
						newGrid.set(x, y, z, true);
					}
				}
			}
		}

		grid = newGrid;
	}

	return grid.activeCount();
};

class Grid4 {
	public constructor(private readonly cubes = new Set<string>()) {}

	private formatCoords(x: number, y: number, z: number, w: number) {
		return [x, y, z, w].join(',');
	}

	public set(x: number, y: number, z: number, w: number, value: boolean) {
		const coords = this.formatCoords(x, y, z, w);
		if (value) {
			this.cubes.add(coords);
		} else {
			this.cubes.delete(coords);
		}
	}

	public get(x: number, y: number, z: number, w: number) {
		return this.cubes.has(this.formatCoords(x, y, z, w));
	}

	public activeCount() {
		return this.cubes.size;
	}

	public getBounds(): [min: number, max: number][] {
		const coords = Array.from(this.cubes.values()).map((coords) =>
			coords.split(',').map(Number),
		);

		const xKeys = coords.map((coord) => coord[0]);
		const yKeys = coords.map((coord) => coord[1]);
		const zKeys = coords.map((coord) => coord[2]);
		const wKeys = coords.map((coord) => coord[3]);

		return [
			[Math.min(...xKeys) - 1, Math.max(...xKeys) + 1],
			[Math.min(...yKeys) - 1, Math.max(...yKeys) + 1],
			[Math.min(...zKeys) - 1, Math.max(...zKeys) + 1],
			[Math.min(...wKeys) - 1, Math.max(...wKeys) + 1],
		];
	}
}

export const part2: AoCPart = async (input) => {
	let grid = new Grid4();

	for (let y = 0; y < input.length; y++) {
		for (let x = 0; x < input[0].length; x++) {
			grid.set(x, y, 0, 0, input[y][x] === '#');
		}
	}

	for (let cycle = 0; cycle < 6; cycle++) {
		const newGrid = new Grid4();

		const bounds = grid.getBounds();

		for (let x = bounds[0][0]; x <= bounds[0][1]; x++) {
			for (let y = bounds[1][0]; y <= bounds[1][1]; y++) {
				for (let z = bounds[2][0]; z <= bounds[2][1]; z++) {
					for (let w = bounds[3][0]; w <= bounds[2][1]; w++) {
						const currentState = grid.get(x, y, z, w);
						let activeNeighbors = 0;

						// Find active neighbors
						for (let offX = -1; offX <= 1; offX++) {
							for (let offY = -1; offY <= 1; offY++) {
								for (let offZ = -1; offZ <= 1; offZ++) {
									for (let offW = -1; offW <= 1; offW++) {
										if (offX === 0 && offY === 0 && offZ === 0 && offW === 0)
											continue;

										if (grid.get(x + offX, y + offY, z + offZ, w + offW))
											activeNeighbors++;
									}
								}
							}
						}

						if (currentState) {
							if (activeNeighbors === 2 || activeNeighbors === 3) {
								newGrid.set(x, y, z, w, true);
							}
						} else if (activeNeighbors === 3) {
							newGrid.set(x, y, z, w, true);
						}
					}
				}
			}
		}

		grid = newGrid;
	}

	return grid.activeCount();
};
