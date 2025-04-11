import { Card } from './Card.js';
import { Column } from './Column.js';
import { Stock } from './Stock.js';

export class Game {
    constructor(suits = 1) {
        this.suits = suits;
        this.columns = Array(10).fill().map(() => new Column());
        this.stock = new Stock();
        this.completedSequences = 0;
        this.completedSequenceSuits = [];
    }

    initialize() {
        const suitsList = ["spades", "hearts", "diamonds", "clubs"].slice(0, this.suits);
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        const deck = [];

        // Створюємо 104 карти (2 колоди, повторюємо масті, якщо suits < 4)
        const cardsPerSuit = Math.ceil(104 / suitsList.length); // Скільки карт на масть
        for (let suit of suitsList) {
            for (let i = 0; i < cardsPerSuit / 13; i++) { // Повторюємо ранги, щоб отримати потрібну кількість
                for (let rank of ranks) {
                    deck.push(new Card(suit, rank));
                }
            }
        }

        // Доповнюємо, якщо карт менше 104
        while (deck.length < 104) {
            const suit = suitsList[deck.length % suitsList.length];
            const rank = ranks[deck.length % ranks.length];
            deck.push(new Card(suit, rank));
        }

        // Перемішуємо колоду
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        // Розкладаємо карти
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

        this.stock.cards = deck; // Решта карт у талію
        this.stock.dealsLeft = Math.floor(deck.length / 10);
    }

    isGameWon() {
        return this.completedSequences === 8;
    }
}