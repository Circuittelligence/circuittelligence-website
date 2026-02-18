import { AI } from 'cloudflare:ai';

interface Env {
  AI: AI;
  DB: D1Database;
  R2: R2Bucket;
  SECRET_STORE: SecretsStore;
  LINEAR_API_KEY: string;
}

// Store in D1
async function storeInD1(env: Env, table: string, data: any) {
  await env.DB.prepare(
    `INSERT INTO ${table} (id, session_id, data) VALUES (?, ?, ?)`
  ).bind(
    `${Date.now()}-${Math.random()}`,
    data.session_id,
    JSON.stringify(data)
  ).run();
}

// Main handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/command') {
      const body: { command: string; sessionId: string; linearIssueId: string } = await request.json();
      
      // Store command in D1
      await storeInD1(env, 'agent_state', {
        session_id: body.sessionId,
        state_type: 'decision',
        data: { command: body.command, status: 'pending' }
      });
      
      // Generate response using Workers AI
      const responseText = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
        prompt: `Execute this command: ${body.command}`
      });
      
      // Store result in D1
      await storeInD1(env, 'decision_logs', {
        session_id: body.sessionId,
        command: body.command,
        result: responseText.response,
        status: 'success'
      });
      
      return Response.json({ success: true, result: responseText.response });
    }
    
    return new Response('Not found', { status: 404 });
  }
};
