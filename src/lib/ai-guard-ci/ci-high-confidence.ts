export async function highConfidenceFailures(): Promise<void> {
  sendAuditEvent();

  try {
    await Promise.reject(new Error('simulated async failure'));
  } catch {
  }
}

async function sendAuditEvent(): Promise<void> {
  await Promise.resolve('audit-event');
}