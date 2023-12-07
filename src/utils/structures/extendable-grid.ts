export class ExtendableGrid<T> {
	private _width = 0;
	private _height = 0;
	private readonly grid: T[][] = [];

	public constructor(private readonly fillValue: T) {}

	public get(x: number, y: number): T;
	public get(x: number, y: number, defaultValue: T): T;
	public get(x: number, y: number, defaultValue = this.fillValue): T {
		const value = this.grid[x]?.[y];
		return value === undefined ? defaultValue : value;
	}

	public set(x: number, y: number, value: T) {
		if (y >= this._height) {
			const newHeight = y + 1;
			for (let column = 0; column < this.width; column++) {
				this.grid[column].push(...Array(newHeight - this._height).fill(this.fillValue));
			}
			this._height = newHeight;
		}

		if (x >= this._width) {
			const newWidth = x + 1;
			this.grid.push(
				...[...Array(newWidth - this._width)].map(() => Array(this._height).fill(this.fillValue))
			);
			this._width = newWidth;
		}

		this.grid[x][y] = value;
	}

	public rawData() {
		return this.grid;
	}

	public get width() {
		return this._width;
	}

	public get height() {
		return this._height;
	}
}
