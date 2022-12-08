import { AoCPart } from '../../types';
import { windows } from '../../utils/arrays';

function findMarker(str: string, markerLength: number) {
	return (
		windows(str.split(''), markerLength).findIndex(seq => new Set(seq).size === seq.length) +
		markerLength
	);
}

export const part1: AoCPart = ([input]) => findMarker(input, 4);

export const part2: AoCPart = ([input]) => findMarker(input, 14);
