import { AoCPart } from '../../types';

const required = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

function makePassports(input: string[]) {
	return input.reduce<{}[]>((acc, line) => {
		if (line === '') {
			return [...acc, {}];
		} else {
			const pairs = line.split(' ').reduce((acc, pair) => {
				const [type, value] = pair.split(':');
				return { ...acc, [type]: value };
			}, {});
			return [...acc.slice(0, acc.length - 1), { ...acc[acc.length - 1], ...pairs }];
		}
	}, []);
}

export const part1: AoCPart = input => {
	const passports = makePassports(input);

	return passports.filter(fields => required.every(field => Object.keys(fields).includes(field)))
		.length;
};

export const part2: AoCPart = input => {
	const rules: Record<string, (value: string) => boolean> = {
		byr(str: string) {
			const num = Number(str);
			return num >= 1920 && num <= 2002;
		},
		iyr(str: string) {
			const num = Number(str);
			return num >= 2010 && num <= 2020;
		},
		eyr(str: string) {
			const num = Number(str);
			return num >= 2020 && num <= 2030;
		},
		hgt(str: string) {
			const ext = str.substr(str.length - 2);
			const num = parseInt(str.substr(0, str.length - 2));
			if (ext !== 'cm' && ext !== 'in') {
				console.log(`Original number: |${str}|`);
				console.log(`invalid ext: |${ext}|`);
			}
			if (ext !== 'cm' && ext !== 'in') return false;
			return ext === 'cm' ? num >= 150 && num <= 193 : num >= 59 && num <= 76;
		},
		hcl: (str: string) => /^#[a-f0-9]{6}$/.test(str),
		ecl: (str: string) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(str),
		pid: (str: string) => /^[0-9]{9}$/.test(str),
	};

	const passports = makePassports(input);

	return passports.filter(fields => {
		const keys = Object.keys(fields);

		return (
			required.every(field => keys.includes(field)) &&
			keys.every(field => {
				const rule = rules[field] || (() => true);
				return rule(fields[<keyof typeof fields>field]);
			})
		);
	}).length;
};
