export const enum ParameterMode {
	POSITION,
	INMEDIATE,
	RELATIVE,
}

export const enum Opcode {
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

export class IntcodeVM {
	protected readonly memory: number[];
	protected outputs: number[] = [];

	private _inputRequest = false;
	private _halted = false;
	private rb = 0;
	private pc = 0;
	private paramCount = 0;

	public constructor(initialMemory: number[] | string) {
		if (Array.isArray(initialMemory)) {
			this.memory = [...initialMemory];
		} else {
			this.memory = initialMemory.split(',').map((s) => parseInt(s));
			if (this.memory.some(isNaN))
				throw new Error('Could not parse Intcode program body');
		}
	}

	public step() {
		if (this._halted || this._inputRequest) return;

		this.paramCount = 0;

		const instructionAddress = this.pc;
		const instruction = this.readMemory(this.pc++);
		const opcode = instruction % 100;

		switch (opcode) {
			case Opcode.ADD: {
				const a = this.readParam(instruction);
				const b = this.readParam(instruction);
				this.writeParam(instruction, a + b);
				break;
			}
			case Opcode.MULTIPLY: {
				const a = this.readParam(instruction);
				const b = this.readParam(instruction);
				this.writeParam(instruction, a * b);
				break;
			}
			case Opcode.INPUT:
				this._inputRequest = true;
				break;
			case Opcode.OUTPUT:
				const value = this.readParam(instruction);
				this.outputs.push(value);
				break;
			case Opcode.JUMP_IF_TRUE: {
				const condition = this.readParam(instruction);
				const addr = this.readParam(instruction);
				if (condition) this.pc = addr;
				break;
			}
			case Opcode.JUMP_IF_FALSE: {
				const condition = this.readParam(instruction);
				const addr = this.readParam(instruction);
				if (!condition) this.pc = addr;
				break;
			}
			case Opcode.LESS_THAN: {
				const a = this.readParam(instruction);
				const b = this.readParam(instruction);
				this.writeParam(instruction, +(a < b));
				break;
			}
			case Opcode.EQUALS: {
				const a = this.readParam(instruction);
				const b = this.readParam(instruction);
				this.writeParam(instruction, +(a === b));
				break;
			}
			case Opcode.RELATIVE_BASE_OFFSET:
				this.rb += this.readParam(instruction);
				break;
			case Opcode.EXIT:
				this._halted = true;
				break;
			default:
				throw new Error(
					`Illegal opcode instruction at address ${instructionAddress}: ${opcode}`,
				);
		}
	}

	private readParam(instruction: number): number {
		const mode = paramMode(instruction, this.paramCount++);
		const value = this.readMemory(this.pc++);

		switch (mode) {
			case ParameterMode.POSITION:
				return this.readMemory(value);
			case ParameterMode.INMEDIATE:
				return value;
			case ParameterMode.RELATIVE:
				return this.readMemory(value + this.rb);
			default:
				throw new Error(`Illegal parameter mode: ${mode}`);
		}
	}

	private writeParam(instruction: number, value: number) {
		const mode = paramMode(instruction, this.paramCount++);
		const addr = this.readMemory(this.pc++);

		switch (mode) {
			case ParameterMode.POSITION:
				this.writeMemory(addr, value);
				break;
			case ParameterMode.INMEDIATE:
				throw new Error('Cannot write in immediate mode');
			case ParameterMode.RELATIVE:
				this.writeMemory(addr + this.rb, value);
				break;
			default:
				throw new Error(`Illegal parameter mode: ${mode}`);
		}
	}

	public writeInput(value: number) {
		if (!this._inputRequest) return;

		this.writeParam(this.readMemory(this.pc - 1), value);
		this._inputRequest = false;
	}

	public readMemory(addr: number) {
		if (addr >= this.memory.length) return 0;
		return this.memory[addr];
	}

	public run() {
		while (!this._halted) {
			this.step();
		}
	}

	public writeMemory(addr: number, value: number) {
		if (addr >= this.memory.length) {
			this.memory.push(...Array(addr - this.memory.length + 1).fill(0));
		}

		this.memory[addr] = value;
	}

	public nextOutput() {
		return this.outputs.shift();
	}

	public getAllOutputs() {
		return [...this.outputs];
	}

	public get halted() {
		return this._halted;
	}

	public get inputRequest() {
		return this._inputRequest;
	}
}

export class ExtendedIntcodeVM extends IntcodeVM {
	private readonly inputQueue: number[] = [];

	public step() {
		super.step();

		if (this.inputRequest) {
			if (!this.inputQueue.length) throw new Error('No input found');
			this.writeInput(this.inputQueue.shift()!);
		}
	}

	public queueInput(...inputs: number[]) {
		this.inputQueue.push(...inputs);
	}

	public runUntilNextOutput(): number | undefined {
		while (!this.halted) {
			const output = this.nextOutput();
			if (output !== undefined) return output;

			this.step();
		}

		return undefined;
	}
}

const paramMode = (instruction: number, index: number) => {
	const result = Math.floor(instruction / 10 ** (index + 2)) % 10;
	return result;
};
