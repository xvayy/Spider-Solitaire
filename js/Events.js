import { Rules } from './Rules.js';

export class EventHandler {
    constructor(game, renderer) {
        this.game = game;
        this.renderer = renderer;
    }

    init() {
        this.container = document.getElementById('cards');
        this.subcontainer = document.getElementById('additional-cards');

        this.subcontainer.addEventListener('click', this.handleClick.bind(this));
        this.container.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.container.addEventListener('dragover', this.handleDragOver.bind(this));
        this.container.addEventListener('drop', this.handleDrop.bind(this));
    }

    handleClick(event) {
        if (event.target.classList.contains('additional-deck')) {
            if (this.game.stock.dealCards(this.game.columns)) {
                this.renderer.render(); 
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

            // Отримуємо карти, які перетягуємо
            const cardsToMove = fromColumn.cards.slice(data.cardIndex);
            const bottomCard = cardsToMove[0]; // Нижня карта перетягуваної групи

            // Перевіряємо валідність цільової карти
            let isValidTarget = false;
            if (toColumn.cards.length === 0) {
                // Порожня колонка — завжди валідна ціль
                isValidTarget = true;
            } else {
                const targetCard = toColumn.getTopCard(); // Верхня карта цільової колонки
                // Перевіряємо, чи нижня карта перетягуваної групи на 1 менша за цільову
                isValidTarget = Rules.canMoveCard(bottomCard, targetCard);
            }

            // Виконуємо хід, якщо ціль валідна і карти утворюють послідовність
            if (isValidTarget && Rules.moveCards(fromColumn, toColumn, data.cardIndex, this.game)) {
                this.renderer.render();
                if (this.game.completedSequences === 8) {
                    alert('You won!');
                }
            }
        }
    }
}