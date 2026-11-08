import React from 'react';
import { Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Rank, Suit } from '../../game-logic/types';

interface CardProps {
    suit: Suit;
    rank: Rank;
    onPlay?: () => void;
    isPlayable?: boolean;
}

const SUIT_COLORS = {
    S: 'text-secondary', // Spades - Cyan
    H: 'text-accent',    // Hearts - Pink
    D: 'text-orange-400',// Diamonds - Orange
    C: 'text-green-400', // Clubs - Green
};

const SUIT_SYMBOLS = {
    S: '♠',
    H: '♥',
    D: '♦',
    C: '♣',
};

export const Card = ({ suit, rank, onPlay, isPlayable = true }: CardProps) => {
    const offset = useSharedValue({ x: 0, y: 0 });
    const start = useSharedValue({ x: 0, y: 0 });

    const gesture = Gesture.Pan()
        .onStart(() => {
            start.value = { x: offset.value.x, y: offset.value.y };
        })
        .onUpdate((e) => {
            offset.value = {
                x: e.translationX + start.value.x,
                y: e.translationY + start.value.y,
            };
        })
        .onEnd(() => {
            if (offset.value.y < -100 && isPlayable && onPlay) {
                runOnJS(onPlay)();
                offset.value = withSpring({ x: 0, y: -500 }); // Fly away
            } else {
                offset.value = withSpring({ x: 0, y: 0 });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: offset.value.x },
            { translateY: offset.value.y },
            { rotate: withSpring(`${offset.value.x / 10}deg`) }
        ],
        zIndex: offset.value.y !== 0 ? 100 : 1,
    }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                className={`w-24 h-36 bg-surface border-2 border-white/20 rounded-xl justify-between p-2 shadow-lg ${isPlayable ? 'opacity-100' : 'opacity-50'}`}
                style={animatedStyle}
            >
                <Text className={`text-lg font-bold ${SUIT_COLORS[suit]}`}>
                    {rank}
                </Text>
                <Text className={`text-4xl text-center ${SUIT_COLORS[suit]}`}>
                    {SUIT_SYMBOLS[suit]}
                </Text>
                <Text className={`text-lg font-bold text-right ${SUIT_COLORS[suit]} rotate-180`}>
                    {rank}
                </Text>
            </Animated.View>
        </GestureDetector>
    );
};
