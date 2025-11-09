# MST Visualizer

A beautiful, interactive web-based visualizer for Minimum Spanning Tree algorithms featuring Kruskal's and Prim's algorithms with step-by-step visualization.

## Features

- **Dual Algorithm Support** - Visualize both Kruskal's and Prim's algorithms
- **Interactive Graph Building** - Drag between nodes to create custom edges
- **Random Graph Generation** - Create graphs with adjustable node count and density
- **Step-by-Step Visualization** - Watch algorithms execute with pause/resume control
- **Real-time Metrics** - Track execution time and MST cost

## Quick Start

1. Open `index.html` in a modern web browser
2. Generate a random graph or create your own interactively
3. Select an algorithm and click "Run Algorithm"

No installation or dependencies required!

## Project Structure

```
mst-visualizer/
├── index.html          # Main HTML structure
├── style.css           # Styling
├── main.js             # Entry point
├── state.js            # Application state
├── dom.js              # DOM references
├── graphDrawing.js     # Node/edge rendering
├── interactions.js     # Drag-and-drop handlers
├── modal.js            # Weight input modal
├── graphGeneration.js  # Graph creation
├── algorithms.js       # MST algorithms
└── utils.js            # Utility functions
```

## Usage

### Creating Graphs

**Interactive Mode:**
1. Click "Connect Nodes" to enter interactive mode
2. Drag from one node to another
3. Enter edge weight in the modal

**Random Generation:**
1. Set node count (3-10) and density (Sparse/Medium/Dense)
2. Click "Generate Graph"

### Running Algorithms

**Kruskal's Algorithm:**
- Select "Kruskal" and click "Run Algorithm"
- Green edges = accepted (MST)
- Red edges = rejected (creates cycle)

**Prim's Algorithm:**
- Select "Prim", enter source vertex (e.g., "A")
- Click "Run Algorithm"
- Green edges = added to MST
- Red edges = skipped (creates cycle)

## Customization

**Animation Speed** (in `algorithms.js`):
```javascript
state.timer = setTimeout(state.stepFunc, 1000); // Change 1000 to adjust speed
```

**Colors** (in `style.css`):
- Primary: `#0277bd`
- Accepted edges: `#66bb6a`
- Rejected edges: `#ef5350`

## Algorithm Complexity

- **Kruskal's**: O(E log E) - Best for sparse graphs
- **Prim's**: O(E log V) - Best for dense graphs

## License

MIT License - Open source and free to use!

---

Built with vanilla JavaScript and SVG. No external libraries required.
