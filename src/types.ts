export type ValidationResult = true | string;

export type Awaitable<T> = T | Promise<T>;

export type Command<F extends Record<string, string | number | boolean> = {}> =
	{
		name: string;
		description: string;
		arguments?: {
			name: string;
			required?: boolean;
			transform?: (value: string) => string;
			validate?: (
				value: string,
			) => ValidationResult | Promise<ValidationResult>;
		}[];
		flags?: {
			[K in keyof F]: Flag<F[K]>;
		};
		run(
			args: string[],
			flags: {
				[K in keyof F]: F[K];
			},
		): Awaitable<void>;
	};

export type Flag<T extends string | number | boolean> = {
	description: string;
	short?: string;
	required?: boolean;
	type: T extends string ? 'String' : T extends number ? 'Number' : 'Boolean';
	transform?: (value: T) => T;
	validate?: (value: T) => Awaitable<ValidationResult>;
};

export type AoCPart<O extends {} = {}> = (
	input: string[],
	options: Partial<O>,
) => Awaitable<string | number>;

export type Visualization = (input: string[]) => Awaitable<void>;

export type Tuple<T, N extends number> = N extends N
	? number extends N
		? T[]
		: _TupleOf<T, N, []>
	: never;

type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
	? R
	: _TupleOf<T, N, [T, ...R]>;
