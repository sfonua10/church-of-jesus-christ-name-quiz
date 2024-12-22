import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ message: 'API is working' }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};