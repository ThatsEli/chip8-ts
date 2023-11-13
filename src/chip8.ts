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

    public test(): string {
        return 'test';
    }
}