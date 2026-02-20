import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';

interface ChatBubbleProps {
    content: string;
    role: 'user' | 'assistant';
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ content, role }) => {
    const isUser = role === 'user';

    return (
        <View style={[
            styles.container,
            isUser ? styles.userContainer : styles.assistantContainer
        ]}>
            <View style={[
                styles.bubble,
                isUser ? styles.userBubble : styles.assistantBubble
            ]}>
                <Text style={styles.text}>{content}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 6,
        flexDirection: 'row',
    },
    userContainer: {
        justifyContent: 'flex-end',
    },
    assistantContainer: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '75%',
        padding: 14,
        borderRadius: 16,
    },
    userBubble: {
        backgroundColor: Theme.colors.cardSecondary,
        borderTopRightRadius: 4,
    },
    assistantBubble: {
        backgroundColor: Theme.colors.card,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderTopLeftRadius: 4,
    },
    text: {
        color: Theme.colors.text,
        fontSize: 15,
        lineHeight: 22,
    },
});
