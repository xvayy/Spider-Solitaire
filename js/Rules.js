export const Rules = {
    canMoveCard(card, target) {
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        return ranks.indexOf(card.rank) === ranks.indexOf(target.rank) - 1;
    },

    isSequence(cards) {
        if (cards.length === 0) return false;
        
        // Перевіряємо, що всі карти однієї масті
        const firstSuit = cards[0].suit;
        const sameSuit = cards.every(card => card.suit === firstSuit);
        if (!sameSuit) return false;

        // Перевіряємо послідовність рангів
        for (let i = 1; i < cards.length; i++) {
            if (!this.canMoveCard(cards[i], cards[i - 1])) {
                return false;
            }
        }
        return true;
    },

    isFullSequence(cards) {
        if (cards.length !== 13) return false;
        const ranks = ["K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2", "A"];
        return cards.every((card, i) => card.rank === ranks[i] && card.suit === cards[0].suit);
    },

    isColumnEmpty(game) {
        const emptyColumms = [];
        game.columns.forEach((column, index) => {
            if (column.cards.length === 0) {
                emptyColumms.push(index);
            }
        });
        return emptyColumms;
    },

    moveCards(fromColumn, toColumn, startIndex, game) {
        game.saveState();
        const cardsToMove = fromColumn.removeCards(startIndex);
        if (this.isSequence(cardsToMove)) {
            cardsToMove.forEach(card => toColumn.addCard(card));
            if (fromColumn.cards.length > 0) {
                fromColumn.getTopCard().isFaceUp = true;
            }
            if (this.isFullSequence(toColumn.cards.slice(-13))) {
                const completedSuit = toColumn.cards[toColumn.cards.length - 13].suit;
                toColumn.cards.splice(-13);
                game.completedSequences++;
                game.completedSequenceSuits.push(completedSuit);
                game.movesCounter++;
                game.scoreCounter += 100;
                game.saveCurrentGame();
                if (toColumn.cards.length > 0) {
                    toColumn.getTopCard().isFaceUp = true;
                }
                if (game.isGameWon()) {
                    renderer.renderFireworks();
                }
            }
            game.movesCounter++;
            game.scoreCounter -= 1;
            game.saveCurrentGame();
            return true;
        } else {
            // Повертаємо карти назад, якщо хід невалідний
            cardsToMove.forEach(card => fromColumn.addCard(card));
            return false;
        }
    }
};