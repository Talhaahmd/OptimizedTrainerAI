import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './prompts';
import { TOOLS } from './tools';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const aiService = {
    async chat(messages: any[], contextData: any) {
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT + '\n\nCONTEXT:\n' + JSON.stringify(contextData) },
                ...messages,
            ],
            tools: TOOLS,
            tool_choice: 'auto',
        });

        return response.choices[0].message;
    },
};
