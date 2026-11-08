import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function LandingScreen() {
    return (
        <View className="flex-1 bg-primary justify-center items-center">
            <Text className="text-5xl font-bold text-secondary mb-4 shadow-lg shadow-secondary">NEON SPADES</Text>
            <Text className="text-2xl text-white mb-16 tracking-[0.5em] font-light">CYBER-BET</Text>

            <TouchableOpacity
                className="bg-accent px-10 py-5 rounded-full mb-6 w-72 items-center shadow-md shadow-accent"
                onPress={() => router.push('/lobby')}
            >
                <Text className="text-white font-bold text-xl">PLAY NOW</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-transparent border-2 border-secondary px-10 py-5 rounded-full w-72 items-center">
                <Text className="text-secondary font-bold text-xl">SETTINGS</Text>
            </TouchableOpacity>
        </View>
    );
}
