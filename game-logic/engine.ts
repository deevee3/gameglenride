import { CardModel, Rank, Suit } from './types';

export const SUITS: Suit[] = ['S', 'H', 'D', 'C'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = (): CardModel[] => {
    const deck: CardModel[] = [];
    let id = 0;
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({ id: `${id++}`, suit, rank });
        }
    }
    return deck;
};

export const shuffleDeck = (deck: CardModel[]): CardModel[] => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
};

export const dealCards = (deck: CardModel[], numPlayers: number = 4): CardModel[][] => {
    const hands: CardModel[][] = Array.from({ length: numPlayers }, () => []);
    deck.forEach((card, index) => {
        hands[index % numPlayers].push(card);
    });
    return hands;
};

export const getTrickWinner = (trick: { card: CardModel; playerId: string }[], trumpSuit: Suit): string => {
    if (trick.length === 0) return '';

    const leadSuit = trick[0].card.suit;
    let winningCard = trick[0];

    for (let i = 1; i < trick.length; i++) {
        const current = trick[i];
        const isTrump = current.card.suit === trumpSuit;
        const isWinningTrump = winningCard.card.suit === trumpSuit;

        if (isTrump) {
            if (!isWinningTrump) {
                winningCard = current;
            } else {
                // Both are trumps, compare ranks
                if (compareRanks(current.card.rank, winningCard.card.rank) > 0) {
                    winningCard = current;
                }
            }
        } else if (current.card.suit === leadSuit) {
            if (!isWinningTrump) {
                 if (compareRanks(current.card.rank, winningCard.card.rank) > 0) {
                    winningCard = current;
                }
            }
        }
    }

    return winningCard.playerId;
};

const RANK_VALUES: Record<Rank, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

const compareRanks = (r1: Rank, r2: Rank): number => {
    return RANK_VALUES[r1] - RANK_VALUES[r2];
};
