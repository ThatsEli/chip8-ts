import { Instruction, ParsedInstruction, instructions } from "./instruction";

export class Chip8 {
    private memory: Uint8Array; // memory (4k)
    private PC: number; // program counter
    private registers: Uint8Array; // registers (V0-VF)
    private stack: Uint16Array; // stack
    private stackPointer: number; // stack pointer
    private DT: number; // delay timer
    private ST: number; // sound timer, not used for now


    constructor() {
        this.memory = new Uint8Array(4096);
        this.PC = 0x200; // program counter starts at 0x200
        this.registers = new Uint8Array(16);
        this.stack = new Uint16Array(16);
        this.stackPointer = -1;
        this.DT = 0;
        this.ST = 0;
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
            case 'add_vx_vy':
                this.registers[instruction.arguments[0]] += this.registers[instruction.arguments[1]];
                this.PC += 2;
                break;
            case 'sub_vx_vy':
                this.registers[instruction.arguments[0]] -= this.registers[instruction.arguments[1]];
                this.PC += 2;
                break;
        }
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
        if(!instruction) {
            throw new Error('[E] Unknown instruction ' + rawInstruction.toString(16));
        }
        const instructionArguments = instruction.arguments.map((argument) => {
            return (rawInstruction & argument.mask) >> argument.shiftAmount;
        });
        return new ParsedInstruction(instruction, instructionArguments);
    }
}