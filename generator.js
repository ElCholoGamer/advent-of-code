/**
 * This generates the files for each year.
 */

const { existsSync, mkdirSync, writeFileSync } = require('fs');
const { join, resolve } = require('path');
const { EOL } = require('os');

for (let year = 2015; year <= 2020; year++) {
	if (!existsSync(year.toString())) mkdirSync(year.toString());

	for (let day = 1; day <= 25; day++) {
		const folder = resolve(__dirname, year.toString(), `day-${day}`);

		if (!existsSync(folder)) mkdirSync(folder);

		const file = join(folder, 'index.js');
		if (!existsSync(file)) {
			writeFileSync(file, "const input = require('./input.json');" + EOL);
		}

		const input = join(folder, 'input.json');
		if (!existsSync(input)) writeFileSync(input, '[]' + EOL);
	}
}
