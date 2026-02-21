import { supabase } from './supabase';

const API_BASE_URL = 'http://localhost:8080/v1';

async function getHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || ''}`,
    };
}

export const api = {
    async get(path: string) {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            headers: await getHeaders(),
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return response.json();
    },

    async post(path: string, body: any) {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return response.json();
    }
};
