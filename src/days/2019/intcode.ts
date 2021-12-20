interface IntcodeProgram {
	pointer: number;
	body: number[];
	inputs: number[];
	outputs: number[];
}

export const enum OpCode {
	ADD = 1,
	MULTIPLY,
	INPUT,
	OUTPUT,
	JUMP_IF_TRUE,
	JUMP_IF_FALSE,
	LESS_THAN,
	EQUALS,
	EXIT = 99,
}

interface OpCodeInfo {
	args: number;
	run(program: IntcodeProgram, args: Parameter[]): void;
}

interface Parameter {
	mode: ParameterMode;
	get(): number;
	set(value: number): void;
}

const opcodeInfo: Record<OpCode, OpCodeInfo> = {
	[OpCode.EXIT]: {
		args: 0,
		run(program) {
			program.pointer = program.body.length;
		},
	},
	[OpCode.ADD]: {
		args: 3,
		run(program, [left, right, target]) {
			target.set(left.get() + right.get());
		},
	},
	[OpCode.MULTIPLY]: {
		args: 3,
		run(program, [left, right, target]) {
			target.set(left.get() * right.get());
		},
	},
	[OpCode.INPUT]: {
		args: 1,
		run(program, [target]) {
			if (!program.inputs.length) throw new Error('Could not find an input');

			const input = program.inputs.shift()!;
			target.set(input);
		},
	},
	[OpCode.OUTPUT]: {
		args: 1,
		run(program, [value]) {
			program.outputs.push(value.get());
		},
	},
	[OpCode.JUMP_IF_TRUE]: {
		args: 2,
		run(program, [condition, target]) {
			if (condition.get() !== 0) {
				program.pointer = target.get();
			}
		},
	},
	[OpCode.JUMP_IF_FALSE]: {
		args: 2,
		run(program, [condition, target]) {
			if (condition.get() === 0) {
				program.pointer = target.get();
			}
		},
	},
	[OpCode.LESS_THAN]: {
		args: 3,
		run(program, [left, right, target]) {
			target.set(+(left.get() < right.get()));
		},
	},
	[OpCode.EQUALS]: {
		args: 3,
		run(program, [left, right, target]) {
			target.set(+(left.get() === right.get()));
		},
	},
};

export const enum ParameterMode {
	POSITION,
	INMEDIATE,
}

function makeParameter(value: number, mode: ParameterMode, program: IntcodeProgram): Parameter {
	return {
		mode,
		get() {
			if (mode === ParameterMode.INMEDIATE) return value;
			return program.body[value] || 0;
		},
		set(newValue) {
			if (mode === ParameterMode.INMEDIATE)
				throw new Error('Cannot set a parameter in inmediate mode');

			program.body[value] = newValue;
		},
	};
}

export function runProgram(body: number[], inputs: number[] = []): IntcodeProgram {
	const program: IntcodeProgram = { pointer: 0, body, inputs, outputs: [] };

	while (program.pointer < program.body.length) {
		const opData = program.body[program.pointer].toString().padStart(2, '0');
		const op = Number(opData.substring(opData.length - 2));

		const action = opcodeInfo[op as OpCode];
		if (!action) throw new Error('Invalid opcode: ' + op);

		const argInts = program.body.slice(program.pointer + 1, program.pointer + 1 + action.args);

		const paramData = opData.substring(0, opData.length - 2);
		const paramModes = paramData.split('').map(Number).reverse();

		const params: Parameter[] = argInts.map((int, index) =>
			makeParameter(int, paramModes[index] || ParameterMode.POSITION, program)
		);

		const prevPointer = program.pointer;
		action.run(program, params);

		if (program.pointer === prevPointer) {
			program.pointer += 1 + action.args;
		}
	}

	return program;
}

export const parseProgramBody = (data: string) => data.split(',').map(str => parseInt(str));
