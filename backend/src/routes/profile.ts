import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { calculateTargets } from '../utils/nutrition';

const profileSchema = z.object({
    full_name: z.string().optional(),
    age: z.number().int().optional(),
    gender: z.enum(['M', 'F']).optional(),
    goal: z.enum(['muscle', 'fatloss']).optional(),
    height_cm: z.number().int().optional(),
    weight_kg: z.number().optional(),
});

export default async function profileRoutes(fastify: FastifyInstance) {
    fastify.get('/me', async (request, reply) => {
        const { data: profile, error: pError } = await fastify.supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('user_id', request.user_id)
            .single();

        if (pError || !profile) {
            return reply.code(404).send({ error: 'Profile not found' });
        }

        const { data: targets } = await fastify.supabaseAdmin
            .from('target_settings')
            .select('*')
            .eq('user_id', request.user_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        const today = new Date().toISOString().split('T')[0];
        const { data: todayStats } = await fastify.supabaseAdmin
            .from('daily_stats')
            .select('*')
            .eq('user_id', request.user_id)
            .eq('date_key', today)
            .single();

        const { data: todayMeals } = await fastify.supabaseAdmin
            .from('meals')
            .select('*, meal_items(*)')
            .eq('user_id', request.user_id)
            .eq('date_key', today);

        return {
            profile,
            targets,
            todaySummary: todayStats || { steps: 0, sleep_hours: 0 },
            todayMeals: todayMeals || []
        };
    });

    fastify.post('/profile', async (request, reply) => {
        const body = profileSchema.parse(request.body);

        const { data: profile, error: pError } = await fastify.supabaseAdmin
            .from('profiles')
            .upsert({ user_id: request.user_id, ...body, updated_at: new Date().toISOString() })
            .select()
            .single();

        if (pError) return reply.code(500).send(pError);

        // Compute targets
        if (profile.weight_kg && profile.height_cm && profile.age && profile.gender && profile.goal) {
            const targets = calculateTargets(profile as any);

            await fastify.supabaseAdmin.from('target_settings').insert({
                user_id: request.user_id,
                ...targets,
                inputs_json: body
            });

            return { profile, targets };
        }

        return { profile };
    });
}
