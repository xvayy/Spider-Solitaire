// js/main.js
import { Game } from './Game.js';
import { Renderer } from './Render.js';
import { EventHandler } from './Events.js';

const game = new Game(1); // 1 масть
game.initialize();

const renderer = new Renderer(game, 'game');
renderer.render();

const eventHandler = new EventHandler(game, renderer);
eventHandler.init();