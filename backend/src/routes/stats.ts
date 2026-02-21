import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { calculateTargets } from '../utils/nutrition';

const statsSchema = z.object({
    steps: z.number().int().optional(),
    sleep_hours: z.number().optional(),
    weight_kg: z.number().optional(),
    date: z.string().optional(),
});

export default async function statsRoutes(fastify: FastifyInstance) {
    fastify.post('/stats/steps', async (request, reply) => {
        const { steps, date } = statsSchema.parse(request.body);
        const dateKey = date || new Date().toISOString().split('T')[0];

        const { data, error } = await fastify.supabaseAdmin
            .from('daily_stats')
            .upsert({ user_id: request.user_id, date_key: dateKey, steps }, { onConflict: 'user_id,date_key' })
            .select()
            .single();

        if (error) return reply.code(500).send(error);
        return data;
    });

    fastify.post('/stats/sleep', async (request, reply) => {
        const { sleep_hours, date } = statsSchema.parse(request.body);
        const dateKey = date || new Date().toISOString().split('T')[0];

        const { data, error } = await fastify.supabaseAdmin
            .from('daily_stats')
            .upsert({ user_id: request.user_id, date_key: dateKey, sleep_hours }, { onConflict: 'user_id,date_key' })
            .select()
            .single();

        if (error) return reply.code(500).send(error);
        return data;
    });

    fastify.post('/stats/weight', async (request, reply) => {
        const { weight_kg, date } = statsSchema.parse(request.body);
        const dateKey = date || new Date().toISOString().split('T')[0];

        // 1. Update daily stats
        const { error: sError } = await fastify.supabaseAdmin
            .from('daily_stats')
            .upsert({ user_id: request.user_id, date_key: dateKey, weight_kg }, { onConflict: 'user_id,date_key' });

        if (sError) return reply.code(500).send(sError);

        // 2. Update profile weight and recompute targets
        const { data: profile, error: pError } = await fastify.supabaseAdmin
            .from('profiles')
            .update({ weight_kg, updated_at: new Date().toISOString() })
            .eq('user_id', request.user_id)
            .select()
            .single();

        if (pError) return reply.code(500).send(pError);

        if (profile.height_cm && profile.age && profile.gender && profile.goal) {
            const targets = calculateTargets(profile as any);
            await fastify.supabaseAdmin.from('target_settings').insert({
                user_id: request.user_id,
                ...targets,
                inputs_json: { weight_kg, trigger: 'weight_update' }
            });
            return { profile, targets };
        }

        return { profile };
    });
}
