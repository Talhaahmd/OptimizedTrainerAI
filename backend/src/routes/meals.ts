import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { aiService } from '../services/ai';

const draftSchema = z.object({
    photo_path: z.string(),
    date: z.string().optional(),
});

const confirmSchema = z.object({
    meal_id: z.string().uuid(),
    confirmed: z.boolean(),
    edits: z.array(z.any()).optional(),
});

export default async function mealRoutes(fastify: FastifyInstance) {
    fastify.post('/meals/confirm', async (request, reply) => {
        const { meal_id, confirmed, edits } = confirmSchema.parse(request.body);

        if (!confirmed) {
            await fastify.supabaseAdmin.from('meals').update({ status: 'rejected' }).eq('id', meal_id);
            return { status: 'rejected' };
        }

        // Write meal items
        const { error: iError } = await fastify.supabaseAdmin
            .from('meal_items')
            .insert(edits!.map(item => ({ meal_id, ...item })));

        if (iError) return reply.code(500).send(iError);

        await fastify.supabaseAdmin.from('meals').update({ status: 'confirmed' }).eq('id', meal_id);

        return { status: 'confirmed' };
    });
}
