import chalk from 'chalk';
import { Command, Flag } from '../types';
import { getAllCommands } from '../utils';

const helpCommand: Command = {
	name: 'help',
	description: 'Shows a list of commands',
	arguments: [
		{
			name: 'command',
			required: false,
			transform: (v) => v.toLowerCase(),
			validate: async (value) =>
				Object.keys(await getAllCommands()).includes(value) ||
				'Invalid command selected',
		},
	],
	async run(args) {
		const commands = await getAllCommands();

		if (args.length === 0) {
			console.log(chalk.bold.blue('Commands:'));
			for (const name in commands) {
				console.log(
					chalk.yellow(chalk.bold(name + ': ') + commands[name].description),
				);
			}
		} else {
			const selectedCommand = commands[args[0]];

			const { description, arguments: subArgs = [] } = selectedCommand;
			const flags = <Record<string, Flag<any>>>(selectedCommand.flags || {});

			const names = subArgs.map((a) =>
				a.required ? `[${a.name}]` : `(${a.name})`,
			);
			console.log(
				chalk.blue`${chalk.bold('Command:')} ${args[0]} ${names.join(' ')}`,
			);
			console.log(chalk.yellow(description));

			const flagNames = Object.keys(flags);
			if (flagNames.length > 0) {
				console.log(chalk.bold.magenta('Flags:'));

				for (const name of flagNames) {
					const { description, type, short } = flags[name];
					let prefix = ' --' + name;
					if (short) prefix += ` (-${short})`;

					console.log(chalk.magenta(`${prefix}: ${type} - ${description}`));
				}
			}
		}
	},
};

export default helpCommand;
