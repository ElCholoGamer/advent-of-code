import { AoCPart } from '../../types';
import { Vector2 } from '../../utils/structures/vector';

function parseReport(str: string): { sensor: Vector2; beacon: Vector2 } {
	const result = str.match(/-?(\d+)/g);
	if (!result) throw new Error('could not match any numbers');

	const [sX, sY, bX, bY] = result.map(Number);
	return {
		sensor: new Vector2(sX, sY),
		beacon: new Vector2(bX, bY),
	};
}

export const part1: AoCPart = (input) => {
	const reports = input.map(parseReport);
	const markedSpots = new Set<number>();
	const testRow = 2_000_000;

	for (const { sensor, beacon } of reports) {
		const distanceToBeacon = beacon.clone().subtract(sensor).manhattanLength();
		const distanceToRow = Math.abs(sensor.y - testRow);
		const extension = distanceToBeacon - distanceToRow;

		for (let x = -extension; x <= extension; x++) {
			markedSpots.add(sensor.x + x);
		}
	}

	for (const { beacon } of reports) {
		if (beacon.y === testRow) {
			markedSpots.delete(beacon.x);
		}
	}

	return markedSpots.size;
};

class Range {
	public constructor(public start: number, public end: number) {}

	public get size() {
		return this.end - this.start + 1;
	}
}

export const part2: AoCPart = (input) => {
	const reports = input.map(parseReport);
	// const sensors = reports.map(report => {
	// 	const clearRange = report.sensor.clone().subtract(report.beacon).manhattanLength();
	// 	return {
	// 		position: report.sensor,
	// 		clearRange,
	// 	};
	// });

	const RANGE = 4_000_000;
	// const RANGE = 20;

	for (let y = 0; y <= RANGE; y++) {
		const markedRanges = new Set<Range>();

		for (const { sensor, beacon } of reports) {
			const distanceToBeacon = beacon.clone().subtract(sensor).manhattanLength();
			const distanceToRow = Math.abs(sensor.y - y);
			const extension = distanceToBeacon - distanceToRow;
			if (extension < 0) continue;

			const newRange = new Range(sensor.x - extension, sensor.x + extension);
			if (newRange.start < 0) newRange.start = 0;
			if (newRange.end > RANGE) newRange.end = RANGE;

			for (const range of markedRanges) {
				if (newRange.start - 1 <= range.end && newRange.end + 1 >= range.start) {
					// Merge ranges
					markedRanges.delete(range);
					if (range.start < newRange.start) newRange.start = range.start;
					if (range.end > newRange.end) newRange.end = range.end;
				}
			}

			markedRanges.add(newRange);
		}

		let totalRangeSize = 0;
		for (const { start, end } of markedRanges) {
			totalRangeSize += end - start + 1;
		}

		if (totalRangeSize < RANGE + 1) {
			const rangesArray = [...markedRanges];

			for (let x = 0; x <= RANGE; x++) {
				const contains = rangesArray.find((range) => {
					return x >= range.start && x <= range.end;
				});

				if (contains) {
					x = contains.end;
				} else {
					return x * 4_000_000 + y;
				}
			}
		}
	}

	throw new Error('solution not found');
};
