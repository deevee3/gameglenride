import { router, useLocalSearchParams } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { GameTable } from '../../components/game/GameTable';

export default function GameScreen() {
    const { id } = useLocalSearchParams();

    return (
        <View className="flex-1 bg-primary">
            <View className="absolute top-12 left-4 z-10">
                <TouchableOpacity
                    className="bg-surface/50 p-2 rounded-full"
                    onPress={() => router.back()}
                >
                    <Text className="text-white font-bold">BACK</Text>
                </TouchableOpacity>
            </View>

            <GameTable />
        </View>
    );
}
