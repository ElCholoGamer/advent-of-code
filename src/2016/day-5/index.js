const md5 = require('md5');
const chalk = require('chalk');
const [input] = require('./input.json');

const cinematic = process.argv.includes('--cinematic');

// Part 1
if (!cinematic) {
	let password = '';
	let count = 0;

	for (let i = 0; i < 8; i++) {
		let hash;

		while (!(hash = md5(input + (count += 1))).startsWith('00000')) {}
		password += hash[5];
	}

	console.log('Part 1:', password);
}

// Part 2
count = 0;
password = '-'.repeat(8);
if (cinematic) console.clear();

while (password.indexOf('-') !== -1) {
	let hash;
	while (!(hash = md5(input + (count += 1))).startsWith('00000')) {
		if (cinematic && count % 20000 === 0) {
			const displayPassword = password.replace(/-/g, () =>
				chalk.red(Math.random().toString(16)[4])
			);
			console.clear();
			const line = chalk.green(
				'================================================================='
			);
			console.log(line);
			console.log(
				chalk.green(`||  ${hash}  ||  Password:  ${displayPassword}  ||`)
			);
			console.log(line);
		}
	}

	const index = parseInt(hash[5]);
	if (password[index] !== '-') continue;

	const value = hash[6];
	password = password.substr(0, index) + value + password.substr(index + 1);
}

if (cinematic) {
	console.clear();

	function print() {
		console.log(chalk.green('================================'));
		console.log(chalk.green('||                            ||'));
		console.log(
			chalk.green(`||    ${chalk.bold('Password decrypted')}      ||`)
		);
		console.log(chalk.green('||                            ||'));
		console.log(chalk.green('================================'));

		setTimeout(() => console.clear(), 500);
	}
	print();

	setInterval(() => {
		print();
	}, 1000);

	setTimeout(() => {
		console.clear();

		console.log(chalk.green('=========================='));
		console.log(chalk.green(`||  Password: ${password}  ||`));
		console.log(chalk.green('=========================='));
		process.exit(0);
	}, 5000);
} else {
	console.log('Part 2:', password);
}
