import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { aiService } from '../services/ai';

const chatMessageSchema = z.object({
    conversation_id: z.string().uuid().optional(),
    message: z.string(),
});

export default async function chatRoutes(fastify: FastifyInstance) {
    fastify.post('/chat/start', async (request, reply) => {
        const { data, error } = await fastify.supabaseAdmin
            .from('conversations')
            .insert({ user_id: request.user_id, title: 'New Conversation' })
            .select()
            .single();

        if (error) return reply.code(500).send(error);
        return data;
    });

    fastify.post('/chat/message', async (request, reply) => {
        const { conversation_id, message } = chatMessageSchema.parse(request.body);

        // 1. Get Context
        const { data: profile } = await fastify.supabaseAdmin.from('profiles').select('*').eq('user_id', request.user_id).single();
        const { data: targets } = await fastify.supabaseAdmin.from('target_settings').select('*').eq('user_id', request.user_id).order('created_at', { ascending: false }).limit(1).single();

        // Last 7 days summary for charts
        const { data: history } = await fastify.supabaseAdmin
            .from('daily_stats')
            .select('*')
            .eq('user_id', request.user_id)
            .order('date_key', { ascending: false })
            .limit(14);

        const contextData = { profile, targets, history };

        // 2. Load Conversation History
        const { data: messages } = await fastify.supabaseAdmin
            .from('conversation_messages')
            .select('role, content')
            .eq('conversation_id', conversation_id)
            .order('created_at', { ascending: true });

        const chatHistory = (messages || []).map(m => ({ role: m.role, content: m.content }));
        const currentMessage = { role: 'user', content: message };

        // 3. Save User Message
        await fastify.supabaseAdmin.from('conversation_messages').insert({
            conversation_id,
            user_id: request.user_id,
            role: 'user',
            content: message
        });

        // 4. Call AI
        const aiResponse = await aiService.chat([...chatHistory, currentMessage], contextData);

        // 5. Handle Tool Calls
        let toolResults = [];
        if (aiResponse.tool_calls) {
            for (const toolCall of aiResponse.tool_calls) {
                const { name, arguments: argsJson } = toolCall.function;
                const args = JSON.parse(argsJson);

                // Handle tool logic
                const dateKey = args.date || new Date().toISOString().split('T')[0];

                if (name === 'log_steps') {
                    await fastify.supabaseAdmin.from('daily_stats').upsert({ user_id: request.user_id, date_key: dateKey, steps: args.steps }, { onConflict: 'user_id,date_key' });
                } else if (name === 'log_sleep') {
                    await fastify.supabaseAdmin.from('daily_stats').upsert({ user_id: request.user_id, date_key: dateKey, sleep_hours: args.hours }, { onConflict: 'user_id,date_key' });
                } else if (name === 'log_weight') {
                    await fastify.supabaseAdmin.from('daily_stats').upsert({ user_id: request.user_id, date_key: dateKey, weight_kg: args.weight_kg }, { onConflict: 'user_id,date_key' });
                    // Also update profile
                    await fastify.supabaseAdmin.from('profiles').update({ weight_kg: args.weight_kg }).eq('user_id', request.user_id);
                } else if (name === 'log_meal_text') {
                    // For text meals, we create a draft
                    await fastify.supabaseAdmin.from('meals').insert({ user_id: request.user_id, date_key: dateKey, status: 'draft', source: 'chat' });
                }

                toolResults.push({ tool: name, args });
            }
        }

        // 6. Save Assistant Response
        await fastify.supabaseAdmin.from('conversation_messages').insert({
            conversation_id,
            user_id: request.user_id,
            role: 'assistant',
            content: aiResponse.content || '',
            structured_json: { toolResults }
        });

        return {
            assistantText: aiResponse.content,
            todaySummary: contextData.history?.[0] || { steps: 0, sleep_hours: 0 },
            targets: contextData.targets,
            chartData: {
                labels: (history || []).map(h => h.date_key).reverse(),
                steps: (history || []).map(h => h.steps).reverse(),
                sleep: (history || []).map(h => h.sleep_hours).reverse(),
            }
        };
    });
}
