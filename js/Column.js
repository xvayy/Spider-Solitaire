// js/column.js
export class Column {
    constructor() {
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card);
    }

    removeCards(startIndex) {
        return this.cards.splice(startIndex);
    }

    getTopCard() {
        return this.cards[this.cards.length - 1];
    }
}