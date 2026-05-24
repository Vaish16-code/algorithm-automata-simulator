export async function buildSignals(items: string[]): Promise<string[]> {
  const results: string[] = [];

  for (const item of items) {
    await recordSignal(item);
    results.push(item.toUpperCase());
  }

  return results;
}

export async function wrapPromise(value: Promise<string>): Promise<string> {
  return value;
}

export async function safeFireAndForget(items: string[]): Promise<void> {
  void emitTelemetry(items);

  await Promise.all(items.map(async (item) => processItem(item)));
}

async function recordSignal(item: string): Promise<void> {
  await Promise.resolve(item);
}

async function processItem(item: string): Promise<string> {
  return item.trim();
}

async function emitTelemetry(items: string[]): Promise<void> {
  await Promise.resolve(items.length);
}