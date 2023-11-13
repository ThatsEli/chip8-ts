export class Rom {
    /** The data of the ROM. */
    public data: number[];
    
    /**
     * Creates a new ROM object from the given file content.
     * @param fileContent The binary content of the ROM file.
     */
    constructor(fileContent: Uint8Array) {
        this.data = [];
        for (let i = 0; i < fileContent.length; i++) {
            // Combine two bytes (8bit) into one 16-bit number as the CHIP-8 uses 16-bit instructions.
            this.data.push((fileContent[i] << 8) | (fileContent[i + 1]));
        }
    }
}