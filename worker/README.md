# OpenClaw Worker

OpenClaw AI agent deployed on Cloudflare Workers with D1 database, Workers AI, and Linear integration.

## Deployment Information

**Worker URL:** `https://open-claw-worker.gabrielj07-gj.workers.dev`

**Database:** D1 Database `open-claw-db` (ID: `2ea565a0-6e52-47fd-bd8e-c0f462b2152c`)

**Account ID:** `87633884af93e13f28f3e1b6f80cfbaa`

## Features

- **Workers AI Integration**: Uses `@cf/meta/llama-3.1-8b-instruct` for command execution
- **D1 Database**: Stores agent state, decision logs, and verification records
- **Linear Integration**: Creates issues automatically (requires LINEAR_API_KEY secret)
- **CORS Enabled**: Frontend can call from any origin

## API Endpoints

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "service": "open-claw-worker",
  "timestamp": "2026-02-18T13:33:20.185Z"
}
```

### Execute Command
```bash
POST /command
Content-Type: application/json

{
  "command": "Your command here",
  "sessionId": "unique-session-id",
  "linearIssueId": "create" // optional, creates Linear issue
}
```

Response:
```json
{
  "success": true,
  "result": "AI-generated response",
  "sessionId": "unique-session-id",
  "linearIssue": { ... } // if linearIssueId was "create"
}
```

### Get Session History
```bash
GET /history?sessionId=unique-session-id
```

Response:
```json
{
  "success": true,
  "history": [
    {
      "id": "...",
      "session_id": "unique-session-id",
      "command": "...",
      "result": "...",
      "status": "success",
      "timestamp": "2026-02-18 13:33:27"
    }
  ]
}
```

## Database Schema

### agent_state
- `id` TEXT PRIMARY KEY
- `session_id` TEXT NOT NULL
- `state_type` TEXT NOT NULL
- `data` JSON NOT NULL
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP

### decision_logs
- `id` TEXT PRIMARY KEY
- `session_id` TEXT NOT NULL
- `command` TEXT NOT NULL
- `result` TEXT
- `status` TEXT
- `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP

### verification_records
- `id` TEXT PRIMARY KEY
- `session_id` TEXT NOT NULL
- `command` TEXT NOT NULL
- `verification_result` JSON
- `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP

## Deployment Commands

### Install Dependencies
```bash
pnpm install
```

### Deploy to Cloudflare
```bash
pnpm run deploy
```

### Set Secrets
```bash
# Set LINEAR_API_KEY (required for Linear integration)
wrangler secret put LINEAR_API_KEY
```

## Frontend Integration

Add this to your frontend JavaScript to interact with the worker:

```javascript
const WORKER_URL = 'https://open-claw-worker.gabrielj07-gj.workers.dev';

// Execute a command
async function executeCommand(command, sessionId) {
  const response = await fetch(`${WORKER_URL}/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command, sessionId })
  });
  return await response.json();
}

// Get session history
async function getHistory(sessionId) {
  const response = await fetch(`${WORKER_URL}/history?sessionId=${sessionId}`);
  return await response.json();
}

// Example usage
const result = await executeCommand('Analyze system status', 'session-001');
console.log(result);

const history = await getHistory('session-001');
console.log(history);
```

## Testing

The worker has been tested and verified:

✅ Health endpoint responding  
✅ Command execution with Workers AI working  
✅ D1 database storage and retrieval working  
✅ Session history retrieval working  
✅ CORS enabled for frontend integration  

Linear integration is implemented but requires LINEAR_API_KEY to be set as a secret.

## Monitoring

View worker metrics and logs in the Cloudflare dashboard:
https://dash.cloudflare.com/87633884af93e13f28f3e1b6f80cfbaa/workers/services/view/open-claw-worker

## Architecture

The worker follows a simple, direct architecture:
- Single worker handling all requests
- D1 database for persistent storage
- Workers AI for command processing
- Linear API for issue tracking
- No secrets in code (all via environment variables)
