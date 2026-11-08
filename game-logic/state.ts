import { create } from 'zustand';
import { createDeck, dealCards, getTrickWinner, shuffleDeck } from './engine';
import { GameState } from './types';

export const useGameStore = create<GameState>((set, get) => ({
    phase: 'BIDDING',
    deck: [],
    players: [],
    currentTurn: 0,
    trick: [],
    trump: 'S',

    startGame: () => {
        const deck = shuffleDeck(createDeck());
        const hands = dealCards(deck, 4);
        const players = hands.map((hand, index) => ({
            id: `player-${index}`,
            name: index === 0 ? 'You' : `Bot ${index}`,
            hand: hand.sort((a, b) => { // Sort by suit then rank
                 if (a.suit !== b.suit) return a.suit.localeCompare(b.suit);
                 return 0; // Simplified sort for now
            }),
            bid: 0,
            tricks: 0,
            score: 0,
            team: (index % 2 === 0 ? 'A' : 'B') as 'A' | 'B',
        }));
        set({ 
            deck, 
            players, 
            currentTurn: 0, 
            phase: 'BIDDING',
            trick: [],
            trump: 'S'
        });
    },

    setBid: (playerId, bid) => {
        const { players } = get();
        const newPlayers = players.map(p => p.id === playerId ? { ...p, bid } : p);
        
        // If it's the human player (player-0), let's auto-bid for bots and start playing
        if (playerId === 'player-0') {
             const playersWithBotBids = newPlayers.map(p => {
                 if (p.id !== 'player-0') {
                     return { ...p, bid: 3 }; // Bots bid 3 blindly
                 }
                 return p;
             });
             set({ players: playersWithBotBids, phase: 'PLAYING' });
        } else {
             set({ players: newPlayers });
        }
    },

    playCard: (playerId, cardId) => {
        const { players, currentTurn, trick, trump } = get();
        const playerIndex = players.findIndex(p => p.id === playerId);
        
        // Validation
        if (playerIndex !== currentTurn) return; // Not your turn
        if (players[playerIndex].id !== playerId) return;

        const player = players[playerIndex];
        const card = player.hand.find(c => c.id === cardId);
        if (!card) return;

        // Remove card from hand
        const newHand = player.hand.filter(c => c.id !== cardId);
        const newPlayers = [...players];
        newPlayers[playerIndex] = { ...player, hand: newHand };

        // Add to trick
        const newTrick = [...trick, { card, playerId }];

        // Check if trick is complete
        if (newTrick.length === 4) {
            // Determine winner
            const winnerId = getTrickWinner(newTrick, trump);
            const winnerIndex = newPlayers.findIndex(p => p.id === winnerId);
            
            newPlayers[winnerIndex].tricks += 1;
            
            set({ players: newPlayers, trick: newTrick });

            // Clear trick after delay
            setTimeout(() => {
                set((state) => ({
                    trick: [],
                    currentTurn: winnerIndex // Winner leads next trick
                }));
            }, 1500);

        } else {
            // Next turn
            const nextTurn = (currentTurn + 1) % 4;
            set({ players: newPlayers, trick: newTrick, currentTurn: nextTurn });
        }
    },
}));
