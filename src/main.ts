import { Chip8 } from './chip8.ts'
import { Renderer } from './renderer.ts';

const renderer = new Renderer(document.getElementById('screen') as HTMLCanvasElement);
const chip8 = new Chip8(renderer);


console.log('Hello, World!..');