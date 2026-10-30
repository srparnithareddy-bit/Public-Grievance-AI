/**
 * Persistent Tunnel Daemon
 * Automatically reconnects the SSH reverse tunnel whenever it disconnects or expires.
 */

const { spawn } = require('child_process');

function startTunnel() {
  console.log('[Tunnel] Starting reverse tunnel to expose port 5000...');
  
  const proc = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=20',
    '-o', 'ServerAliveCountMax=5',
    '-R', '80:127.0.0.1:5000',
    'serveo.net',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  proc.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  proc.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  proc.on('close', (code) => {
    console.log(`[Tunnel] Connection closed (code ${code}). Auto-reconnecting in 3 seconds...`);
    setTimeout(startTunnel, 3000);
  });

  proc.on('error', (err) => {
    console.error('[Tunnel] Spawn error:', err.message, '. Retrying in 5 seconds...');
    setTimeout(startTunnel, 5000);
  });
}

startTunnel();
