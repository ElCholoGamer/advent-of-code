import { mat4, vec3 } from 'gl-matrix';
import { AoCPart } from '../../types';
import { PI_OVER_2 } from '../../utils';
import { Vector3 } from '../../utils/vector';

function parseScanners(input: string[]): Scanner[] {
	const reports: Vector3[][] = [[]];
	for (let i = 1; i < input.length; i++) {
		const line = input[i];

		if (line === '') {
			reports.push([]);
			i++;
			continue;
		}

		reports[reports.length - 1].push(Vector3.fromArray(line.split(',').map(Number)));
	}

	return reports.map(report => new Scanner(report));
}

interface CoordinateWithDifferences {
	value: Vector3;
	diffs: Vector3[];
}

class Scanner {
	public position: Vector3 | null = null;

	public beaconPermutations: CoordinateWithDifferences[][] = [];
	public finalBeaconPermutation: CoordinateWithDifferences[] | null = null;

	public constructor(relativeBeacons: Vector3[]) {
		// Compute all 24 permutations of the coordinate list
		for (let face = 0; face < 6; face++) {
			const faceMatrix =
				face < 4
					? mat4.fromZRotation(mat4.create(), face * PI_OVER_2)
					: mat4.fromYRotation(mat4.create(), PI_OVER_2 * (face === 4 ? 1 : -1));

			for (let rotation = 0; rotation < 4; rotation++) {
				const rotationMatrix = mat4.rotateX(mat4.create(), faceMatrix, rotation * PI_OVER_2);
				const permutation: Vector3[] = [];

				for (const beacon of relativeBeacons) {
					const vec = vec3.fromValues(beacon.x, beacon.y, beacon.z);
					vec3.transformMat4(vec, vec, rotationMatrix);

					permutation.push(Vector3.fromArray([...vec]));
				}

				this.beaconPermutations.push(
					permutation.map(coord => {
						const everyOtherCoordinate = permutation.filter(other => other !== coord);
						const diffs = everyOtherCoordinate.map(other => other.clone().subtract(coord));

						return { value: coord, diffs };
					})
				);
			}
		}
	}
}

interface Options {
	minOverlaps: 12;
}

function inferScannerPositions(scanners: Scanner[], minOverlaps: number) {
	scanners[0].position = new Vector3(0, 0, 0);
	scanners[0].finalBeaconPermutation = scanners[0].beaconPermutations[0];

	while (true) {
		const unknownScanners = scanners.filter(scanner => !scanner.position);
		if (unknownScanners.length === 0) break;

		const knownScanners = scanners.filter(scanner => !unknownScanners.includes(scanner));

		for (const unknownScanner of unknownScanners) {
			main: for (const knownScanner of knownScanners) {
				if (!knownScanner.position || !knownScanner.finalBeaconPermutation) {
					throw new Error('how');
				}

				for (const permutation of unknownScanner.beaconPermutations) {
					let overlappingBeacons: { fromBase: Vector3; fromUnknown: Vector3 }[] = [];

					for (const baseBeacon of knownScanner.finalBeaconPermutation) {
						for (const beacon of permutation) {
							const overlappingDiffs = baseBeacon.diffs.filter(diff =>
								beacon.diffs.some(otherDiff => otherDiff.equals(diff))
							);

							if (overlappingDiffs.length >= minOverlaps - 1) {
								overlappingBeacons.push({
									fromBase: baseBeacon.value,
									fromUnknown: beacon.value,
								});
							}
						}
					}

					if (overlappingBeacons.length < minOverlaps) continue;

					unknownScanner.finalBeaconPermutation = permutation;

					const refBeacon = overlappingBeacons[0];
					unknownScanner.position = knownScanner.position
						.clone()
						.add(refBeacon.fromBase)
						.subtract(refBeacon.fromUnknown);

					knownScanners.push(unknownScanner);
					break main;
				}
			}
		}
	}

	return scanners;
}

let cachedScannersFromPart1: Scanner[] | null = null;

export const part1: AoCPart<Options> = (input, { minOverlaps = 12 }) => {
	const scanners = parseScanners(input);
	inferScannerPositions(scanners, minOverlaps);

	cachedScannersFromPart1 = scanners;

	const beacons = new Set<string>();

	for (const scanner of scanners) {
		if (!scanner.position || !scanner.finalBeaconPermutation) continue;

		for (const relativeBeacon of scanner.finalBeaconPermutation) {
			const absPosition = scanner.position.clone().add(relativeBeacon.value);
			beacons.add(absPosition.toArray().join(','));
		}
	}

	return beacons.size;
};

export const part2: AoCPart<Options> = (input, { minOverlaps = 12 }) => {
	const scanners =
		cachedScannersFromPart1 || inferScannerPositions(parseScanners(input), minOverlaps);

	let maxDistance = 0;

	for (const { position: p1 } of scanners) {
		for (const { position: p2 } of scanners) {
			if (!p1 || !p2) throw new Error('A scanner is missing its position');
			if (p1 === p2) continue;

			const distance = p2.clone().subtract(p1).manhattanLength();
			if (distance > maxDistance) maxDistance = distance;
		}
	}

	return maxDistance;
};
