import fs from 'fs';
import path from 'path';

export interface TestCase {
	input: string | string[];
	result: string | number;
	options?: Record<string, unknown>;
}

interface IndexedTestCases {
	tests: TestCase[];
	index: number;
}

const casesDir = path.join(__dirname, 'cases');

const allYearTests: Record<string, string[]> = {};
const years = fs.readdirSync(casesDir);

for (const year of years) {
	const testFiles = fs.readdirSync(path.join(casesDir, year));

	if (testFiles.length > 0) {
		allYearTests[year] = testFiles.map((file) => file.replace(/\.json$/i, ''));
	}
}

function validateTests(tests: unknown): tests is TestCase[] {
	if (!Array.isArray(tests)) return false;

	return tests.every(
		({ input, result, options = {} }) =>
			(typeof input === 'string' || Array.isArray(input)) &&
			(typeof result === 'number' || typeof result === 'string') &&
			typeof options === 'object',
	);
}

const runTestCase = (() => {
	const modules: Record<string, any> = {};

	return async (test: TestCase, path: string, funcName: string) => {
		modules[path] ||= await import(path);
		const mod = modules[path];

		if (!mod[funcName]) return fail(`Could not find ${funcName} function`);

		const inputArr = typeof test.input === 'string' ? [test.input] : test.input;
		return await mod[funcName](inputArr, test.options || {});
	};
})();

describe.each(Object.keys(allYearTests))('year %i', (year: string) => {
	describe.each(allYearTests[year])('day %i', (day: string) => {
		const modPath = path.resolve(`src/days/${year}/${day}`);

		const json = fs
			.readFileSync(path.resolve(casesDir, year, day + '.json'))
			.toString();
		const testData = JSON.parse(json);

		const parts = [testData.part1, testData.part2]
			.filter((tests) => tests?.length)
			.map((tests, i) => ({ tests, index: i + 1 }));

		for (const part of parts) {
			if (!validateTests(part.tests)) {
				throw new Error(
					`Validation fail for part ${part.index} tests (${day}-${year})`,
				);
			}
		}

		describe.each(parts)(
			'part $index',
			({ tests, index }: IndexedTestCases) => {
				const indexedTests = tests.map((test, i) => ({ test, index: i + 1 }));

				it.each(indexedTests)(`case $index`, async ({ test }) => {
					const result = await runTestCase(test, modPath, `part${index}`);
					expect(result).toBe(test.result);
				});
			},
		);
	});
});
