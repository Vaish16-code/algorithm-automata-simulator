# AlgoMaster - Engineering Algorithm Simulator

A comprehensive educational platform for engineering students to master algorithms and computer science concepts through interactive visualizations and simulations.

## ✨ Features

### 🏠 **Modern Homepage**
- **Responsive Design**: Beautiful gradient-based UI with modern animations
- **Interactive Navigation**: Easy access to all subjects and tools
- **Student-Focused**: Built specifically for engineering students' needs
- **Professional Layout**: Header, main content sections, and informative footer

### 📚 **Covered Subjects**

#### **Automata Theory**
- **Finite Automata (DFA)**: Interactive state transition simulator
- **Context-Free Grammar**: Parser and derivation tree generator  
- **Regular Expressions**: Pattern matching and regex testing
- **Turing Machines**: Step-by-step execution simulator

#### **Design & Analysis of Algorithms (DAA)**
- **Greedy Algorithms**: Fractional Knapsack, Job Sequencing, Prim's MST, Kruskal's MST
- **Dynamic Programming**: 0/1 Knapsack with DP table visualization
- **Divide & Conquer**: Merge Sort with step-by-step visualization
- **Backtracking**: N-Queens with interactive chessboard

#### **Operating Systems**
- **Disk Scheduling**: FCFS, SSTF, SCAN, C-SCAN algorithms
- **Page Replacement**: FIFO, LRU, Optimal algorithms
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

- **Yash Jadhav** - Project Lead & Core Development ([LinkedIn](https://www.linkedin.com/in/yash-jadhav-a8a02426b/))
- **Vaishnavi Sawant** - Algorithm Implementation & UI/UX Design ([LinkedIn](https://www.linkedin.com/in/vaishnavi-sawant-38a547289/))

## 📧 Contact

For questions, suggestions, or collaboration:
- **Email**: help.algomaster@gmail.com
- **Project**: AlgoMaster - Engineering Algorithm Simulator

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
