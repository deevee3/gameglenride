import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useGameStore } from '../../game-logic/state';
import { Card } from './Card';
import { Hand } from './Hand';

const actionButtons = [
    { label: 'MIN', variant: 'ghost' as const },
    { label: 'HALF', variant: 'ghost' as const },
    { label: 'CHECK', variant: 'ghost' as const },
    { label: 'FOLD', variant: 'danger' as const },
    { label: 'CALL', variant: 'ghost' as const },
    { label: 'RAISE', variant: 'primary' as const },
];

export const GameTable = () => {
    const { players, startGame, playCard, trick, currentTurn, phase, setBid } = useGameStore();
    const myPlayer = players[0]; 

    useEffect(() => {
        startGame();
    }, [startGame]);

    // Bot Logic
    useEffect(() => {
        if (phase === 'PLAYING' && currentTurn !== 0 && players[currentTurn]) {
            const botId = players[currentTurn].id;
            const timer = setTimeout(() => {
                const botHand = players[currentTurn].hand;
                let cardToPlay = botHand[0];
                
                // Follow suit logic
                if (trick.length > 0) {
                    const leadSuit = trick[0].card.suit;
                    const followSuitCards = botHand.filter(c => c.suit === leadSuit);
                    if (followSuitCards.length > 0) {
                        cardToPlay = followSuitCards[0]; // Simplest AI: play first valid card
                    }
                }
                
                if (cardToPlay) {
                    playCard(botId, cardToPlay.id);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentTurn, phase, trick, players, playCard]);

    if (!myPlayer) {
        return (
            <View className="flex-1 bg-primary justify-center items-center">
                <Text className="text-white">Loading table...</Text>
            </View>
        );
    }

    const renderOpponent = (index: number, position: 'top' | 'left' | 'right') => {
        const player = players[index];
        if (!player) return null;

        const isTurn = currentTurn === index;
        const containerStyles = [styles.opponentBase, styles[position]];

        return (
            <View key={player.id} style={containerStyles}>
                <View
                    className={`w-16 h-16 rounded-full bg-surface-light items-center justify-center border ${
                        isTurn ? 'border-secondary shadow-lg shadow-secondary/40' : 'border-white/10'
                    }`}
                >
                    <Text className="text-white font-semibold text-lg">{player.name.charAt(0)}</Text>
                </View>
                <Text className="text-white font-bold mt-2">{player.name}</Text>
                <Text className="text-text-muted text-xs">
                    Bid {player.bid || '—'} · Tricks {player.tricks}
                </Text>
                <View className="flex-row mt-1">
                    {Array.from({ length: Math.min(player.hand.length, 4) }).map((_, idx) => (
                        <View key={idx} className="w-4 h-6 bg-surface-glow rounded-sm -ml-1 border border-white/10" />
                    ))}
                </View>
            </View>
        );
    };

    const renderActionButton = (label: string, variant: 'ghost' | 'danger' | 'primary') => {
        const baseStyles =
            variant === 'primary'
                ? 'bg-secondary'
                : variant === 'danger'
                ? 'bg-danger/80'
                : 'border border-white/15';
        const textStyles = variant === 'primary' ? 'text-primary' : 'text-white';

        return (
            <TouchableOpacity
                key={label}
                className={`px-4 py-2 rounded-full ${baseStyles}`}
                onPress={() => {}}
                activeOpacity={0.8}
            >
                <Text className={`text-xs font-semibold tracking-[0.3em] ${textStyles}`}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-primary">
            <View pointerEvents="none" className="absolute inset-0 opacity-50">
                <View className="absolute -top-10 left-8 w-56 h-56 bg-surface-glow rounded-full" />
                <View className="absolute top-1/3 -right-16 w-72 h-72 bg-surface rounded-full" />
                <View className="absolute bottom-0 left-1/4 w-60 h-60 bg-surface-light rounded-full" />
            </View>

            <View className="flex-1 px-4 pb-44">
                <View className="flex-row items-center justify-between pt-4">
                    <TouchableOpacity
                        className="bg-surface/80 w-12 h-12 rounded-full items-center justify-center border border-white/10"
                        onPress={() => router.back()}
                        activeOpacity={0.9}
                    >
                        <Text className="text-white text-xl">≡</Text>
                    </TouchableOpacity>

                    <View className="items-center">
                        <Text className="text-text-muted text-xs uppercase tracking-[0.5em]">Cyber Table</Text>
                        <Text className="text-secondary text-2xl font-black">Neon Spades</Text>
                    </View>

                    <View className="bg-surface-light px-4 py-2 rounded-2xl border border-secondary/30 items-center">
                        <Text className="text-text-muted text-xs">Vault</Text>
                        <Text className="text-white font-semibold">$54,500</Text>
                    </View>
                </View>

                <View className="flex-1 mt-2 items-center justify-center">
                    <View style={styles.arena} className="relative">
                        <View className="absolute inset-0 bg-surface rounded-[220px] border-4 border-secondary/40 opacity-90" />
                        <View className="absolute inset-6 bg-surface-light rounded-[200px] border border-white/10" />
                        <View className="absolute inset-14 bg-surface-glow rounded-[180px] border border-white/5" />
                        <View className="absolute inset-x-24 inset-y-16 border border-dashed border-white/10 rounded-[140px]" />

                        {renderOpponent(2, 'top')}
                        {renderOpponent(1, 'left')}
                        {renderOpponent(3, 'right')}

                        <View className="absolute inset-0 items-center justify-center pointer-events-none">
                            {trick.map((t, i) => {
                                const playerIndex = players.findIndex(p => p.id === t.playerId);
                                let rotation = '0deg';
                                let translateX = 0;
                                let translateY = 0;

                                if (playerIndex === 0) { translateY = 60; rotation = '0deg'; }
                                else if (playerIndex === 1) { translateX = -90; rotation = '90deg'; }
                                else if (playerIndex === 2) { translateY = -90; rotation = '180deg'; }
                                else if (playerIndex === 3) { translateX = 90; rotation = '-90deg'; }

                                return (
                                    <View
                                        key={`${t.playerId}-${i}`}
                                        className="absolute"
                                        style={{ transform: [{ translateX }, { translateY }, { rotate: rotation }] }}
                                    >
                                        <Card suit={t.card.suit} rank={t.card.rank} isPlayable={false} />
                                    </View>
                                );
                            })}
                        </View>

                        <View style={styles.centerBadge} className="items-center">
                            <Text className="text-text-muted text-xs uppercase tracking-[0.6em]">Trick</Text>
                            <Text className="text-white text-lg font-semibold">{trick.length} / 4 cards</Text>
                        </View>
                    </View>
                </View>

                <View className="items-center">
                    <View className="bg-surface-light/80 border border-secondary/30 px-6 py-4 rounded-3xl items-center">
                        <Text className="text-white text-lg font-semibold">{myPlayer.name}</Text>
                        <Text className="text-text-muted text-sm">
                            Bid {myPlayer.bid || '—'} · Tricks {myPlayer.tricks} · Score {myPlayer.score}
                        </Text>
                        <Text className="text-secondary text-xs mt-1 uppercase tracking-[0.4em]">
                            {phase === 'BIDDING' ? 'Place your bid' : currentTurn === 0 ? 'Your turn' : 'Waiting'}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="absolute bottom-40 left-0 right-0 px-6">
                <View className="bg-surface/90 border border-white/10 rounded-full px-4 py-3 flex-row flex-wrap justify-center gap-3">
                    {actionButtons.map((btn) => renderActionButton(btn.label, btn.variant))}
                </View>
            </View>

            <Hand
                cards={myPlayer.hand}
                onPlayCard={(id) => playCard(myPlayer.id, id)}
                isMyTurn={phase === 'PLAYING' && currentTurn === 0}
            />

            {phase === 'BIDDING' && (
                <View className="absolute inset-0 items-center justify-center px-6">
                    <View className="w-full max-w-md bg-surface-light/95 p-6 rounded-3xl border border-secondary/40">
                        <Text className="text-white text-2xl font-bold text-center mb-2">Place Your Bid</Text>
                        <Text className="text-text-muted text-center mb-4">
                            Choose how many tricks you and your partner will claim.
                        </Text>
                        <View className="flex-row flex-wrap justify-center gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((bid) => (
                                <TouchableOpacity
                                    key={bid}
                                    className="bg-surface px-4 py-2 rounded-full border border-white/10"
                                    onPress={() => setBid(myPlayer.id, bid)}
                                >
                                    <Text className="text-white font-semibold">{bid}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                className="bg-secondary px-6 py-2 rounded-full"
                                onPress={() => setBid(myPlayer.id, 0)}
                            >
                                <Text className="text-primary font-bold">NIL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    arena: {
        width: '100%',
        maxWidth: 900,
        aspectRatio: 4 / 3,
        alignSelf: 'center',
    },
    opponentBase: {
        position: 'absolute',
        alignItems: 'center',
    },
    top: {
        top: -24,
        alignSelf: 'center',
    },
    left: {
        left: -10,
        top: '34%',
        alignItems: 'flex-start',
    },
    right: {
        right: -10,
        top: '34%',
        alignItems: 'flex-end',
    },
    centerBadge: {
        position: 'absolute',
        bottom: -40,
        alignSelf: 'center',
    },
});
