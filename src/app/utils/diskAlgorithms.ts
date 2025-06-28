export type DiskResult = {
  sequence: number[];
  seekTime: number;
};

export function fcfs(queue: number[], head: number): DiskResult {
  const sequence = [head, ...queue];
  let seekTime = 0;
  for (let i = 0; i < queue.length; i++) {
    seekTime += Math.abs(sequence[i + 1] - sequence[i]);
  }
  return { sequence, seekTime };
}

export function sstf(queue: number[], head: number): DiskResult {
  const sequence = [head];
  let seekTime = 0;
  const q = [...queue];

  while (q.length) {
    const closest = q.reduce((prev, curr) =>
      Math.abs(curr - head) < Math.abs(prev - head) ? curr : prev
    );
    seekTime += Math.abs(closest - head);
    head = closest;
    sequence.push(closest);
    q.splice(q.indexOf(closest), 1);
  }

  return { sequence, seekTime };
}

export function scan(queue: number[], head: number, direction: "left" | "right", diskSize = 200): DiskResult {
  const left = queue.filter(p => p < head).sort((a, b) => b - a);
  const right = queue.filter(p => p >= head).sort((a, b) => a - b);
  const sequence: number[] = [head];
  let seekTime = 0;

  if (direction === "left") {
    left.forEach(p => { seekTime += Math.abs(head - p); head = p; sequence.push(p); });
    if (head !== 0) { seekTime += head; head = 0; sequence.push(0); }
    right.forEach(p => { seekTime += Math.abs(head - p); head = p; sequence.push(p); });
  } else {
    right.forEach(p => { seekTime += Math.abs(head - p); head = p; sequence.push(p); });
    if (head !== diskSize - 1) { seekTime += (diskSize - 1 - head); head = diskSize - 1; sequence.push(diskSize - 1); }
    left.forEach(p => { seekTime += Math.abs(head - p); head = p; sequence.push(p); });
  }

  return { sequence, seekTime };
}

export function cscan(queue: number[], head: number, diskSize = 200): DiskResult {
  const left = queue.filter(p => p < head).sort((a, b) => a - b);
  const right = queue.filter(p => p >= head).sort((a, b) => a - b);
  const sequence: number[] = [head];
  let seekTime = 0;

  right.forEach(p => { seekTime += Math.abs(head - p); head = p; sequence.push(p); });
  if (head !== diskSize - 1) {
    seekTime += diskSize - 1 - head;
    head = 0;
    sequence.push(diskSize - 1, 0);
  } else {
    head = 0;
    sequence.push(0);
  }

  left.forEach(p => { seekTime += Math.abs(head - p); head = p; sequence.push(p); });

  return { sequence, seekTime };
}

export function look(queue: number[], head: number, direction: "left" | "right"): DiskResult {
  const left = queue.filter(p => p < head).sort((a, b) => b - a);
  const right = queue.filter(p => p >= head).sort((a, b) => a - b);
  const sequence: number[] = [head];
  let seekTime = 0;

  if (direction === "left") {
    left.forEach(p => { seekTime += Math.abs(head - p); head = p; sequence.push(p); });
    right.forEach(p => { seekTime += Math.abs(head - p); head = p; sequence.push(p); });
  } else {
    right.forEach(p => { seekTime += Math.abs(head - p); head = p; sequence.push(p); });
    left.forEach(p => { seekTime += Math.abs(head - p); head = p; sequence.push(p); });
  }

  return { sequence, seekTime };
}

export function clook(queue: number[], head: number): DiskResult {
  const left = queue.filter(p => p < head).sort((a, b) => a - b);
  const right = queue.filter(p => p >= head).sort((a, b) => a - b);
  const sequence: number[] = [head];
  let seekTime = 0;

  right.forEach(p => { seekTime += Math.abs(head - p); head = p; sequence.push(p); });
  if (left.length) {
    seekTime += Math.abs(head - left[0]);
    head = left[0];
    sequence.push(head);
  }

  left.slice(1).forEach(p => { seekTime += Math.abs(head - p); head = p; sequence.push(p); });

  return { sequence, seekTime };
}
