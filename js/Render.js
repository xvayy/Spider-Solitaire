import { Rules } from './Rules.js';

export class Renderer {
    constructor(game, containerId, subcontainerId) {
        this.game = game;
        this.container = document.getElementById(containerId);
        this.subcontainer = document.getElementById(subcontainerId);
        this.fireworksContainer = document.querySelector('.fireworks')
        this.fireworks = new Fireworks.default(this.fireworksContainer)
    }

    // Рендеримо колонки з картами
    renderColums() {
        const columnsDiv = document.createElement('div');
        columnsDiv.className = 'columns';

        const emptyColumns = Rules.isColumnEmpty(this.game);
        console.log(emptyColumns);
        
        this.game.columns.forEach((column, colIndex) => {
            const columnWrapper = document.createElement('div');
            columnWrapper.className = 'column-wrapper';
            columnWrapper.dataset.index = colIndex;

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
                cardDiv.style.backgroundImage = !card.isFaceUp ? `url(/img/card-back-${this.game.cardStyle.value}.png)` : `url(/img/${card.suit}.png)`;
                columnDiv.appendChild(cardDiv);
            });

            columnWrapper.appendChild(columnDiv);
            columnsDiv.appendChild(columnWrapper);

            if (emptyColumns.includes(colIndex)) {
                columnWrapper.classList.add('empty-column');
            }
        });
        this.container.appendChild(columnsDiv);
    }

    // Cток
    renderStock() {
        const stockDiv = document.createElement('div');
        stockDiv.className = 'stock';
        for (let i = 0; i < this.game.stock.dealsLeft; i++) {
            const additionalDeckDiv = document.createElement('div');
            additionalDeckDiv.className = 'additional-deck';
            additionalDeckDiv.style.backgroundImage = `url(./img/card-back-${this.game.cardStyle.value}.png)`;
            stockDiv.appendChild(additionalDeckDiv);
        }
        this.subcontainer.appendChild(stockDiv);
    }

    // Зібрані послідовності
    renderCompletedSequences() {
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
    }

    // Кількість ходів
    renderMovesCounter() {
        const movesCounter = document.querySelector("#moves span")
        movesCounter.innerText = this.game.movesCounter;
    }
    
    // Рахунок 
    renderScoreCounter() {
        const scoreCounter = document.querySelector("#score span")
        scoreCounter.innerText = this.game.scoreCounter;
    }
    
    renderFireworks() {
        // document.querySelector(".fireworks").style.display = "block"
        // const container = document.querySelector('.fireworks')
        // const fireworks = new Fireworks.default(container)
        this.fireworksContainer.style.display = 'block'
        this.fireworks.start()
        // document.querySelector(".modal-window").style.display = "block"
    }

    pauseRenderingFireworks(){
        this.fireworksContainer.style.display = 'none'
        // this.fireworks.pause()
    }

    render() {
        this.container.innerHTML = '';
        this.subcontainer.innerHTML = '';
        this.pauseRenderingFireworks();

        this.renderColums();
        this.renderCompletedSequences();
        this.renderStock();
        this.renderMovesCounter();
        this.renderScoreCounter();
        if (this.game.isGameWon()){
            this.renderFireworks() 
        }
        
    }
    
    
}