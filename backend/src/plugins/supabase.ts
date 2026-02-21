import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

declare module 'fastify' {
    interface FastifyInstance {
        supabase: SupabaseClient;
        supabaseAdmin: SupabaseClient;
    }
}

const supabasePlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    fastify.decorate('supabase', supabase);
    fastify.decorate('supabaseAdmin', supabaseAdmin);
};

export default fp(supabasePlugin);
