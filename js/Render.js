export class Renderer {
    constructor(game, containerId) {
        this.game = game;
        this.container = document.getElementById(containerId);
    }

    render() {
        this.container.innerHTML = '';
        
        

        // Рендеримо колонки з картами
        const columnsDiv = document.createElement('div');
        columnsDiv.className = 'columns';
        this.game.columns.forEach((column, colIndex) => {
            const columnDiv = document.createElement('div');
            columnDiv.className = 'column';
            columnDiv.dataset.index = colIndex;
            column.cards.forEach((card, cardIndex) => {
                const cardDiv = document.createElement('div');
                cardDiv.className = 'card';
                cardDiv.dataset.suit = card.suit;
                cardDiv.dataset.rank = card.rank;
                cardDiv.style.backgroundImage = `url(/img/${card.suit}.png)`;
                cardDiv.dataset.index = cardIndex;
                cardDiv.draggable = card.isFaceUp;
                cardDiv.innerText = card.isFaceUp ? `${card.rank}` : '';
                cardDiv.style.backgroundImage = !card.isFaceUp ? `url(/img/card-back-orange.png)` : `url(/img/${card.suit}.png)`;
                columnDiv.appendChild(cardDiv);
            });
            columnsDiv.appendChild(columnDiv);
        });
        this.container.appendChild(columnsDiv);

        // Рендеримо сток
        const stockDiv = document.createElement('div');
        stockDiv.className = 'stock';
        for (let i = 0; i < this.game.stock.dealsLeft; i++) {
            const additionalDeckDiv = document.createElement('div');
            additionalDeckDiv.className = 'additional-deck';
            stockDiv.appendChild(additionalDeckDiv);
        }
        // stockDiv.innerText = `Stock: ${this.game.stock.cards.length}`;
        this.container.appendChild(stockDiv);
    }
}