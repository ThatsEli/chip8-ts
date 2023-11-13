import { Chip8 } from './chip8.ts'
import { Renderer } from './renderer.ts';
// let chip8 = new Chip8();
const renderer = new Renderer(document.getElementById('screen') as HTMLCanvasElement);

// render smiley
renderer.render(0, 0);
renderer.render(1, 0);
renderer.render(2, 0);
renderer.render(3, 0);
renderer.render(4, 0);
renderer.render(5, 0);


console.log('Hello, World!..');