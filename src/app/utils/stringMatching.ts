// String Matching Algorithms

// Naive String Matching interfaces
export interface NaiveStringStep {
  step: number;
  description: string;
  text: string;
  pattern: string;
  textIndex: number;
  patternIndex: number;
  comparison: string;
  matched: boolean;
  found: boolean;
}

export interface NaiveStringResult {
  matches: number[];
  steps: NaiveStringStep[];
  totalComparisons: number;
}

// Naive String Matching Algorithm
export function naiveStringMatch(text: string, pattern: string): NaiveStringResult {
  const matches: number[] = [];
  const steps: NaiveStringStep[] = [];
  let stepCount = 0;
  let totalComparisons = 0;

  for (let i = 0; i <= text.length - pattern.length; i++) {
    let j = 0;
    
    steps.push({
      step: stepCount++,
      description: `Starting comparison at text position ${i}`,
      text,
      pattern,
      textIndex: i,
      patternIndex: 0,
      comparison: `'${text[i]}' vs '${pattern[0]}'`,
      matched: false,
      found: false
    });

    while (j < pattern.length && text[i + j] === pattern[j]) {
      totalComparisons++;
      
      steps.push({
        step: stepCount++,
        description: `Character match: '${text[i + j]}' === '${pattern[j]}'`,
        text,
        pattern,
        textIndex: i + j,
        patternIndex: j,
        comparison: `'${text[i + j]}' vs '${pattern[j]}'`,
        matched: true,
        found: false
      });
      
      j++;
    }

    if (j < pattern.length) {
      totalComparisons++;
      
      steps.push({
        step: stepCount++,
        description: `Character mismatch: '${text[i + j] || 'END'}' !== '${pattern[j]}'`,
        text,
        pattern,
        textIndex: i + j,
        patternIndex: j,
        comparison: `'${text[i + j] || 'END'}' vs '${pattern[j]}'`,
        matched: false,
        found: false
      });
    } else {
      matches.push(i);
      
      steps.push({
        step: stepCount++,
        description: `Pattern found at position ${i}!`,
        text,
        pattern,
        textIndex: i,
        patternIndex: 0,
        comparison: 'Complete match',
        matched: true,
        found: true
      });
    }
  }

  return {
    matches,
    steps,
    totalComparisons
  };
}

// KMP Algorithm interfaces
export interface KMPStep {
  step: number;
  description: string;
  text: string;
  pattern: string;
  textIndex: number;
  patternIndex: number;
  comparison: string;
  shift: number;
  matched: boolean;
  found: boolean;
}

export interface KMPResult {
  matches: number[];
  steps: KMPStep[];
  lps: number[];
  totalComparisons: number;
}

// KMP Algorithm
export function kmpStringMatch(text: string, pattern: string): KMPResult {
  const matches: number[] = [];
  const steps: KMPStep[] = [];
  let stepCount = 0;
  let totalComparisons = 0;

  // Build LPS (Longest Proper Prefix which is also Suffix) array
  function buildLPS(pattern: string): number[] {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
    return lps;
  }

  const lps = buildLPS(pattern);
  let i = 0; // text index
  let j = 0; // pattern index

  steps.push({
    step: stepCount++,
    description: `KMP preprocessing complete. LPS array: [${lps.join(', ')}]`,
    text,
    pattern,
    textIndex: 0,
    patternIndex: 0,
    comparison: 'Preprocessing',
    shift: 0,
    matched: false,
    found: false
  });

  while (i < text.length) {
    totalComparisons++;
    
    if (pattern[j] === text[i]) {
      steps.push({
        step: stepCount++,
        description: `Character match: '${text[i]}' === '${pattern[j]}'`,
        text,
        pattern,
        textIndex: i,
        patternIndex: j,
        comparison: `'${text[i]}' vs '${pattern[j]}'`,
        shift: 0,
        matched: true,
        found: false
      });
      
      i++;
      j++;
    }

    if (j === pattern.length) {
      matches.push(i - j);
      
      steps.push({
        step: stepCount++,
        description: `Pattern found at position ${i - j}!`,
        text,
        pattern,
        textIndex: i - j,
        patternIndex: 0,
        comparison: 'Complete match',
        shift: lps[j - 1],
        matched: true,
        found: true
      });
      
      j = lps[j - 1];
    } else if (i < text.length && pattern[j] !== text[i]) {
      steps.push({
        step: stepCount++,
        description: `Character mismatch: '${text[i]}' !== '${pattern[j]}'`,
        text,
        pattern,
        textIndex: i,
        patternIndex: j,
        comparison: `'${text[i]}' vs '${pattern[j]}'`,
        shift: j > 0 ? j - lps[j - 1] : 1,
        matched: false,
        found: false
      });

      if (j !== 0) {
        j = lps[j - 1];
        
        steps.push({
          step: stepCount++,
          description: `Using LPS: shift pattern to position ${j}`,
          text,
          pattern,
          textIndex: i,
          patternIndex: j,
          comparison: 'LPS shift',
          shift: 0,
          matched: false,
          found: false
        });
      } else {
        i++;
      }
    }
  }

  return {
    matches,
    steps,
    lps,
    totalComparisons
  };
}
