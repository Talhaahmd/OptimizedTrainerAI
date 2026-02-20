import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Theme } from '../constants/Theme';
import { useAppContext } from '../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { ChatBubble } from '../components/ChatBubble';
import { ChatInput } from '../components/ChatInput';

export default function OptimizeScreen() {
    const { chats, addChatMessage } = useAppContext();
    const navigation = useNavigation<any>();
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        const msg = inputText;
        setInputText('');
        await addChatMessage(msg, 'user');

        // Auto scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={Theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Optimize AI Coach</Text>
                <View style={{ width: 44 }} />
            </View>
            <View style={styles.divider} />

            {/* Message List */}
            <FlatList
                ref={flatListRef}
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ChatBubble content={item.content} role={item.role} />
                )}
                contentContainerStyle={styles.listContent}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Input */}
            <ChatInput
                value={inputText}
                onChangeText={setInputText}
                onSend={handleSend}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        color: Theme.colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: Theme.colors.border,
    },
    listContent: {
        paddingHorizontal: Theme.spacing.screenPadding,
        paddingVertical: 16,
    },
});
