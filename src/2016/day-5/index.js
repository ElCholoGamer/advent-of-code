const md5 = require('md5');
const chalk = require('chalk');
const [input] = require('./input.json');

// Part 1
let password = '';
let count = 0;

for (let i = 0; i < 8; i++) {
	let hash;

	while (!(hash = md5(input + (count += 1))).startsWith('00000')) {}
	password += hash[5];
}

console.log('Part 1:', password);

// Part 2
count = 0;
password = '-'.repeat(8);
const cinematic = process.argv.includes('--cinematic');
if (cinematic) console.clear();

while (password.indexOf('-') !== -1) {
	let hash;
	while (!(hash = md5(input + (count += 1))).startsWith('00000')) {
		if (cinematic && count % 20000 === 0) {
			const displayPassword = password.replace(/-/g, () =>
				chalk.red(Math.random().toString(16)[4])
			);
			console.log(
				chalk.greenBright(`${hash} | | Password: ${displayPassword}`)
			);
		}
	}

	const index = parseInt(hash[5]);
	if (password[index] !== '-') continue;

	const value = hash[6];
	password = password.substr(0, index) + value + password.substr(index + 1);
}

if (cinematic) {
	console.clear();

	const timer = setInterval(() => {
		console.log(chalk.green('================================'));
		console.log(chalk.green('||                            ||'));
		console.log(
			chalk.green(`||    ${chalk.bold('Password decrypted')}      ||`)
		);
		console.log(chalk.green('||                            ||'));
		console.log(chalk.green('================================'));
		setTimeout(() => console.clear(), 500);
	}, 1000);

	setTimeout(() => {
		console.log('========================');
		console.log(chalk.green('Password:', password));
		console.log('========================');
		process.exit(0);
	}, 5000);
} else {
	console.log('Part 2:', password);
}
