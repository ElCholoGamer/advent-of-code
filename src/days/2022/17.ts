import { AoCPart } from '../../types';
import { sleep } from '../../utils';
import { ExtendableGrid } from '../../utils/structures/extendable-grid';
import { Vector2 } from '../../utils/structures/vector';

const enum TileState {
	EMPTY,
	OCCUPIED,
}

// prettier-ignore
const rocks = [
  [
    new Vector2(0,  0), 
    new Vector2(1,  0), 
    new Vector2(2,  0), 
    new Vector2(3,  0)
  ],
  [
    new Vector2(1,  0),
    new Vector2(1, -1),
    new Vector2(1, -2),
    new Vector2(0, -1),
    new Vector2(2, -1),
  ],
  [
    new Vector2(0, -2),
    new Vector2(1, -2),
    new Vector2(2, -2),
    new Vector2(2, -1),
    new Vector2(2,  0),
  ],
  [
    new Vector2(0,  0),
    new Vector2(0, -1),
    new Vector2(0, -2),
    new Vector2(0, -3),
  ],
  [
    new Vector2(0,  0),
    new Vector2(1,  0),
    new Vector2(0, -1),
    new Vector2(1, -1),
  ]
].map(tilePositions => ({
  tilePositions,
  width: Math.max(...tilePositions.map(r => r.x)) + 1,
  height: Math.abs(Math.min(...tilePositions.map(r => r.y))) + 1,
}));

const SPACE_WIDTH = 7;

async function simulateTetris(
	jets: string,
	pieceCount: number,
): Promise<number> {
	const lastFloorOccurrences: Record<
		string,
		{ pieces: number; towerHeight: number }
	> = {};
	const grid = new ExtendableGrid(TileState.EMPTY);
	let rockIndex = 0;
	let jetIndex = 0;
	let skippedHeight = 0;
	let towerHeight = 0;

	for (let p = 0; p < pieceCount; p++) {
		const rock = rocks[rockIndex];

		rockIndex = (rockIndex + 1) % rocks.length;

		const rockPos = new Vector2(2, towerHeight + rock.height + 2);

		while (true) {
			if (jets[jetIndex] === '<') {
				if (
					rockPos.x > 0 &&
					rock.tilePositions.every(
						(tilePos) =>
							grid.get(rockPos.x + tilePos.x - 1, rockPos.y + tilePos.y) ===
							TileState.EMPTY,
					)
				)
					rockPos.x--;
			} else {
				if (
					rockPos.x + rock.width < SPACE_WIDTH &&
					rock.tilePositions.every(
						(tilePos) =>
							grid.get(rockPos.x + tilePos.x + 1, rockPos.y + tilePos.y) ===
							TileState.EMPTY,
					)
				)
					rockPos.x++;
			}
			jetIndex = (jetIndex + 1) % jets.length;

			const absTilePositions = rock.tilePositions.map((tilePos) =>
				rockPos.clone().add(tilePos),
			);

			if (
				absTilePositions.some(
					(tilePos) =>
						tilePos.y <= 0 ||
						grid.get(tilePos.x, tilePos.y - 1) === TileState.OCCUPIED,
				)
			) {
				for (const { x, y } of absTilePositions) {
					grid.set(x, y, TileState.OCCUPIED);
				}

				towerHeight = Math.max(towerHeight, rockPos.y + 1);
				break;
			} else {
				rockPos.y--;
			}
		}

		if (
			[...Array(SPACE_WIDTH)].every(
				(_, x) => grid.get(x, towerHeight - 1) === TileState.OCCUPIED,
			)
		) {
			const key = `${rockIndex}-${jetIndex}`;

			if (!(key in lastFloorOccurrences)) {
				lastFloorOccurrences[key] = { pieces: p, towerHeight };
			} else {
				const { pieces: startPieceCount, towerHeight: startHeight } =
					lastFloorOccurrences[key];

				const piecesPerSkip = p - startPieceCount;
				const heightPerSkip = towerHeight - startHeight;

				const skipFactor =
					Math.floor((pieceCount - startPieceCount) / piecesPerSkip) - 1;
				skippedHeight = skipFactor * heightPerSkip;
				p += skipFactor * piecesPerSkip;
			}
		}
	}

	return towerHeight + skippedHeight;
}

export const part1: AoCPart = async ([input]) => simulateTetris(input, 2022);

export const part2: AoCPart = async ([input]) =>
	simulateTetris(input, 1_000_000_000_000);
