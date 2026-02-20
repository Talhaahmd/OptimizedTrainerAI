import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Theme } from '../constants/Theme';
import { ArrowUp } from 'lucide-react-native';

interface ChatInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ value, onChangeText, onSend }) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            style={styles.container}
        >
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask me anything..."
                    placeholderTextColor={Theme.colors.subtext}
                    value={value}
                    onChangeText={onChangeText}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, !value.trim() && styles.disabledButton]}
                    onPress={onSend}
                    disabled={!value.trim()}
                >
                    <ArrowUp size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.colors.card,
        borderTopWidth: 1,
        borderTopColor: Theme.colors.border,
        paddingHorizontal: Theme.spacing.screenPadding,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.cardSecondary,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 12,
    },
    input: {
        flex: 1,
        color: Theme.colors.text,
        fontSize: 16,
        maxHeight: 100,
        paddingVertical: 8,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
});
