import { PATTERNS, UNKNOWN_PATTERN, type DiscPattern } from "@/lib/disc-patterns"

export interface RawScores {
  most: Record<string, number>
  least: Record<string, number>
}

export interface CalculatedScores {
  graph1Most: Record<string, number>
  graph2Least: Record<string, number>
  graph3Difference: Record<string, number>
}

export function calculateScores(
  answers: { keyM: string; keyL: string }[]
): { rawScores: RawScores; calculatedScores: CalculatedScores } {
  const most: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 }
  const least: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 }

  for (const answer of answers) {
    if (answer.keyM !== "*") most[answer.keyM]++
    if (answer.keyL !== "*") least[answer.keyL]++
  }

  const diff: Record<string, number> = {}
  for (const k of ["D", "I", "S", "C"]) {
    diff[k] = most[k] - least[k]
  }

  return {
    rawScores: { most, least },
    calculatedScores: {
      graph1Most: { ...most },
      graph2Least: { ...least },
      graph3Difference: { ...diff },
    },
  }
}

type Dim = "D" | "I" | "S" | "C"
type Graph = Record<Dim, number>
type Line = 1 | 2 | 3

// Raw tally -> graph value (-8..+8) per dimension, ported from cahyadsn/disc_id
// (MIT, https://github.com/cahyadsn/disc_id), db/disc.sql tbl_results.
// Line 2 D at 17 and 18 are +6.7/+7 in the source, fixed here to -6.7/-7.
const CONVERSION: Record<Line, Record<number, [number, number, number, number]>> = {
  // Most: value 0..20
  1: {
    0: [-6, -7, -5.7, -6],
    1: [-5.3, -4.6, -4.3, -4.7],
    2: [-4, -2.5, -3.5, -3.5],
    3: [-2.5, -1.3, -1.5, -1.5],
    4: [-1.7, 1, -0.7, 0.5],
    5: [-1.3, 3, 0.5, 2],
    6: [0, 3.5, 1, 3],
    7: [0.5, 5.3, 2.5, 5.3],
    8: [1, 5.7, 3, 5.7],
    9: [2, 6, 4, 6],
    10: [3, 6.5, 4.6, 6.3],
    11: [3.5, 7, 5, 6.5],
    12: [4, 7, 5.7, 6.7],
    13: [4.7, 7, 6, 7],
    14: [5.3, 7, 6.5, 7.3],
    15: [6.5, 7, 6.5, 7.3],
    16: [7, 7.5, 7, 7.3],
    17: [7, 7.5, 7, 7.5],
    18: [7, 7.5, 7, 8],
    19: [7.5, 7.5, 7.5, 8],
    20: [7.5, 8, 7.5, 8],
  },
  // Least: value 0..20
  2: {
    0: [7.5, 7, 7.5, 7.5],
    1: [6.5, 6, 7, 7],
    2: [4.3, 4, 6, 5.6],
    3: [2.5, 2.5, 4, 4],
    4: [1.5, 0.5, 2.5, 2.5],
    5: [0.5, 0, 1.5, 1.5],
    6: [0, -2, 0.5, 0.5],
    7: [-1.3, -3.5, -1.3, 0],
    8: [-1.5, -4.3, -2, -1.3],
    9: [-2.5, -5.3, -3, -2.5],
    10: [-3, -6, -4.3, -3.5],
    11: [-3.5, -6.5, -5.3, -5.3],
    12: [-4.3, -7, -6, -5.7],
    13: [-5.3, -7.2, -6.5, -6],
    14: [-5.7, -7.2, -6.7, -6.5],
    15: [-6, -7.2, -6.7, -7],
    16: [-6.5, -7.3, -7, -7.3],
    17: [-6.7, -7.3, -7.2, -7.5],
    18: [-7, -7.3, -7.3, -7.7],
    19: [-7.3, -7.5, -7.5, -7.9],
    20: [-7.5, -8, -8, -8],
  },
  // Change (Most - Least): value -22..22
  3: {
    "-22": [-8, -8, -8, -7.5],
    "-21": [-7.5, -8, -8, -7.3],
    "-20": [-7, -8, -8, -7.3],
    "-19": [-6.8, -8, -8, -7],
    "-18": [-6.75, -7, -7.5, -6.7],
    "-17": [-6.7, -6.7, -7.3, -6.7],
    "-16": [-6.5, -6.7, -7.3, -6.7],
    "-15": [-6.3, -6.7, -7, -6.5],
    "-14": [-6.1, -6.7, -6.5, -6.3],
    "-13": [-5.9, -6.7, -6.5, -6],
    "-12": [-5.7, -6.7, -6.5, -5.85],
    "-11": [-5.3, -6.7, -6.5, -5.85],
    "-10": [-4.3, -6.5, -6, -5.7],
    "-9": [-3.5, -6, -4.7, -4.7],
    "-8": [-3.25, -5.7, -4.3, -4.3],
    "-7": [-3, -4.7, -3.5, -3.5],
    "-6": [-2.75, -4.3, -3, -3],
    "-5": [-2.5, -3.5, -2, -2.5],
    "-4": [-1.5, -3, -1.5, -0.5],
    "-3": [-1, -2, -1, 0],
    "-2": [-0.5, -1.5, -0.5, 0.3],
    "-1": [-0.25, 0, 0, 0.5],
    0: [0, 0.5, 1, 1.5],
    1: [0.5, 1, 1.5, 3],
    2: [0.7, 1.5, 2, 4],
    3: [1, 3, 3, 4.3],
    4: [1.3, 4, 3.5, 5.5],
    5: [1.5, 4.3, 4, 5.7],
    6: [2, 5, 4.3, 6],
    7: [2.5, 5.5, 4.7, 6.3],
    8: [3.5, 6.5, 5, 6.5],
    9: [4, 6.7, 5.5, 6.7],
    10: [4.7, 7, 6, 7],
    11: [4.85, 7.3, 6.2, 7.3],
    12: [5, 7.3, 6.3, 7.3],
    13: [5.5, 7.3, 6.5, 7.3],
    14: [6, 7.3, 6.7, 7.3],
    15: [6.3, 7.3, 7, 7.3],
    16: [6.5, 7.3, 7.3, 7.3],
    17: [6.7, 7.3, 7.3, 7.5],
    18: [7, 7.5, 7.3, 8],
    19: [7.3, 8, 7.3, 8],
    20: [7.3, 8, 7.5, 8],
    21: [7.5, 8, 8, 8],
    22: [8, 8, 8, 8],
  },
}

function toGraph(line: Line, tally: Record<string, number>): Graph {
  const table = CONVERSION[line]
  const keys = Object.keys(table).map(Number)
  const min = Math.min(...keys)
  const max = Math.max(...keys)
  const row = (v: number) => table[Math.min(max, Math.max(min, v))]
  return {
    D: row(tally.D)[0],
    I: row(tally.I)[1],
    S: row(tally.S)[2],
    C: row(tally.C)[3],
  }
}

// First match wins, in the source's order. Each rule lists exactly which
// dimensions sit above the midline, plus the ordering among them.
const PATTERN_RULES: [number, string, (g: Graph) => boolean][] = [
  [1, "C", () => true],
  [2, "D", () => true],
  [3, "DC", (g) => g.C >= g.D],
  [4, "DI", (g) => g.I >= g.D],
  [5, "DIC", (g) => g.I >= g.D && g.D >= g.C],
  [6, "DIS", (g) => g.I >= g.D && g.D >= g.S],
  [7, "DIS", (g) => g.I >= g.S && g.S >= g.D],
  [8, "DSC", (g) => g.S >= g.D && g.D >= g.C],
  [9, "DI", (g) => g.D >= g.I],
  [10, "DIS", (g) => g.D >= g.I && g.I >= g.S],
  [11, "DS", (g) => g.D >= g.S],
  [12, "ISC", (g) => g.C >= g.I && g.I >= g.S],
  [13, "ISC", (g) => g.C >= g.S && g.S >= g.I],
  [14, "ISC", (g) => g.I >= g.S && g.I >= g.C],
  [15, "S", () => true],
  [16, "SC", (g) => g.C >= g.S],
  [17, "SC", (g) => g.S >= g.C],
  [18, "DC", (g) => g.D >= g.C],
  [19, "DIC", (g) => g.D >= g.I && g.I >= g.C],
  [20, "DIS", (g) => g.D >= g.S && g.S >= g.I],
  [21, "DSC", (g) => g.D >= g.S && g.S >= g.C],
  [22, "DIC", (g) => g.D >= g.C && g.C >= g.I],
  [23, "DSC", (g) => g.D >= g.C && g.C >= g.S],
  [24, "I", () => true],
  [25, "IS", (g) => g.I >= g.S],
  [26, "IC", (g) => g.I >= g.C],
  [27, "DIC", (g) => g.I >= g.C && g.C >= g.D],
  [28, "ISC", (g) => g.I >= g.C && g.C >= g.S],
  [29, "DS", (g) => g.S >= g.D],
  [30, "IS", (g) => g.S >= g.I],
  [31, "DIS", (g) => g.S >= g.D && g.D >= g.I],
  [32, "DIS", (g) => g.S >= g.I && g.I >= g.D],
  [33, "ISC", (g) => g.S >= g.I && g.I >= g.C],
  [34, "DSC", (g) => g.S >= g.C && g.C >= g.D],
  [35, "ISC", (g) => g.S >= g.C && g.C >= g.I],
  [36, "IC", (g) => g.C >= g.I],
  [37, "DIC", (g) => g.C >= g.D && g.D >= g.I],
  [38, "DSC", (g) => g.C >= g.D && g.D >= g.S],
  [39, "DIC", (g) => g.C >= g.I && g.I >= g.D],
  [40, "DSC", (g) => g.C >= g.S && g.S >= g.D],
]

const DIMS: Dim[] = ["D", "I", "S", "C"]

function classify(g: Graph): DiscPattern {
  const above = DIMS.filter((k) => g[k] > 0).join("")
  const rule = PATTERN_RULES.find(([, set, test]) => set === above && test(g))
  return rule ? PATTERNS[rule[0]] : UNKNOWN_PATTERN
}

export interface ProfileLine {
  graph: Graph
  pattern: DiscPattern
}

export interface DiscProfile {
  // Most: public self (mask), Least: self under pressure, Change: private self (mirror)
  most: ProfileLine
  least: ProfileLine
  change: ProfileLine
  primary?: string
  secondary?: string
}

export function analyzeProfile(
  most: Record<string, number>,
  least: Record<string, number>
): DiscProfile {
  const diff: Record<string, number> = {}
  for (const k of DIMS) diff[k] = most[k] - least[k]

  const line = (n: Line, tally: Record<string, number>): ProfileLine => {
    const graph = toGraph(n, tally)
    return { graph, pattern: classify(graph) }
  }

  const change = line(3, diff)
  const [primary, secondary] = DIMS.filter((k) => change.graph[k] > 0).sort(
    (a, b) => change.graph[b] - change.graph[a]
  )

  return { most: line(1, most), least: line(2, least), change, primary, secondary }
}
