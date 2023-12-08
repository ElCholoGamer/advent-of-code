import { AoCPart } from '../../types';

function parseInput(input: string[]): [rules: string[], messages: string[]] {
	const separation = input.indexOf('');
	if (separation === -1)
		throw new Error('Could not separate rules from messages');

	const ruleStrings = input.slice(0, separation);
	const messages = input.slice(separation + 1);
	const rules = ruleStrings.reduce<string[]>((acc, ruleStr) => {
		const [indexStr, rule] = ruleStr.split(': ');
		acc[Number(indexStr)] = rule;

		return acc;
	}, []);

	return [rules, messages];
}

export const part1: AoCPart = (input) => {
	const [rules, messages] = parseInput(input);

	function composeRegex(ruleIndex: number): string {
		const rule = rules[ruleIndex];

		if (rule.match(/^".*"$/)) {
			return rule.substr(1, rule.length - 2);
		}

		const sections = rule.split(' | ').map((section) => {
			const subRules = section.split(/\s+/).map(Number);
			return subRules.map(composeRegex).join('');
		});

		return '(' + sections.join('|') + ')';
	}

	const regex = new RegExp('^' + composeRegex(0) + '$');
	const validMessages = messages.filter((m) => regex.test(m));

	return validMessages.length;
};

export const part2: AoCPart = (input) => {
	const [rules, messages] = parseInput(input);
	const longestLength = Math.max(...messages.map((m) => m.length));

	rules[8] = '42 | 42 8';
	rules[11] = '42 31 | 42 11 31';

	function composeRegex(ruleIndex: number): string {
		const rule = rules[ruleIndex];

		if (rule.match(/^".*"$/)) {
			return rule.substr(1, rule.length - 2);
		}

		const options = rule.split(' | ');

		if (ruleIndex === 8) {
			const recursiveRule = Number(options[0]);
			return `(${composeRegex(recursiveRule)}+)`;
		}

		if (ruleIndex === 11) {
			const [recursiveRule1, recursiveRule2] = options[0]
				.split(' ')
				.map(Number);
			const regex1 = composeRegex(recursiveRule1);
			const regex2 = composeRegex(recursiveRule2);

			let bruteForce: string[] = [];
			for (let i = 1; i < longestLength; i++) {
				bruteForce.push(`(${regex1}{${i}}${regex2}{${i}})`);
			}

			return `(${bruteForce.join('|')})`;
		}

		const optionRegexes = options.map((section) => {
			const subRules = section.split(/\s+/).map(Number);
			return subRules.map(composeRegex).join('');
		});

		return '(' + optionRegexes.join('|') + ')';
	}

	const regex = new RegExp('^' + composeRegex(0) + '$');
	const validMessages = messages.filter((m) => regex.test(m));

	return validMessages.length;
};
