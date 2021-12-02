export type ValidationResult = true | string;

export type Command<F extends Record<string, string | number> = {}> = {
	name: string;
	description: string;
	subArgs?: {
		name: string;
		required?: boolean;
		transform?: (value: string) => string;
		validate?: (value: string) => ValidationResult | Promise<ValidationResult>;
	}[];
	flags?: {
		[K in keyof F]: Flag<F[K]>;
	};
	run(
		args: string[],
		flags: {
			[K in keyof F]: F[K];
		}
	): Promise<void> | void;
};

export type Flag<T extends string | number> = {
	description: string;
	short?: string;
	required?: boolean;
	type: T extends string ? 'String' : 'Number';
	transform?: (value: T) => T;
	validate?: (value: T) => ValidationResult | Promise<ValidationResult>;
};

export type AoCPart = (input: string[]) => (string | number) | Promise<string | number>;
