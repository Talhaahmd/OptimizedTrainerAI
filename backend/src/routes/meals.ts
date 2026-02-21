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
    fastify.post('/meals/camera/upload-url', async (request, reply) => {
        const fileName = `${request.user_id}/${Date.now()}.jpg`;
        const { data, error } = await fastify.supabaseAdmin.storage
            .from('meal-photos')
            .createSignedUrl(fileName, 3600);

        if (error) return reply.code(500).send(error);
        return { uploadUrl: data.signedUrl, path: fileName };
    });

    fastify.post('/meals/camera/create-draft', async (request, reply) => {
        const { photo_path, date } = draftSchema.parse(request.body);
        const dateKey = date || new Date().toISOString().split('T')[0];

        // Get public URL for AI Vision
        const { data: { publicUrl } } = fastify.supabaseAdmin.storage
            .from('meal-photos')
            .getPublicUrl(photo_path);

        // 1. Create meal record
        const { data: meal, error: mError } = await fastify.supabaseAdmin
            .from('meals')
            .insert({ user_id: request.user_id, date_key: dateKey, photo_path, status: 'draft', source: 'camera' })
            .select()
            .single();

        if (mError) return reply.code(500).send(mError);

        // 2. Call AI Vision
        const analysis = await aiService.analyzeMealPhoto(publicUrl);

        // 3. Log to audit
        await fastify.supabaseAdmin.from('ai_audit_log').insert({
            user_id: request.user_id,
            event_type: 'meal_draft',
            request_json: { photo_path },
            response_json: analysis
        });

        return {
            meal_id: meal.id,
            draft: analysis.items,
            confirmation_prompt: analysis.confirmation_prompt
        };
    });

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
