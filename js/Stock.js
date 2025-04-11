export class Stock {
    constructor(cards = []) {
        this.cards = cards;
        this.dealsLeft = Math.floor(cards.length / 10);
    }



    dealCards(columns) {
        if (this.cards.length >= 10 && columns.every(col => col.cards.length > 0)) {
            for (let i = 0; i < 10; i++) {
                const card = this.cards.pop();
                card.isFaceUp = true;
                columns[i].addCard(card);
            }
            this.dealsLeft = Math.floor(this.cards.length / 10)
            return true;
        }
        return false;
    }
}