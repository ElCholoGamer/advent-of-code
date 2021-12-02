import chalk from 'chalk';
import { Command, Flag } from '../types';
import { getAllCommands } from '../utils';

const helpCommand: Command = {
	name: 'help',
	description: 'Shows a list of commands',
	subArgs: [
		{
			name: 'command',
			required: false,
			transform: v => v.toLowerCase(),
			validate: async value =>
				Object.keys(await getAllCommands()).includes(value) || 'Invalid command selected',
		},
	],
	async run(args) {
		const commands = await getAllCommands();

		if (args.length === 0) {
			console.log(chalk.bold.green('Commands:'));
			for (const key in commands) {
				console.log(chalk.blue(chalk.bold(key + ': ') + commands[key].description));
			}
		} else {
			const selectedCommand = commands[args[0]];

			const { description, subArgs = [] } = selectedCommand;
			const flags = <Record<string, Flag<any>>>(selectedCommand.flags || {});

			console.log(chalk.bold(chalk.green('Command: ' + args[0])));
			console.log(chalk.green(description));

			if (subArgs.length > 0) {
				const names = subArgs.map(a => (a.required ? `[${a.name}]` : `(${a.name})`));
				console.log(chalk.blue(chalk.bold('Arguments: ') + names.join(' ')));
			}

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
