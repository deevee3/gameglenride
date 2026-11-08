export type Suit = 'S' | 'H' | 'D' | 'C';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardModel {
    id: string;
    suit: Suit;
    rank: Rank;
}

export interface Player {
    id: string;
    name: string;
    hand: CardModel[];
    bid: number;
    tricks: number;
    score: number;
    team: 'A' | 'B'; // For 2v2
}

export interface TrickCard {
    card: CardModel;
    playerId: string;
}

export interface GameState {
    phase: 'BIDDING' | 'PLAYING' | 'SCORING' | 'GAME_OVER';
    deck: CardModel[];
    players: Player[];
    currentTurn: number; // Index of player in players array
    trick: TrickCard[];
    trump: Suit;
    
    startGame: () => void;
    playCard: (playerId: string, cardId: string) => void;
    setBid: (playerId: string, bid: number) => void;
}
