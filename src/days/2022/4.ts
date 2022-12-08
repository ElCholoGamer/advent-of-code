import { AoCPart } from '../../types';
import { count } from '../../utils/arrays';

interface Range {
	start: number;
	end: number;
}

function parseAssignmentPair(str: string): [Range, Range] {
	return str.split(',').map(rangeStr => {
		const [start, end] = rangeStr.split('-').map(Number);
		return { start, end };
	}) as [Range, Range];
}

export const part1: AoCPart = input => {
	return count(
		input.map(parseAssignmentPair),
		([a, b]) => (a.start <= b.start && a.end >= b.end) || (b.start <= a.start && b.end >= a.end)
	);
};

export const part2: AoCPart = input => {
	return count(input.map(parseAssignmentPair), ([a, b]) => a.start <= b.end && a.end >= b.start);
};
