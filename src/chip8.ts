import { Instruction, ParsedInstruction, instructions } from "./instruction";
import { Renderer } from "./renderer";

export class Chip8 {
    private memory: Uint8Array; // memory (4k)
    private PC: number; // program counter
    private registers: Uint8Array; // registers (V0-VF)
    private I: number; // index register
    private stack: Uint16Array; // stack
    private stackPointer: number; // stack pointer
    private DT: number; // delay timer
    private ST: number; // sound timer, not used for now


    private renderer: Renderer;


    constructor(renderer: Renderer) {
        this.memory = new Uint8Array(4096);
        this.PC = 0x200; // program counter starts at 0x200
        this.registers = new Uint8Array(16);
        this.I = 0;
        this.stack = new Uint16Array(16);
        this.stackPointer = -1;
        this.DT = 0;
        this.ST = 0;

        this.renderer = renderer;
    }

    /**
     * Loads the given ROM data into the Chip8 memory.
     * @param romData The ROM data to load.
     */
    public load(romData: number[]): void {
        romData.forEach((data, index) => {
            this.memory[index] = data;
        });
    }

    /**
     * Executes a single step (fetch, decode and execute instruction)
     */
    public step(): void {
        const isntr = this.memory[this.PC];
        const parsedInstruction = this.parseInstruction(isntr);
        this.executeInstruction(parsedInstruction);
    }

    /**
     * Executes the given parsed instruction.
     * @param instruction The parsed instruction to execute.
     */
    private executeInstruction(instruction: ParsedInstruction): void {
        switch (instruction.instruction.name) {
            case 'display_clear':
                this.renderer.clear();
                break;
            case 'return':
                if (this.stackPointer < 0) {
                    throw new Error('[E] Stack underflow!');
                }
                this.PC = this.stack[this.stackPointer];
                this.stackPointer--;
                break;
            case 'jump':
                this.PC = instruction.arguments[0];
                break;
            case 'call':
                if (this.stackPointer >= 15) {
                    throw new Error('[E] Stack overflow!');
                }
                this.stackPointer++;
                this.stack[this.stackPointer] = this.PC + 2;
                this.PC = instruction.arguments[0];
                break;
            case 'skip_equal':
                this.dependedSkipInstruction(this.registers[instruction.arguments[0]] !== instruction.arguments[1]);
                break;
            // if(this.registers[instruction.arguments[0]] === instruction.arguments[1]) {
            //     this.skipInstruction();
            // } else 
            //     this.PC += 2;
            // break;
            case 'skip_not_equal':
                this.dependedSkipInstruction(this.registers[instruction.arguments[0]] !== instruction.arguments[1]);
                break;
            case 'skip_equal_register':
                this.dependedSkipInstruction(this.registers[instruction.arguments[0]] === this.registers[instruction.arguments[1]]);
                break;
            case 'load_byte_to_vx':
                this.registers[instruction.arguments[0]] = instruction.arguments[1];
                this.PC += 2;
                break;
            case 'add_byte_to_vx':
                this.registers[instruction.arguments[0]] += instruction.arguments[1];
                this.PC += 2;
                break;
            case 'set_vx_to_vy':
                this.registers[instruction.arguments[0]] = this.registers[instruction.arguments[1]];
                this.PC += 2;
                break;
            case 'or_vx_vy':
                this.registers[instruction.arguments[0]] |= this.registers[instruction.arguments[1]];
                this.PC += 2;
                break;
            case 'and_vx_vy':
                this.registers[instruction.arguments[0]] &= this.registers[instruction.arguments[1]];
                this.PC += 2;
                break;
            case 'xor_vx_vy':
                this.registers[instruction.arguments[0]] ^= this.registers[instruction.arguments[1]];
                this.PC += 2;
                break;
            case 'add_vx_vy':
                this.registers[instruction.arguments[0]] += this.registers[instruction.arguments[1]];
                this.PC += 2;
                break;
            case 'sub_vx_vy':
                this.registers[instruction.arguments[0]] -= this.registers[instruction.arguments[1]];
                this.PC += 2;
                break;
            case 'shr_vx_vy':
                this.registers[instruction.arguments[0]] >>= 1;
                this.PC += 2;
                break;
            case 'subn_vx_vy':
                this.registers[instruction.arguments[0]] = this.registers[instruction.arguments[1]] - this.registers[instruction.arguments[0]];
                this.PC += 2;
                break;
            case 'shl_vx_vy':
                this.registers[instruction.arguments[0]] <<= 1;
                this.PC += 2;
                break;
            case 'skip_not_equal_register':
                this.dependedSkipInstruction(this.registers[instruction.arguments[0]] !== this.registers[instruction.arguments[1]]);
                break;
            case 'load_address':
                this.I = instruction.arguments[0];
                this.PC += 2;
                break;
            case 'jump_offset':
                this.PC = instruction.arguments[0] + this.registers[0];
                break;
            case 'random':
                const rdmValue = Math.floor(Math.random() * 0xff);
                this.registers[instruction.arguments[0]] = rdmValue & instruction.arguments[1];
                this.PC += 2;
                break;
            case 'draw':
                if (this.I + instruction.arguments[2] > 0xFFF) {
                    throw new Error('[E] Index register out of bounds!');
                }
                this.registers[0xF] = 0; // set to 0, gets set to 1 if pixel is flipped

                for (let i = 0; i < instruction.arguments[2]; i++) {
                    const line = this.memory[this.I + i];
                    for (let position = 0; position < 8; position++) {
                        const value = line & (1 << (7 - position)) ? 1 : 0
                        let x = (this.registers[instruction.arguments[0]] + position) % 64;
                        let y = (this.registers[instruction.arguments[1]] + i) % 32;

                        if (this.renderer.render(x, y, value)) {
                            this.registers[0xf] = 1
                        }
                    }
                }
                this.PC += 2;
                break;
            case 'skip_key_pressed':
                throw new Error('[E] Instruction not implemented!');
                break;
            case 'skip_key_not_pressed':
                throw new Error('[E] Instruction not implemented!');
                break;
            case 'load_delay_timer':
                this.registers[instruction.arguments[0]] = this.DT;
                break;
            case 'wait_key_press':
                throw new Error('[E] Instruction not implemented!');
                break;
            case 'set_delay_timer':
                this.DT = this.registers[instruction.arguments[0]];
                break;
            case 'set_sound_timer':
                this.ST = this.registers[instruction.arguments[0]];
                break;
            case 'add_i':
                this.I += this.registers[instruction.arguments[0]];
                break;
            case 'load_sprite':
                this.I = this.registers[instruction.arguments[0]] * 5;
                break;
            case 'load_bcd':
                if (this.I > 0xFFF - 2) {
                    throw new Error('[E] Index register out of bounds!');
                }
                let x = this.registers[instruction.arguments[1]];
                const a = Math.floor(x / 100);
                x = x - a * 100;
                const b = Math.floor(x / 10);
                x = x - b * 10;
                const c = Math.floor(x);

                this.memory[this.I] = a
                this.memory[this.I + 1] = b
                this.memory[this.I + 2] = c

                this.PC += 2;
                break;
            case 'store_memory':
                for (let i = 0; i <= instruction.arguments[0]; i++) {
                    this.memory[this.I + i] = this.registers[i];
                }
                this.PC += 2;
                break;
            case 'load_memory':
                for (let i = 0; i <= instruction.arguments[0]; i++) {
                    this.registers[i] = this.memory[this.I + i];
                }
                this.PC += 2;
                break;
            default:
                throw new Error('[E] Unknown instruction ' + instruction.instruction.name);
        }
    }

    private dependedSkipInstruction(result: boolean): void {
        this.PC += result ? 4 : 2;
    }


    /**
     * Parses a raw instruction and returns a ParsedInstruction object.
     * @param rawInstruction The raw instruction to parse.
     * @returns A ParsedInstruction object representing the parsed instruction.
     * @throws An error if the instruction is unknown.
     */
    private parseInstruction(rawInstruction: number): ParsedInstruction {
        const instruction = instructions.find((instruction) => {
            // Mask the raw instruction with the instruction's mask and compare it to the instruction's opcode.
            if ((rawInstruction & instruction.mask) === instruction.opcode) {
                return true;
            }
        });
        if (!instruction) {
            throw new Error('[E] Unknown instruction ' + rawInstruction.toString(16));
        }
        const instructionArguments = instruction.arguments.map((argument) => {
            return (rawInstruction & argument.mask) >> argument.shiftAmount;
        });
        return new ParsedInstruction(instruction, instructionArguments);
    }
}