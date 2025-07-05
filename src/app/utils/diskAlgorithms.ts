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
    // Service all requests to the left first
    left.forEach(p => { 
      seekTime += Math.abs(head - p); 
      head = p; 
      sequence.push(p); 
    });
    // Go to the beginning of disk if there are requests on the right
    if (right.length > 0 && head !== 0) { 
      seekTime += head; 
      head = 0; 
      sequence.push(0); 
    }
    // Service requests to the right
    right.forEach(p => { 
      seekTime += Math.abs(head - p); 
      head = p; 
      sequence.push(p); 
    });
  } else {
    // Service all requests to the right first
    right.forEach(p => { 
      seekTime += Math.abs(head - p); 
      head = p; 
      sequence.push(p); 
    });
    // Go to the end of disk if there are requests on the left
    if (left.length > 0 && head !== diskSize - 1) { 
      seekTime += (diskSize - 1 - head); 
      head = diskSize - 1; 
      sequence.push(diskSize - 1); 
    }
    // Service requests to the left (reverse order)
    left.reverse().forEach(p => { 
      seekTime += Math.abs(head - p); 
      head = p; 
      sequence.push(p); 
    });
  }

  return { sequence, seekTime };
}

export function cscan(queue: number[], head: number, diskSize = 200): DiskResult {
  const left = queue.filter(p => p < head).sort((a, b) => a - b);
  const right = queue.filter(p => p >= head).sort((a, b) => a - b);
  const sequence: number[] = [head];
  let seekTime = 0;

  // Service all requests to the right first
  right.forEach(p => { 
    seekTime += Math.abs(head - p); 
    head = p; 
    sequence.push(p); 
  });
  
  // If there are requests to the left, go to end then beginning
  if (left.length > 0) {
    if (head !== diskSize - 1) {
      seekTime += diskSize - 1 - head;
      head = diskSize - 1;
      sequence.push(diskSize - 1);
    }
    
    // Jump to beginning
    seekTime += diskSize - 1;  // Distance from end to beginning
    head = 0;
    sequence.push(0);
    
    // Service requests from beginning
    left.forEach(p => { 
      seekTime += Math.abs(head - p); 
      head = p; 
      sequence.push(p); 
    });
  }

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
