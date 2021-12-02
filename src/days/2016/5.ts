import chalk from 'chalk';
import md5 from 'md5';
import { AoCPart } from '../../types';
import { sleep } from '../../utils';

export const part1: AoCPart = ([input]) => {
	// Part 1
	let password = '';
	let count = 0;

	for (let i = 0; i < 8; i++) {
		let hash;

		do {
			hash = md5(input + count.toString());
			count++;
		} while (!hash.startsWith('00000'));

		password += hash[5];
	}

	return password;
};

export const part2: AoCPart = async ([input]) => {
	input = input.trim();
	console.clear();

	let password = '-'.repeat(8);
	let count = 0;
	let displayTimer = 0;

	while (password.indexOf('-') !== -1) {
		let hash;

		do {
			hash = md5(input + count.toString());
			count++;
			displayTimer--;

			if (displayTimer <= 0) {
				displayTimer = 15000;

				const displayPassword = password.replace(/-/g, () =>
					chalk.red(Math.random().toString(16)[4])
				);
				const line = chalk.green(
					'================================================================='
				);
				console.clear();
				console.log(line);
				console.log(chalk.green(`||  ${hash}  ||  Password:  ${displayPassword}  ||`));
				console.log(line);
			}
		} while (!hash.startsWith('00000'));

		const index = Number(hash[5]);
		if (password[index] !== '-') continue;

		const value = hash[6];
		password = password.substr(0, index) + value + password.substr(index + 1);
	}

	console.clear();

	function successScreen() {
		console.log(chalk.green('================================'));
		console.log(chalk.green('||                            ||'));
		console.log(chalk.green(`||    ${chalk.bold('Password decrypted')}      ||`));
		console.log(chalk.green('||                            ||'));
		console.log(chalk.green('================================'));

		setTimeout(() => console.clear(), 500);
	}

	for (let i = 0; i < 5; i++) {
		successScreen();
		await sleep(500);
		console.clear();
		await sleep(500);
	}

	console.log(chalk.green('=========================='));
	console.log(chalk.green(`||  Password: ${password}  ||`));
	console.log(chalk.green('=========================='));
	await sleep(3000);

	return password;
};
