export class Renderer {
    constructor(game, containerId, subcontainerId) {
        this.game = game;
        this.container = document.getElementById(containerId);
        this.subcontainer = document.getElementById(subcontainerId);
    }

    render() {
        this.container.innerHTML = '';
        this.subcontainer.innerHTML = '';

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


        // Зібрані послідовності
        const sequencesDiv = document.createElement('div');
        sequencesDiv.className = 'completed-sequences';
        for (let i = 0; i < this.game.completedSequences; i++) {
            const sequenceDiv = document.createElement('div');
            sequenceDiv.className = 'sequence';
            const suit = this.game.completedSequenceSuits[i] || 'spades';
            sequenceDiv.dataset.suit = suit;
            sequenceDiv.dataset.rank = 'K';
            sequenceDiv.innerText = 'K';
            console.log(suit);
            sequenceDiv.style.backgroundImage = `url(/img/${suit}.png)`;
            sequencesDiv.appendChild(sequenceDiv);
        }
        this.subcontainer.appendChild(sequencesDiv);

        // Рендеримо сток
        const stockDiv = document.createElement('div');
        stockDiv.className = 'stock';
        for (let i = 0; i < this.game.stock.dealsLeft; i++) {
            const additionalDeckDiv = document.createElement('div');
            additionalDeckDiv.className = 'additional-deck';
            stockDiv.appendChild(additionalDeckDiv);
        }
        this.subcontainer.appendChild(stockDiv);

        
    }
}