import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';

import supabasePlugin from './plugins/supabase';
import authPlugin from './plugins/auth';
import profileRoutes from './routes/profile';
import statsRoutes from './routes/stats';
import mealRoutes from './routes/meals';
import chatRoutes from './routes/chat';

dotenv.config();

const fastify = Fastify({
    logger: true,
});

// Register Plugins
fastify.register(cors);
fastify.register(rateLimit, { max: 100, timeWindow: '1 minute' });
fastify.register(supabasePlugin);

// Health check (unauthenticated)
fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register Auth and Authenticated Routes
fastify.register(async (authenticatedContext) => {
    authenticatedContext.register(authPlugin);

    authenticatedContext.register(profileRoutes, { prefix: '/v1' });
    authenticatedContext.register(statsRoutes, { prefix: '/v1' });
    authenticatedContext.register(mealRoutes, { prefix: '/v1' });
    authenticatedContext.register(chatRoutes, { prefix: '/v1' });
});

const start = async () => {
    try {
        const port = parseInt(process.env.PORT || '8080');
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on http://localhost:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
