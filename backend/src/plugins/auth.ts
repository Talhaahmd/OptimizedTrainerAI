import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
    interface FastifyRequest {
        user_id: string;
    }
}

const authPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.decorateRequest('user_id', '');

    fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return reply.code(401).send({ error: 'Missing authorization header' });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await fastify.supabase.auth.getUser(token);

        if (error || !user) {
            return reply.code(401).send({ error: 'Invalid token' });
        }

        request.user_id = user.id;
    });
};

export default fp(authPlugin);
