/**
 * Represents a CHIP-8 instruction.
 */
export class Instruction {
    /** The name of the instruction. */
    public name: string;
    /** The opcode of the instruction (after masking). */
    public opcode: number;
    /** The mask used to remove the arguments from the opcode. */
    public mask: number;
    /** The arguments of the instruction. */
    public arguments: Argument[];

    /**
     * Creates a new instance of the Instruction class.
     * @param name The name of the instruction.
     * @param opcode The opcode of the instruction.
     * @param mask The mask used to remove the arguments from the opcode.
     * @param instArguments The arguments of the instruction.
     */
    constructor(name: string, opcode: number, mask: number, instArguments: Argument[]) {
        this.name = name;
        this.opcode = opcode;
        this.mask = mask;
        this.arguments = instArguments;
    }
}

export class ParsedInstruction {
    /** The instruction object. */
    public instruction: Instruction;

    /** The arguments parsed from the instruction. */
    public arguments: number[];

    /**
     * Creates a new instance of the ParsedInstruction class.
     * @param instruction The instruction object.
     * @param parsedArguments The arguments parsed from the instruction.
     */
    constructor(instruction: Instruction, parsedArguments: number[]) {
        this.instruction = instruction;
        this.arguments = parsedArguments;
    }
}

/**
 * Represents an argument for a CHIP-8 instruction.
 */
class Argument {
    /** The mask used to remove the argument from the opcode. */
    public mask: number;
    /** The amount of bits to shift the argument to the right after applying the mask */
    public shiftAmount: number;
    /** The type of the argument. */
    public type: ArgumentType;

    /**
     * Creates a new Argument object.
     * @param mask - The mask used to remove the argument from the opcode.
     * @param shiftAmount - The amount of bits to shift the argument to the right after applying the mask.
     * @param type - The type of argument.
     */
    constructor(mask: number, shiftAmount: number, type: ArgumentType) {
        this.mask = mask;
        this.shiftAmount = shiftAmount;
        this.type = type;
    }
}

/**
 * Represents the type of argument used in a CHIP-8 instruction.
 */
enum ArgumentType {
    Register,
    Address,
    Byte,
    Nibble
}


export const instructions = [
    new Instruction('display_clear', 0x00E0, 0xFFFF, []),
    new Instruction('return', 0x00EE, 0xFFFF, []),
    new Instruction('jump', 0x1000, 0xF000, [new Argument(0x0FFF, 0, ArgumentType.Address)]),
    new Instruction('call', 0x2000, 0xF000, [new Argument(0x0FFF, 0, ArgumentType.Address)]),
    new Instruction('skip_equal', 0x3000, 0xF000, [new Argument(0x0F00, 8, ArgumentType.Register), new Argument(0x00FF, 0, ArgumentType.Byte)]),
    new Instruction('skip_not_equal', 0x4000, 0xF000, [new Argument(0x0F00, 8, ArgumentType.Register), new Argument(0x00FF, 0, ArgumentType.Byte)]),
    new Instruction('skip_equal_register', 0x5000, 0xF00F, [new Argument(0x0F00, 8, ArgumentType.Register), new Argument(0x00F0, 4, ArgumentType.Register)]),
    new Instruction('load_byte_to_vx', 0x6000, 0xF000, [new Argument(0x0F00, 8, ArgumentType.Register), new Argument(0x00FF, 0, ArgumentType.Byte)]),
    new Instruction('add_byte_to_vx', 0x7000, 0xF000, [new Argument(0x0F00, 8, ArgumentType.Register), new Argument(0x00FF, 0, ArgumentType.Byte)]),
    new Instruction('set_vx_to_vy', 0x8000, 0xF00F, [new Argument(0x0F00, 8, ArgumentType.Register), new Argument(0x00F0, 4, ArgumentType.Register)]),
    new Instruction('or_vx_vy', 0x8001, 0xF00F, [new Argument(0x0F00, 8, ArgumentType.Register), new Argument(0x00F0, 4, ArgumentType.Register)]),
    new Instruction('and_vx_vy', 0x8002, 0xF00F, [new Argument(0x0F00, 8, ArgumentType.Register), new Argument(0x00F0, 4, ArgumentType.Register)]),
    new Instruction('xor_vx_vy', 0x8003, 0xF00F, [new Argument(0x0F00, 8, ArgumentType.Register), new Argument(0x00F0, 4, ArgumentType.Register)]),
    new Instruction('add_vx_vy', 0x8004, 0xF00F, [new Argument(0x0F00, 8, ArgumentType.Register), new Argument(0x00F0, 4, ArgumentType.Register)]),
    new Instruction('sub_vx_vy', 0x8005, 0xF00F, [new Argument(0x0F00, 8, ArgumentType.Register), new Argument(0x00F0, 4, ArgumentType.Register)]),
    new Instruction('shr_vx_vy', 0x8006, 0xF00F, [new Argument(0x0F00, 8, ArgumentType.Register)]),
    new Instruction('subn_vx_vy', 0x8007, 0xF00F, [new Argument(0x0F00, 8, ArgumentType.Register)]),
    new Instruction('shl_vx_vy', 0x800E, 0xF00F, [new Argument(0x0F00, 8, ArgumentType.Register)]),
    new Instruction('skip_not_equal_register', 0x9000, 0xF00F, [new Argument(0x0F00, 8, ArgumentType.Register), new Argument(0x00F0, 4, ArgumentType.Register)]),
    new Instruction('load_address', 0xA000, 0xF000, [new Argument(0x0FFF, 0, ArgumentType.Address)]),
    new Instruction('jump_offset', 0xB000, 0xF000, [new Argument(0x0FFF, 0, ArgumentType.Address)]),
    new Instruction('random', 0xC000, 0xF000, [new Argument(0x0F00, 8, ArgumentType.Register), new Argument(0x00FF, 0, ArgumentType.Byte)]),
    new Instruction('draw', 0xD000, 0xF000, [new Argument(0x0F00, 8, ArgumentType.Register), new Argument(0x00F0, 4, ArgumentType.Register), new Argument(0x000F, 0, ArgumentType.Nibble)]),
    new Instruction('skip_key_pressed', 0xE09E, 0xF0FF, [new Argument(0x0F00, 8, ArgumentType.Register)]),
    new Instruction('skip_key_not_pressed', 0xE0A1, 0xF0FF, [new Argument(0x0F00, 8, ArgumentType.Register)]),
    new Instruction('load_delay_timer', 0xF007, 0xF0FF, [new Argument(0x0F00, 8, ArgumentType.Register)]),
    new Instruction('wait_key_press', 0xF00A, 0xF0FF, [new Argument(0x0F00, 8, ArgumentType.Register)]),
    new Instruction('set_delay_timer', 0xF015, 0xF0FF, [new Argument(0x0F00, 8, ArgumentType.Register)]),
    new Instruction('set_sound_timer', 0xF018, 0xF0FF, [new Argument(0x0F00, 8, ArgumentType.Register)]),
    new Instruction('add_i', 0xF01E, 0xF0FF, [new Argument(0x0F00, 8, ArgumentType.Register)]),
    new Instruction('load_sprite', 0xF029, 0xF0FF, [new Argument(0x0F00, 8, ArgumentType.Register)]),
    new Instruction('load_bcd', 0xF033, 0xF0FF, [new Argument(0x0F00, 8, ArgumentType.Register)]),
    new Instruction('store_memory', 0xF055, 0xF0FF, [new Argument(0x0F00, 8, ArgumentType.Register)]),
    new Instruction('read_memory', 0xF065, 0xF0FF, [new Argument(0x0F00, 8, ArgumentType.Register)])
];
