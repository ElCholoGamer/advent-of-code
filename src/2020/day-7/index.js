const input = require('./input.json');

// Part 1
const bags = {};

input.forEach(line => {
	const [bag, rest] = line.split(' bags contain ');
	if (!bags[bag]) bags[bag] = {};

	if (rest === 'no other bags.') return;

	const bagsInside = rest.split(', ');

	bagsInside.forEach(bagInside => {
		const [numStr, name] = bagInside
			.replace(/ bag(s)?(\.$)?/, '')
			.split(/ (.+)/);
		const num = parseInt(numStr);

		bags[bag][name] = num;
	});
});

const containShiny = Object.keys(bags).reduce(
	(acc, key) => acc + checkBag(key),
	0
);

function checkBag(bagName) {
	if (!bags[bagName]) return false;

	// Recursion is really cool ngl
	return Object.keys(bags[bagName]).some(
		bag => bag === 'shiny gold' || checkBag(bag)
	);
}

console.log('Part 1:', containShiny);

// Part 2
function getBagsInside(bagName) {
	if (!bags[bagName]) return 0;

	return Object.keys(bags[bagName]).reduce((acc, key) => {
		const amount = bags[bagName][key];
		return acc + amount + getBagsInside(key) * amount;
	}, 0);
}

const bagsInShinyGold = getBagsInside('shiny gold');
console.log('Part 2:', bagsInShinyGold);
