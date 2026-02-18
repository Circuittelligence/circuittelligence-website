interface Env {
  AI: Ai;
  DB: D1Database;
  LINEAR_API_KEY: string;
}

// Store data in D1
async function storeInD1(env: Env, table: string, data: any) {
  const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  if (table === 'agent_state') {
    await env.DB.prepare(
      `INSERT INTO agent_state (id, session_id, state_type, data) VALUES (?, ?, ?, ?)`
    ).bind(
      id,
      data.session_id,
      data.state_type,
      JSON.stringify(data.data)
    ).run();
  } else if (table === 'decision_logs') {
    await env.DB.prepare(
      `INSERT INTO decision_logs (id, session_id, command, result, status) VALUES (?, ?, ?, ?, ?)`
    ).bind(
      id,
      data.session_id,
      data.command,
      data.result,
      data.status
    ).run();
  } else if (table === 'verification_records') {
    await env.DB.prepare(
      `INSERT INTO verification_records (id, session_id, command, verification_result) VALUES (?, ?, ?, ?)`
    ).bind(
      id,
      data.session_id,
      data.command,
      JSON.stringify(data.verification_result)
    ).run();
  }
}

// Get Linear team ID
async function getLinearTeamId(env: Env): Promise<string | null> {
  const query = `
    query {
      teams {
        nodes {
          id
          name
        }
      }
    }
  `;

  const response = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': env.LINEAR_API_KEY,
    },
    body: JSON.stringify({ query })
  });

  const data = await response.json();
  return data?.data?.teams?.nodes?.[0]?.id || null;
}

// Create Linear issue
async function createLinearIssue(env: Env, title: string, description: string) {
  const teamId = await getLinearTeamId(env);
  if (!teamId) {
    return { error: 'No Linear team found' };
  }

  const mutation = `
    mutation CreateIssue($title: String!, $description: String!, $teamId: String!) {
      issueCreate(input: {
        title: $title
        description: $description
        teamId: $teamId
      }) {
        success
        issue {
          id
          title
          url
        }
      }
    }
  `;

  const response = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': env.LINEAR_API_KEY,
    },
    body: JSON.stringify({
      query: mutation,
      variables: { title, description, teamId }
    })
  });

  return await response.json();
}

// Main handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return Response.json({
        status: 'healthy',
        service: 'open-claw-worker',
        timestamp: new Date().toISOString()
      }, { headers: corsHeaders });
    }

    // Command execution endpoint
    if (url.pathname === '/command' && request.method === 'POST') {
      try {
        const body: { command: string; sessionId: string; linearIssueId?: string } = await request.json();
        
        // Store command in D1
        await storeInD1(env, 'agent_state', {
          session_id: body.sessionId,
          state_type: 'decision',
          data: { command: body.command, status: 'pending' }
        });
        
        // Generate response using Workers AI
        const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { role: 'system', content: 'You are OpenClaw, an AI agent that helps execute commands and manage tasks.' },
            { role: 'user', content: `Execute this command: ${body.command}` }
          ]
        });

        const responseText = (aiResponse as any).response || JSON.stringify(aiResponse);
        
        // Store result in D1
        await storeInD1(env, 'decision_logs', {
          session_id: body.sessionId,
          command: body.command,
          result: responseText,
          status: 'success'
        });

        // Create Linear issue if requested
        let linearIssue = null;
        if (body.linearIssueId === 'create') {
          linearIssue = await createLinearIssue(
            env,
            `OpenClaw Command: ${body.command.substring(0, 50)}`,
            `Command: ${body.command}\n\nResult: ${responseText}`
          );
        }
        
        return Response.json({
          success: true,
          result: responseText,
          sessionId: body.sessionId,
          linearIssue: linearIssue
        }, { headers: corsHeaders });
      } catch (error: any) {
        return Response.json({
          success: false,
          error: error.message
        }, { status: 500, headers: corsHeaders });
      }
    }

    // Get session history endpoint
    if (url.pathname === '/history' && request.method === 'GET') {
      try {
        const sessionId = url.searchParams.get('sessionId');
        if (!sessionId) {
          return Response.json({
            success: false,
            error: 'sessionId parameter required'
          }, { status: 400, headers: corsHeaders });
        }

        const { results } = await env.DB.prepare(
          'SELECT * FROM decision_logs WHERE session_id = ? ORDER BY timestamp DESC LIMIT 50'
        ).bind(sessionId).all();

        return Response.json({
          success: true,
          history: results
        }, { headers: corsHeaders });
      } catch (error: any) {
        return Response.json({
          success: false,
          error: error.message
        }, { status: 500, headers: corsHeaders });
      }
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  }
};
