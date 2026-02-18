/**
 * OpenClaw Worker Integration
 * 
 * This script provides easy integration with the OpenClaw Cloudflare Worker
 * for the Circuittelligence website.
 */

const OPENCLAW_WORKER_URL = 'https://open-claw-worker.gabrielj07-gj.workers.dev';

class OpenClawClient {
  constructor(workerUrl = OPENCLAW_WORKER_URL) {
    this.workerUrl = workerUrl;
    this.sessionId = this.generateSessionId();
  }

  /**
   * Generate a unique session ID
   */
  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Check if the worker is healthy
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.workerUrl}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', error: error.message };
    }
  }

  /**
   * Execute a command using the OpenClaw agent
   * 
   * @param {string} command - The command to execute
   * @param {boolean} createLinearIssue - Whether to create a Linear issue
   * @returns {Promise<Object>} The command execution result
   */
  async executeCommand(command, createLinearIssue = false) {
    try {
      const response = await fetch(`${this.workerUrl}/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          sessionId: this.sessionId,
          linearIssueId: createLinearIssue ? 'create' : undefined
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Command execution failed');
      }

      return result;
    } catch (error) {
      console.error('Command execution failed:', error);
      return {
        success: false,
        error: error.message,
        sessionId: this.sessionId
      };
    }
  }

  /**
   * Get the command history for the current session
   * 
   * @returns {Promise<Object>} The session history
   */
  async getHistory() {
    try {
      const response = await fetch(`${this.workerUrl}/history?sessionId=${this.sessionId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get history:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get history for a specific session ID
   * 
   * @param {string} sessionId - The session ID to retrieve history for
   * @returns {Promise<Object>} The session history
   */
  async getHistoryForSession(sessionId) {
    try {
      const response = await fetch(`${this.workerUrl}/history?sessionId=${sessionId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get history:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Reset the session (generates a new session ID)
   */
  resetSession() {
    this.sessionId = this.generateSessionId();
    return this.sessionId;
  }

  /**
   * Get the current session ID
   */
  getSessionId() {
    return this.sessionId;
  }
}

// Example usage:
/*
// Initialize the client
const openclaw = new OpenClawClient();

// Check health
const health = await openclaw.healthCheck();
console.log('Worker status:', health);

// Execute a command
const result = await openclaw.executeCommand('Analyze the current system architecture');
console.log('Command result:', result.result);

// Get session history
const history = await openclaw.getHistory();
console.log('Session history:', history.history);

// Execute a command and create a Linear issue
const resultWithIssue = await openclaw.executeCommand(
  'Critical: System performance degradation detected',
  true // Create Linear issue
);
console.log('Command result:', resultWithIssue.result);
console.log('Linear issue:', resultWithIssue.linearIssue);

// Start a new session
openclaw.resetSession();
*/

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OpenClawClient;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
  window.OpenClawClient = OpenClawClient;
}
