// Factor to scale the CHIP-8 display by.
const SCALE = 10;

/**
 * The Renderer class is responsible for rendering the CHIP-8 display on a canvas element.
 */
export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private imageData: number[];

    /**
     * Creates a new Renderer instance.
     * @param canvas - The canvas element to render to.
     */
    constructor(canvas: HTMLCanvasElement) {
        console.log('test2');
        this.canvas = canvas;
        this.canvas.width = 64 * SCALE;
        this.canvas.height = 32 * SCALE;
        console.log(this.canvas);
        this.ctx = canvas.getContext('2d');
        this.imageData = [0].fill(0, 0, 64 * 32);
    }

    /**
     * Renders a pixel at the specified coordinates.
     * @param x - The x-coordinate of the pixel.
     * @param y - The y-coordinate of the pixel.
     */
    public render(x: number, y: number, value: number): boolean {
        this.ctx?.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
        if(this.imageData[x + y * 64] === value) {
            return false;
        } else {
            this.imageData[x + y * 64] = value;
            return true;
        }
    }

    /**
     * Clears the canvas.
     */
    public clear(): void {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
