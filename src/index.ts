import chalk from 'chalk';
import minimist from 'minimist';
import dotenv from 'dotenv';
import { christmasify, getAllCommands } from './utils';

dotenv.config();

async function main(
	commandName: string | undefined,
	args: string[],
	cliFlags: Record<string, string | number>
) {
	console.log(chalk.bold(christmasify('---------------------------------')));
	console.log(chalk.bold(christmasify('||     Advent of Code CLI      ||')));
	console.log(chalk.bold(christmasify('---------------------------------')));

	const commands = await getAllCommands();

	commandName ||= 'help';

	const command = commands[commandName];
	if (!command) {
		console.log(chalk.bold(chalk.red('Invalid command! Use "help" for more.')));
		return;
	}

	const { subArgs = [] } = command;
	const flags = command.flags || {};

	// Validate sub-args
	for (let i = 0; i < subArgs.length; i++) {
		const { name, required = true, transform, validate } = subArgs[i];

		if (!args[i]) {
			if (required) {
				console.error(chalk.bold.red(`Validation error: Missing "${name}" argument`));
				return;
			}
		} else {
			if (transform) args[i] = transform(args[i]);

			if (validate) {
				const result = await validate(args[i]);
				if (typeof result === 'string') {
					console.error(chalk.bold.red('Validation error: ' + result));
					return;
				}
			}
		}
	}

	// Validate flags
	for (const flagName in flags) {
		const { short, type, required, transform, validate } = flags[flagName];
		let value = cliFlags[flagName];

		if (short && value === undefined) {
			value = cliFlags[short];
			if (value !== undefined) {
				delete cliFlags[short];
				cliFlags[flagName] = value;
			}
		}

		if (value === undefined) {
			if (required) {
				let msg = `Validation error: Missing flag "--${flagName}"`;
				if (short) msg += ` (-${short})`;

				console.log(chalk.bold.red(msg));
				return;
			}
		} else {
			if (typeof value !== type.toLowerCase()) {
				console.log(
					chalk.red.bold(`Validation error: Flag --${flagName} must be of type "${type}"`)
				);
				return;
			}

			if (transform) value = cliFlags[flagName] = transform(value);

			if (validate) {
				const result = await validate(value);
				if (typeof result !== 'boolean') {
					console.log(chalk.bold.red('Validation error: ' + result));
					return;
				}
			}
		}
	}

	try {
		await command.run(args, cliFlags);
	} catch (err) {
		console.error(chalk.bold.red('An error occurred running the command:'));
		console.error(err);
	}
}

const {
	_: [command, ...args],
	...flags
} = minimist(process.argv.slice(2));

main(command?.toString().toLowerCase(), args, flags);
