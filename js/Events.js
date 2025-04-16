import { Rules } from './Rules.js';
import { Game } from './Game.js';

export class EventHandler {
    constructor(game, renderer) {
        this.game = game;
        this.renderer = renderer;
    }

    init() {
        this.container = document.getElementById('cards');
        this.subcontainer = document.getElementById('additional-cards');
        // Menu Items
        this.gameBtn = document.querySelector('.game-btn');
        this.helpBtn = document.querySelector('.help-btn');
        this.closeBtn1 = document.querySelector('.modal-close');
        this.modalGame = document.querySelector('.modal-window');
        this.modalHelp = document.querySelector('.modal-help');
        this.closeBtn2 = document.querySelector('.modal-help__close');
        this.newGameBtn = document.querySelector('#new-game');
        this.saveGameBtn = document.querySelector('#save-game');
        this.loadGameBtn = document.querySelector('#load-game');
        this.styleGameSelect = document.querySelector('#card-style');
        this.undoBtn = document.querySelector('#undo');




        this.subcontainer.addEventListener('click', this.handleStock.bind(this));
        this.container.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.container.addEventListener('dragover', this.handleDragOver.bind(this));
        this.container.addEventListener('drop', this.handleDrop.bind(this));
        
        // Menu Evetns
        this.gameBtn.addEventListener('click', this.handleMenu.bind(this));
        this.helpBtn.addEventListener('click', this.handleHelp.bind(this));
        this.closeBtn1.addEventListener('click', this.handleMenuModalClose.bind(this));
        this.closeBtn2.addEventListener('click', this.handleHelpModalClose.bind(this));
        this.newGameBtn.addEventListener('click', this.handleNewGame.bind(this));
        this.styleGameSelect.addEventListener('change', this.handleCardStyleChange.bind(this));
        this.undoBtn.addEventListener('click', this.handleUndo.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));

        this.saveGameBtn.addEventListener('click', this.handleSaveGame.bind(this));
        this.loadGameBtn.addEventListener('click', this.handleLoadGame.bind(this));
    }

    handleStock(event) {
        this.game.saveState();
        console.log("Stock clicked");
        if (event.target.classList.contains('additional-deck')) {
            console.log(this.game.stock);
            
            if (this.game.stock.dealCards(this.game.columns)) { 
                this.game.saveCurrentGame();
                this.renderer.render(); 

            } else {
                console.log("Error");
                
            }
        }
    }

    handleDragStart(event) {
        const cardDiv = event.target.closest('.card');
        if (cardDiv && cardDiv.draggable) {
            const columnDiv = cardDiv.closest('.column');
            this.fromColumnIndex = parseInt(columnDiv.dataset.index);
            this.cardIndex = parseInt(cardDiv.dataset.index);
            event.dataTransfer.setData('text/plain', JSON.stringify({
                fromColumn: this.fromColumnIndex,
                cardIndex: this.cardIndex
            }));
        }
    }

    handleDragOver(event) {
        event.preventDefault();
    }

    handleDrop(event) {
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData('text/plain'));
        const toColumnDiv = event.target.closest('.column');
        if (toColumnDiv) {
            const toColumnIndex = parseInt(toColumnDiv.dataset.index);
            const fromColumn = this.game.columns[data.fromColumn];
            const toColumn = this.game.columns[toColumnIndex];

            const cardsToMove = fromColumn.cards.slice(data.cardIndex);
            const bottomCard = cardsToMove[0]; 

            let isValidTarget = false;
            if (toColumn.cards.length === 0) {
                isValidTarget = true;
            } else {
                const targetCard = toColumn.getTopCard(); 
                isValidTarget = Rules.canMoveCard(bottomCard, targetCard);
            }

            if (isValidTarget && Rules.moveCards(fromColumn, toColumn, data.cardIndex, this.game)) {
                this.renderer.render();
            }
        }
    }

    handleMenu(){
        this.modalGame.style.display = 'flex';
    }

    handleHelp(){
        this.modalHelp.style.display = 'flex';
    }

    handleMenuModalClose(){
        this.modalGame.style.display = 'none';
    }
    
    handleHelpModalClose(){
        this.modalHelp.style.display = 'none';
    }

    handleNewGame(){
        this.modalGame.style.display = 'none';
        Game.startNewGame();
    }

    handleCardStyleChange() {
        this.renderer.render();
        this.handleMenuModalClose();
    }

    handleUndo(){
        if (this.game.isGameWon() === false){
            this.game.undo(this.renderer);
            this.game.saveCurrentGame();
            this.handleMenuModalClose();
        }
    }

    handleKeyDown(event){
        if (event.ctrlKey && event.key === 'z' && this.game.isGameWon() === false) {
            event.preventDefault();
            this.game.undo(this.renderer);
            console.log("ZZZZZZZZZZZZZZZ");
            
            this.game.saveCurrentGame();

        }
    }

    handleSaveGame(){
        const name = prompt('Enter name of your game:');
        if (name) {
            this.game.saveNamedGame(name);
            console.log("Save game button clicked!");
            Game.updateSavedGamesList();
        }
    }

    handleLoadGame(){
        Game.updateSavedGamesList();
        document.querySelector('#saved-games').style.display = 'block';
        console.log('Load game button clicked!');
        
    }
}