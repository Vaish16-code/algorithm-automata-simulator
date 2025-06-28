export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
}

export interface ProcessResult extends Process {
  startTime: number;
  completionTime: number;
  waitingTime: number;
  turnaroundTime: number;
  remainingTime?: number;
}

export interface SchedulingResult {
  processes: ProcessResult[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  ganttChart: GanttItem[];
}

export interface GanttItem {
  processId: string;
  startTime: number;
  endTime: number;
}

export function solveFCFS(processes: Process[]): SchedulingResult {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;
  const result: ProcessResult[] = [];
  const ganttChart: GanttItem[] = [];

  sorted.forEach(process => {
    const startTime = Math.max(currentTime, process.arrivalTime);
    const completionTime = startTime + process.burstTime;
    const waitingTime = startTime - process.arrivalTime;
    const turnaroundTime = completionTime - process.arrivalTime;

    result.push({
      ...process,
      startTime,
      completionTime,
      waitingTime,
      turnaroundTime
    });

    ganttChart.push({
      processId: process.id,
      startTime,
      endTime: completionTime
    });

    currentTime = completionTime;
  });

  const averageWaitingTime = result.reduce((sum, p) => sum + p.waitingTime, 0) / result.length;
  const averageTurnaroundTime = result.reduce((sum, p) => sum + p.turnaroundTime, 0) / result.length;

  return {
    processes: result,
    averageWaitingTime,
    averageTurnaroundTime,
    ganttChart
  };
}

export function solveSJF(processes: Process[]): SchedulingResult {
  const remaining = [...processes];
  const result: ProcessResult[] = [];
  const ganttChart: GanttItem[] = [];
  let currentTime = 0;

  while (remaining.length > 0) {
    const available = remaining.filter(p => p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      currentTime = Math.min(...remaining.map(p => p.arrivalTime));
      continue;
    }

    const shortest = available.reduce((min, p) => 
      p.burstTime < min.burstTime ? p : min
    );

    const startTime = currentTime;
    const completionTime = startTime + shortest.burstTime;
    const waitingTime = startTime - shortest.arrivalTime;
    const turnaroundTime = completionTime - shortest.arrivalTime;

    result.push({
      ...shortest,
      startTime,
      completionTime,
      waitingTime,
      turnaroundTime
    });

    ganttChart.push({
      processId: shortest.id,
      startTime,
      endTime: completionTime
    });

    currentTime = completionTime;
    remaining.splice(remaining.indexOf(shortest), 1);
  }

  const averageWaitingTime = result.reduce((sum, p) => sum + p.waitingTime, 0) / result.length;
  const averageTurnaroundTime = result.reduce((sum, p) => sum + p.turnaroundTime, 0) / result.length;

  return {
    processes: result,
    averageWaitingTime,
    averageTurnaroundTime,
    ganttChart
  };
}

export function solvePriority(processes: Process[]): SchedulingResult {
  const remaining = [...processes];
  const result: ProcessResult[] = [];
  const ganttChart: GanttItem[] = [];
  let currentTime = 0;

  while (remaining.length > 0) {
    const available = remaining.filter(p => p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      currentTime = Math.min(...remaining.map(p => p.arrivalTime));
      continue;
    }

    const highest = available.reduce((max, p) => 
      (p.priority || 0) < (max.priority || 0) ? p : max
    );

    const startTime = currentTime;
    const completionTime = startTime + highest.burstTime;
    const waitingTime = startTime - highest.arrivalTime;
    const turnaroundTime = completionTime - highest.arrivalTime;

    result.push({
      ...highest,
      startTime,
      completionTime,
      waitingTime,
      turnaroundTime
    });

    ganttChart.push({
      processId: highest.id,
      startTime,
      endTime: completionTime
    });

    currentTime = completionTime;
    remaining.splice(remaining.indexOf(highest), 1);
  }

  const averageWaitingTime = result.reduce((sum, p) => sum + p.waitingTime, 0) / result.length;
  const averageTurnaroundTime = result.reduce((sum, p) => sum + p.turnaroundTime, 0) / result.length;

  return {
    processes: result,
    averageWaitingTime,
    averageTurnaroundTime,
    ganttChart
  };
}

export function solveRoundRobin(processes: Process[], timeQuantum: number): SchedulingResult {
  const queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const result: ProcessResult[] = [];
  const ganttChart: GanttItem[] = [];
  const processMap = new Map<string, ProcessResult>();
  let currentTime = 0;
  let i = 0;

  // Initialize process tracking
  queue.forEach(p => {
    processMap.set(p.id, {
      ...p,
      remainingTime: p.burstTime,
      startTime: -1,
      completionTime: 0,
      waitingTime: 0,
      turnaroundTime: 0
    });
  });

  const readyQueue: string[] = [];
  
  while (processMap.size > 0 || readyQueue.length > 0) {
    // Add arrived processes to ready queue
    while (i < queue.length && queue[i].arrivalTime <= currentTime) {
      readyQueue.push(queue[i].id);
      i++;
    }

    if (readyQueue.length === 0) {
      currentTime = i < queue.length ? queue[i].arrivalTime : currentTime + 1;
      continue;
    }

    const processId = readyQueue.shift()!;
    const process = processMap.get(processId)!;

    if (process.startTime === -1) {
      process.startTime = currentTime;
    }

    const executeTime = Math.min(timeQuantum, process.remainingTime!);
    const startTime = currentTime;
    currentTime += executeTime;
    process.remainingTime! -= executeTime;

    ganttChart.push({
      processId: process.id,
      startTime,
      endTime: currentTime
    });

    // Add newly arrived processes
    while (i < queue.length && queue[i].arrivalTime <= currentTime) {
      readyQueue.push(queue[i].id);
      i++;
    }

    if (process.remainingTime! > 0) {
      readyQueue.push(processId);
    } else {
      process.completionTime = currentTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;
      result.push(process);
      processMap.delete(processId);
    }
  }

  const sortedResult = result.sort((a, b) => a.id.localeCompare(b.id));
  const averageWaitingTime = sortedResult.reduce((sum, p) => sum + p.waitingTime, 0) / sortedResult.length;
  const averageTurnaroundTime = sortedResult.reduce((sum, p) => sum + p.turnaroundTime, 0) / sortedResult.length;

  return {
    processes: sortedResult,
    averageWaitingTime,
    averageTurnaroundTime,
    ganttChart
  };
}

export function solveSRTF(processes: Process[]): SchedulingResult {
  // Create a type that extends Process with remainingTime and startTime
  type ProcessWithRuntime = Process & { 
    remainingTime: number; 
    startTime?: number; 
  };
  
  const remaining: ProcessWithRuntime[] = processes.map(p => ({
    ...p, 
    remainingTime: p.burstTime
  }));
  
  const ganttChart: GanttItem[] = [];
  const completed: ProcessResult[] = [];
  let currentTime = 0;
  let lastProcess = '';

  while (completed.length < processes.length) {
    const available = remaining.filter(p => 
      p.arrivalTime <= currentTime && p.remainingTime > 0
    );

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    const shortest = available.reduce((min, p) => 
      p.remainingTime < min.remainingTime ? p : min
    );

    // Now we can assign startTime since it's defined in our type
    if (shortest.startTime === undefined) {
      shortest.startTime = currentTime;
    }

    // Add to Gantt chart if process changes
    if (lastProcess !== shortest.id) {
      if (ganttChart.length > 0) {
        ganttChart[ganttChart.length - 1].endTime = currentTime;
      }
      ganttChart.push({
        processId: shortest.id,
        startTime: currentTime,
        endTime: currentTime + 1
      });
      lastProcess = shortest.id;
    }

    shortest.remainingTime--;
    currentTime++;

    if (shortest.remainingTime === 0) {
      const completionTime = currentTime;
      const turnaroundTime = completionTime - shortest.arrivalTime;
      const waitingTime = turnaroundTime - shortest.burstTime;

      // Include startTime in the ProcessResult
      completed.push({
        id: shortest.id,
        arrivalTime: shortest.arrivalTime,
        burstTime: shortest.burstTime,
        priority: shortest.priority,
        startTime: shortest.startTime!, // We know this is defined by now
        completionTime,
        waitingTime,
        turnaroundTime
      });
    }
  }

  // Close last Gantt chart item
  if (ganttChart.length > 0) {
    ganttChart[ganttChart.length - 1].endTime = currentTime;
  }

  const averageWaitingTime = completed.reduce((sum, p) => sum + p.waitingTime, 0) / completed.length;
  const averageTurnaroundTime = completed.reduce((sum, p) => sum + p.turnaroundTime, 0) / completed.length;

  return {
    processes: completed,
    averageWaitingTime,
    averageTurnaroundTime,
    ganttChart
  };
}