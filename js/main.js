// js/main.js
import { Game } from './Game.js';
import { Renderer } from './Render.js';
import { EventHandler } from './Events.js';

let game = Game.loadCurrentGame();

if (!game) {
    game = new Game(1);
    game.initialize();
}
    
const renderer = new Renderer(game, 'cards', 'additional-cards');
renderer.render();
    
const eventHandler = new EventHandler(game, renderer);
eventHandler.init();

game.saveCurrentGame();
