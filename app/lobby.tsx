import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function LobbyScreen() {
    return (
        <View className="flex-1 bg-surface p-6 pt-16">
            <Text className="text-3xl font-bold text-white mb-8">LOBBY</Text>

            <ScrollView className="flex-1">
                {[1, 2, 3].map((room) => (
                    <TouchableOpacity
                        key={room}
                        className="bg-primary p-6 rounded-2xl mb-4 border border-secondary/30 flex-row justify-between items-center"
                        onPress={() => router.push(`/game/${room}`)}
                    >
                        <View>
                            <Text className="text-white font-bold text-lg">Room #{room}</Text>
                            <Text className="text-gray-400">3/4 Players</Text>
                        </View>
                        <Text className="text-secondary font-bold">JOIN</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity
                className="bg-secondary p-4 rounded-xl items-center mt-4"
                onPress={() => router.back()}
            >
                <Text className="text-primary font-bold text-lg">BACK</Text>
            </TouchableOpacity>
        </View>
    );
}
