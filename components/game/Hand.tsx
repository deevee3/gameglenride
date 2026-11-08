import React from 'react';
import { ScrollView, View } from 'react-native';
import { Rank, Suit } from '../../game-logic/types';
import { Card } from './Card';

interface HandProps {
    cards: { id: string; suit: Suit; rank: Rank }[];
    onPlayCard: (id: string) => void;
    isMyTurn: boolean;
}

export const Hand = ({ cards, onPlayCard, isMyTurn }: HandProps) => {
    return (
        <View className="absolute bottom-4 left-0 right-0 h-48 justify-center items-center">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, alignItems: 'flex-end' }}
                className="flex-grow-0"
            >
                {cards.map((card, index) => (
                    <View key={card.id} style={{ marginLeft: index === 0 ? 0 : -40 }}>
                        <Card
                            suit={card.suit}
                            rank={card.rank}
                            onPlay={() => onPlayCard(card.id)}
                            isPlayable={isMyTurn}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};
