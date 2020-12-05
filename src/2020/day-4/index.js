const input = require(`./${process.argv[2] || 'input.json'}`);

// Part 1
// Map passports
const passports = input.reduce((acc, line) => {
	if (line === '') {
		return [...acc, {}];
	} else {
		const pairs = line.split(' ').reduce((acc, pair) => {
			const [type, value] = pair.split(':');
			return { ...acc, [type]: value };
		}, {});
		return [
			...acc.slice(0, acc.length - 1),
			{ ...acc[acc.length - 1], ...pairs },
		];
	}
}, []);

const required = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
const valid = passports.filter(fields =>
	required.every(field => Object.keys(fields).includes(field))
).length;

console.log('Part 1:', valid);

const rules = {
	byr(str) {
		const num = parseInt(str);
		return num >= 1920 && num <= 2002;
	},
	iyr(str) {
		const num = parseInt(str);
		return num >= 2010 && num <= 2020;
	},
	eyr(str) {
		const num = parseInt(str);
		return num >= 2020 && num <= 2030;
	},
	hgt(str) {
		const ext = str.substr(str.length - 2);
		const num = parseInt(str.substr(0, str.length - 2));
		if (ext !== 'cm' && ext !== 'in') {
			console.log(`Original number: |${str}|`);
			console.log(`invalid ext: |${ext}|`);
		}
		if (ext !== 'cm' && ext !== 'in') return false;
		return ext === 'cm' ? num >= 150 && num <= 193 : num >= 59 && num <= 76;
	},
	hcl: str => /^#[a-f0-9]{6}$/.test(str),
	ecl: str => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(str),
	pid: str => /^[0-9]{9}$/.test(str),
};

// Part 2
const newValid = passports.filter(fields => {
	const keys = Object.keys(fields);

	return (
		required.every(field => keys.includes(field)) &&
		keys.every(field => {
			if (!rules[field]) return true;
			const result = rules[field](fields[field]);

			if (!result) {
				console.log(`|${field}:${fields[field]}|`);
				console.log('result', result);
			}
			return result;
		})
	);
}).length;

console.log('Part 2:', newValid);
