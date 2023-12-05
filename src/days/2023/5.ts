import { AoCPart } from '../../types';
import { chunks, enumerate } from '../../utils/arrays';
import { clamp } from '../../utils/math';

interface Map {
	sourceStart: number;
	destinationStart: number;
	length: number;
}

const isDigit = (char: string) => !Number.isNaN(Number(char));

function parseInput(input: string[]) {
	const [seedSection, , ...mapSection] = input;
	const seeds = seedSection.split(': ')[1].split(' ').map(Number);

	const steps: Map[][] = [];

	for (const line of mapSection) {
		if (line === '') continue;
		if (!isDigit(line[0])) {
			steps.push([]);
			continue;
		}

		const [to, src, len] = line.split(' ').map(Number);

		steps[steps.length - 1].push({
			sourceStart: src,
			destinationStart: to,
			length: len,
		});
	}

	return {
		seeds,
		steps,
	};
}

function mapSeed(seed: number, steps: Map[][]) {
	let num = seed;

	for (const step of steps) {
		for (const map of step) {
			const diff = num - map.sourceStart;
			if (diff >= 0 && diff < map.length) {
				num = map.destinationStart + diff;
				break;
			}
		}
	}

	return num;
}

export const part1: AoCPart = (input) => {
	const { seeds, steps } = parseInput(input);

	return Math.min(...seeds.map((seed) => mapSeed(seed, steps)));
};

interface SeedRange {
	start: number;
	length: number;
}

const rangesIntersect = (a: SeedRange, b: SeedRange) =>
	a.start < b.start + b.length && a.start + a.length > b.start;

export const part2: AoCPart = (input) => {
	const { seeds, steps } = parseInput(input);
	let seedRanges: SeedRange[] = chunks(seeds, 2).map(([start, length]) => ({
		start,
		length,
	}));

	for (const step of steps) {
		const newSeedRanges: SeedRange[] = [];
		for (const map of step) {
			const intersections = seedRanges.filter((seedRange) =>
				rangesIntersect(
					{
						start: map.sourceStart,
						length: map.length,
					},
					seedRange
				)
			);

			// Remove intersecting ranges to be replaced by remnants
			seedRanges = seedRanges.filter((range) => !intersections.includes(range));

			for (const seedRange of intersections) {
				const startOffset = clamp(map.sourceStart - seedRange.start, 0, seedRange.length);
				const endOffset = clamp(
					map.sourceStart + map.length - seedRange.start,
					0,
					seedRange.length
				);

				if (startOffset > 0) {
					seedRanges.push({
						start: seedRange.start,
						length: startOffset,
					});
				}

				if (seedRange.length - endOffset > 0) {
					seedRanges.push({
						start: seedRange.start + endOffset,
						length: seedRange.length - endOffset,
					});
				}

				newSeedRanges.push({
					start:
						map.sourceStart >= seedRange.start
							? map.destinationStart
							: map.destinationStart + seedRange.start - map.sourceStart,
					length: endOffset - startOffset,
				});
			}
		}

		seedRanges.push(...newSeedRanges);
	}

	return Math.min(...seedRanges.map((range) => range.start));
};
