export type OpCodeAction = (...args: OpcodeParam[]) => void;

export const enum ParameterMode {
	POSITION,
	INMEDIATE,
	RELATIVE,
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
	RELATIVE_BASE_OFFSET,
	EXIT = 99,
}

export interface OpcodeParam {
	mode: ParameterMode;
	get(): number;
	set(value: number): void;
}

export class IntcodeProgram {
	public pointer = 0;
	public readonly body: number[];

	private relativeBase = 0;
	private readonly inputs: number[] = [];
	private output: number | undefined = undefined;

	private readonly opcodeActions: Record<OpCode, OpCodeAction> = {
		[OpCode.EXIT]: () => {
			this.pointer = this.body.length;
		},
		[OpCode.ADD]: (left, right, target) => {
			target.set(left.get() + right.get());
		},
		[OpCode.MULTIPLY]: (left, right, target) => {
			target.set(left.get() * right.get());
		},
		[OpCode.INPUT]: target => {
			if (!this.inputs.length) throw new Error('Could not find input');

			const input = this.inputs.shift()!;
			target.set(input);
		},
		[OpCode.OUTPUT]: value => {
			this.output = value.get();
		},
		[OpCode.JUMP_IF_TRUE]: (condition, target) => {
			if (condition.get() !== 0) {
				this.pointer = target.get();
			}
		},
		[OpCode.JUMP_IF_FALSE]: (condition, target) => {
			if (condition.get() === 0) {
				this.pointer = target.get();
			}
		},
		[OpCode.LESS_THAN]: (left, right, target) => {
			target.set(+(left.get() < right.get()));
		},
		[OpCode.EQUALS]: (left, right, target) => {
			target.set(+(left.get() === right.get()));
		},
		[OpCode.RELATIVE_BASE_OFFSET]: value => {
			this.relativeBase += value.get();
		},
	};

	public constructor(bodyData: string) {
		this.body = bodyData.split(',').map(str => parseInt(str));
		if (this.body.some(isNaN)) throw new Error('Could not parse Intcode program body');
	}

	private runCurrentAction() {
		const opData = this.body[this.pointer].toString().padStart(2, '0');
		const op = Number(opData.substring(opData.length - 2));

		const action = this.opcodeActions[op as OpCode];
		if (!action) throw new Error(`Invalid opcode at index ${this.pointer}: ${op}`);

		const argInts = this.body.slice(this.pointer + 1, this.pointer + 1 + action.length);

		const paramData = opData.substring(0, opData.length - 2);
		const paramModes = paramData.split('').map(Number).reverse();

		const params: OpcodeParam[] = argInts.map((value, index) =>
			this.makeParameter(value, paramModes[index] || ParameterMode.POSITION)
		);

		const prevPointer = this.pointer;
		action(...params);

		if (this.pointer === prevPointer) {
			this.pointer += 1 + action.length;
		}
	}

	public input(...inputs: number[]) {
		this.inputs.push(...inputs);
	}

	public nextOutput(): number | undefined {
		if (this.pointer >= this.body.length) {
			throw new Error('Program has already ended');
		}

		this.output = undefined;

		while (this.output === undefined && this.pointer < this.body.length) {
			this.runCurrentAction();
		}

		return this.output;
	}

	public remainingOutputs(): number[] {
		const outputs: number[] = [];

		let output: number | undefined;
		while ((output = this.nextOutput()) !== undefined) {
			outputs.push(output);
		}

		return outputs;
	}

	private makeParameter(value: number, mode: ParameterMode): OpcodeParam {
		return {
			mode,
			get: () => {
				if (mode === ParameterMode.INMEDIATE) return value;

				let address = value;
				if (mode === ParameterMode.RELATIVE) {
					address += this.relativeBase;
				}

				if (address < 0) throw new Error('Cannot access an address less than zero');

				return this.body[address] || 0;
			},
			set: newValue => {
				if (mode === ParameterMode.INMEDIATE)
					throw new Error('Cannot set a parameter in inmediate mode');

				let address = value;
				if (mode === ParameterMode.RELATIVE) {
					address += this.relativeBase;
				}

				if (address < 0) throw new Error('Cannot access an address less than zero');

				this.body[address] = newValue;
			},
		};
	}
}
