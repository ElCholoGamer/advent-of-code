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

export type AoCPart<T extends {} = {}> = (
	input: string[],
	options: T
) => (string | number) | Promise<string | number>;

export type Tuple<T, N extends number> = N extends N
	? number extends N
		? T[]
		: _TupleOf<T, N, []>
	: never;

type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
	? R
	: _TupleOf<T, N, [T, ...R]>;
