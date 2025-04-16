import { Card } from './Card.js';
import { Column } from './Column.js';
import { Stock } from './Stock.js';
import { Renderer } from './Render.js';
import { EventHandler } from './Events.js';


export class Game {
    constructor(suits = 1) {
        this.suits = suits;
        this.columns = Array(10).fill().map(() => new Column());
        this.stock = new Stock();
        this.completedSequences = 0;
        this.completedSequenceSuits = [];
        this.movesCounter = 0;
        this.scoreCounter = 0;
        this.cardStyle = document.getElementById('card-style');
        this.history = [];
    }

    initialize() {
        const suitsList = ["spades", "hearts", "diamonds", "clubs"].slice(0, this.suits);
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        const deck = [];

        const cardsPerSuit = Math.ceil(104 / suitsList.length); // Скільки карт на масть
        for (let suit of suitsList) {
            for (let i = 0; i < cardsPerSuit / 13; i++) { // Повторюємо ранги, щоб отримати потрібну кількість
                for (let rank of ranks) {
                    deck.push(new Card(suit, rank));
                }
            }
        }

        while (deck.length < 104) {
            const suit = suitsList[deck.length % suitsList.length];
            const rank = ranks[deck.length % ranks.length];
            deck.push(new Card(suit, rank));
        }

        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        for (let i = 0; i < 10; i++) {
            const cardsToDeal = i < 4 ? 6 : 5;
            for (let j = 0; j < cardsToDeal; j++) {
                const card = deck.pop();
                if (!card) {
                    console.error("Deck is empty! Check deck creation.");
                    return;
                }
                card.isFaceUp = j === cardsToDeal - 1;
                this.columns[i].addCard(card);
            }
        }

        this.stock.cards = deck;
        this.stock.dealsLeft = Math.floor(deck.length / 10);
    }

    isGameWon() {
        return this.completedSequences === 8;
    }

    isGameLosen() {
        return false;
    }

    static startNewGame() {
        const difficultySelect = document.getElementById('difficulty');
        if (!difficultySelect) {
          console.error('Difficulty select element not found');
          return;
        }
        const suits = parseInt(difficultySelect.value, 10);
      
        const game = new Game(suits);
        game.initialize();
        
        const renderer = new Renderer(game, 'cards', 'additional-cards');
        renderer.render();
        
        const eventHandler = new EventHandler(game, renderer);
        eventHandler.init();
    
        game.saveCurrentGame();
    }

    saveState() {
        const state = {
            columns: this.columns.map(column => {
                const newColumn = new Column();
                newColumn.cards = column.cards.map(card => {
                    const newCard = new Card(card.suit, card.rank);
                    newCard.isFaceUp = card.isFaceUp;
                    return newCard;
                });
                return newColumn;
            }),
            stock: {
                cards: this.stock.cards.map(card => {
                    const newCard = new Card(card.suit, card.rank);
                    newCard.isFaceUp = card.isFaceUp;
                    return newCard;
                }),
                dealsLeft: this.stock.dealsLeft
            },
            completedSequences: this.completedSequences,
            completedSequenceSuits: [...this.completedSequenceSuits],
            movesCounter: this.movesCounter,
            scoreCounter: this.scoreCounter
        };
        this.history.push(state);
    }
    
    undo(renderer) {
        if (this.history.length === 0) {
            console.log('Немає ходів для скасування');
            return;
        }
    
        const previousState = this.history.pop();
        this.columns = previousState.columns;
        this.stock.cards = previousState.stock.cards;
        this.stock.dealsLeft = previousState.stock.dealsLeft;
        this.completedSequences = previousState.completedSequences;
        this.completedSequenceSuits = previousState.completedSequenceSuits;
        this.movesCounter = previousState.movesCounter;
        this.scoreCounter = previousState.scoreCounter;
    
        renderer.render();
    }


    // Work with local storage
    saveCurrentGame() {
        const state = {
            columns: this.columns.map(column => ({
                cards: column.cards.map(card => ({
                    suit: card.suit,
                    rank: card.rank,
                    isFaceUp: card.isFaceUp
                }))
            })),
            stock: {
                cards: this.stock.cards.map(card => ({
                    suit: card.suit,
                    rank: card.rank,
                    isFaceUp: card.isFaceUp
                })),
                dealsLeft: this.stock.dealsLeft
            },
            completedSequences: this.completedSequences,
            completedSequenceSuits: [...this.completedSequenceSuits],
            movesCounter: this.movesCounter,
            scoreCounter: this.scoreCounter,
            suits: this.suits,
            history: this.history
        };
        localStorage.setItem('currentGame', JSON.stringify(state));
    }

    static loadCurrentGame() {
        const savedState = localStorage.getItem('currentGame');
        if (!savedState) return null;
    
        const state = JSON.parse(savedState);
        const game = new Game(state.suits);
        game.columns = state.columns.map(col => {
            const column = new Column();
            column.cards = col.cards.map(card => {
                const newCard = new Card(card.suit, card.rank);
                newCard.isFaceUp = card.isFaceUp;
                return newCard;
            });
            return column;
        });
        game.stock.cards = state.stock.cards.map(card => {
            const newCard = new Card(card.suit, card.rank);
            newCard.isFaceUp = card.isFaceUp;
            return newCard;
        });
        game.stock.dealsLeft = state.stock.dealsLeft;
        game.completedSequences = state.completedSequences;
        game.completedSequenceSuits = state.completedSequenceSuits;
        game.movesCounter = state.movesCounter;
        game.scoreCounter = state.scoreCounter;
        game.suits = state.suits;
        game.history = state.history || [];
        return game;
    }

    saveNamedGame(name) {
        const state = {
            columns: this.columns.map(column => ({
                cards: column.cards.map(card => ({
                suit: card.suit,
                rank: card.rank,
                isFaceUp: card.isFaceUp
                }))
            })),
            stock: {
                cards: this.stock.cards.map(card => ({
                    suit: card.suit,
                    rank: card.rank,
                    isFaceUp: card.isFaceUp
                })),
            dealsLeft: this.stock.dealsLeft
            },
            completedSequences: this.completedSequences,
            completedSequenceSuits: [...this.completedSequenceSuits],
            movesCounter: this.movesCounter,
            scoreCounter: this.scoreCounter,
            suits: this.suits,
            history: this.history
        };
    
        const savedGames = JSON.parse(localStorage.getItem('savedGames') || '[]');
        savedGames.push({
            name,
            state,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('savedGames', JSON.stringify(savedGames));
    }
    
    static loadNamedGame(index) {
        const savedGames = JSON.parse(localStorage.getItem('savedGames') || '[]');
        if (!savedGames[index]) return null;
    
        const { state } = savedGames[index];
        const game = new Game(state.suits);
        game.columns = state.columns.map(col => {
            const column = new Column();
            column.cards = col.cards.map(card => {
                const newCard = new Card(card.suit, card.rank);
                newCard.isFaceUp = card.isFaceUp;
                return newCard;
            });
            return column;
        });
        game.stock.cards = state.stock.cards.map(card => {
            const newCard = new Card(card.suit, card.rank);
            newCard.isFaceUp = card.isFaceUp;
            return newCard;
        });
        game.stock.dealsLeft = state.stock.dealsLeft;
        game.completedSequences = state.completedSequences;
        game.completedSequenceSuits = state.completedSequenceSuits;
        game.movesCounter = state.movesCounter;
        game.scoreCounter = state.scoreCounter;
        game.suits = state.suits;
        game.history = state.history || [];
        return game;
    }

    static updateSavedGamesList() {
        const savedGamesList = document.querySelector('.saved-games__list');
        console.log(savedGamesList);
        savedGamesList.innerHTML = '';
    
        const savedGames = JSON.parse(localStorage.getItem('savedGames') || '[]');
        if (savedGames.length === 0) {
            alert('No saved games available');
            return;
        }
        
        savedGames.forEach((savedGame, index) => {
            const li = document.createElement('li');
            const date = new Date(savedGame.timestamp);
            li.className = "list-item"
            
            const text = document.createElement("p")
            const loadButton = document.createElement("button")
            loadButton.className = "load-saved-item__btn"
            const deleteButton = document.createElement("button")
            deleteButton.className = "delete-saved-item__btn"
            const editButton = document.createElement("button")
            editButton.className = "edit-saved-item__btn"
            const btnsDiv = document.createElement("div")
            // btnsDiv.className = "co"
            
            loadButton.style.cursor = 'pointer';
            deleteButton.style.cursor = 'pointer';


            text.textContent = `${index + 1}. ${savedGame.name} - ${date.toLocaleString()}`
            li.appendChild(text)
            btnsDiv.appendChild(loadButton);
            btnsDiv.appendChild(editButton);
            btnsDiv.appendChild(deleteButton);
            li.appendChild(btnsDiv)




            loadButton.addEventListener('click', () => {
                const game = Game.loadNamedGame(index);
                if(confirm(`Are you sure you want to load "${savedGame.name}"?`)){
                    if (game) {
                        const renderer = new Renderer(game, 'cards', 'additional-cards');
                        renderer.render();
                        const eventHandler = new EventHandler(game, renderer);
                        eventHandler.init();
                        game.saveCurrentGame();
                        document.querySelector('.modal-window').style.display = 'none';
                        // location.reload();
                        console.log("Game loaded:");
                    } 
                }
            });


            deleteButton.addEventListener("click", () => {
                if (confirm(`Are you sure you want to delete "${savedGame.name}"?`)) {
                    savedGames.splice(index, 1);
                    localStorage.setItem('savedGames', JSON.stringify(savedGames));
                    Game.updateSavedGamesList();
                }
            })

            editButton.addEventListener("click", () => {
                const newName = prompt("Enter new name for saved game:")
                if (newName) {
                    savedGames[index].name = newName;
                    localStorage.setItem('savedGames', JSON.stringify(savedGames));
                    Game.updateSavedGamesList();
                }
            })


            savedGamesList.appendChild(li);
        });
    }

}