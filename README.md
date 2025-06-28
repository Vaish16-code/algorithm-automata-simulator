# Algorithm & Automata Theory Simulator

A comprehensive educational platform for visualizing and simulating algorithms and automata theory concepts.

## 🚀 Features

### Data Structures & Algorithms (DAA)
- **Greedy Algorithms**: Fractional Knapsack, Job Sequencing, Prim's MST, Kruskal's MST
- **Dynamic Programming**: 0/1 Knapsack with DP table visualization
- **Divide & Conquer**: Merge Sort with step-by-step visualization
- **Backtracking**: N-Queens with interactive chessboard

### Automata Theory
- **Finite Automata**: DFA and NFA simulators with state transition visualization
- **Regular Expressions**: Pattern matching and regex testing
- **Context-Free Grammars**: Parser and derivation tree generator
- **Turing Machines**: Step-by-step execution simulator

### Operating Systems
- **Disk Scheduling**: Various disk scheduling algorithms
- **Page Replacement**: LRU, FIFO, and other page replacement algorithms

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Custom SVG-based visualizations
- **State Management**: React Hooks

## 📁 Project Structure

```
src/
├── app/
│   ├── daa/                    # Design & Analysis of Algorithms
│   │   ├── greedy/            # Greedy algorithms
│   │   ├── dynamic/           # Dynamic programming
│   │   ├── divide-conquer/    # Divide and conquer
│   │   └── backtracking/      # Backtracking algorithms
│   ├── auto/                   # Automata Theory
│   │   ├── finite-automata/   # FA simulations
│   │   ├── regular-expressions/ # Regex tools
│   │   ├── context-free-grammar/ # CFG parsers
│   │   └── turing-machines/   # TM simulators
│   ├── os/                     # Operating Systems
│   ├── components/             # Reusable React components
│   └── utils/                  # Algorithm implementations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd algo-simulator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 Contributing

This is a collaborative group project. To contribute:

1. **Create a new branch** for your feature:
```bash
git checkout -b feature/algorithm-name
```

2. **Make your changes** and commit:
```bash
git add .
git commit -m "Add: Algorithm name implementation"
```

3. **Push to your branch**:
```bash
git push origin feature/algorithm-name
```

4. **Create a Pull Request** on GitHub

### Contribution Guidelines

- Follow consistent naming conventions
- Add proper TypeScript types
- Include step-by-step algorithm visualization
- Update this README if adding new features
- Test your implementations before submitting

## 📋 TODO / Roadmap

### Algorithms to Implement
- [ ] String Matching Algorithms (KMP, Rabin-Karp)
- [ ] Branch & Bound Algorithms (TSP, 0/1 Knapsack)
- [ ] Graph Algorithms (Dijkstra, Floyd-Warshall)
- [ ] Sorting Algorithms (Quick Sort, Heap Sort)

### Automata Theory Enhancements
- [ ] NFA to DFA Conversion
- [ ] Pushdown Automata Simulator
- [ ] Multi-tape Turing Machines
- [ ] Regular Expression to FA Conversion

### Features
- [ ] Save/Load automata configurations
- [ ] Export visualizations as images
- [ ] Step-by-step animation controls
- [ ] Mobile-responsive design

## 🤝 Team Members

- **[Your Name]** - Project Lead & Core Development
- **[Friend 1]** - Algorithm Implementation
- **[Friend 2]** - UI/UX Design
- **[Friend 3]** - Testing & Documentation

## 📝 License

This project is created for educational purposes.

## 🎯 Learning Objectives

Students using this simulator will be able to:
- Understand algorithm complexity and visualization
- Trace through algorithm execution step-by-step
- Visualize data structures and state transitions
- Compare different algorithmic approaches
- Gain hands-on experience with theoretical concepts

---

**Note**: This is an educational project designed to help students understand complex algorithms and automata theory through interactive visualization.
