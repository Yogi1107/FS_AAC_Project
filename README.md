# MST Visualizer - Kruskal & Prim Algorithms

A beautiful, interactive web-based visualizer for Minimum Spanning Tree (MST) algorithms. This tool demonstrates both Kruskal's and Prim's algorithms with step-by-step visualization and detailed execution tracking.

## Features

- **Dual Algorithm Support**: Visualize both Kruskal's and Prim's MST algorithms
- **Random Graph Generation**: Create random graphs with customizable parameters
  - Adjustable node count (3-10 nodes)
  - Density options (Sparse, Medium, Dense)
- **Custom Graph Input**: Define your own graphs using simple text notation
- **Step-by-Step Visualization**: Watch algorithms execute with 1-second intervals
- **Pause/Resume Control**: Control the execution flow at any time
- **Real-time Metrics**: Track execution time and total MST cost
- **Clean UI**: Modern design with light blue and white color scheme

## Project Structure

```
mst-visualizer/
│
├── index.html          # Main HTML structure
├── styles.css          # All styling and layout
├── script.js           # Algorithm logic and visualization
└── README.md           # This file
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies or installations required!

### Installation

1. Download or clone the repository
2. Ensure all three files are in the same directory:
   - `index.html`
   - `styles.css`
   - `script.js`

3. Open `index.html` in your web browser

That's it! The visualizer is ready to use.

## Usage

### Generating Random Graphs

1. Select the number of nodes (3-10)
2. Choose graph density:
   - **Sparse**: ~30% possible edges
   - **Medium**: ~50% possible edges
   - **Dense**: ~70% possible edges
3. Click **"Generate Random Graph"**

### Creating Custom Graphs

1. Enter edges in the "Custom Graph Input" textarea using this format:
   ```
   A-B:4
   A-C:2
   B-C:5
   C-D:3
   ```
   Format: `Node1-Node2:Weight`

2. Click **"Load Custom Graph"**

### Running Algorithms

#### Kruskal's Algorithm
1. Select "Kruskal" from the algorithm dropdown
2. Click **"Run Algorithm"**
3. Watch as edges are evaluated in ascending weight order
4. Green edges are accepted (part of MST)
5. Red edges are rejected (would create cycle)

#### Prim's Algorithm
1. Select "Prim" from the algorithm dropdown
2. Enter a source vertex (e.g., "A")
3. Click **"Run Algorithm"**
4. Watch as the MST grows from the source vertex
5. Green edges are added to the MST
6. Red edges are skipped (both endpoints already visited)

### Controls

- **Run Algorithm**: Start the visualization
- **Pause/Resume**: Pause or resume execution
- **Reset**: Clear the graph and start over

## File Details

### `index.html`
Contains the structure of the application:
- Split-panel layout (graph area and control area)
- Algorithm selector with conditional source input
- Control buttons and input fields
- Custom graph input textarea
- Steps display and results section

### `styles.css`
Handles all visual styling:
- Gradient background with light blue tones
- Modern button designs with hover effects
- Responsive layout with flexbox
- Custom scrollbar styling
- Clean typography and spacing
- Color scheme: Light blue (#0277bd, #90caf9, #e3f2fd) and white

### `script.js`
Implements core functionality:
- **Graph Management**
  - `drawNode()`: Creates SVG node elements
  - `drawEdge()`: Creates SVG edge elements with labels
  - `generateRandomGraph()`: Random graph generation logic
  - `loadUserGraph()`: Parses custom graph input
  - `resetGraph()`: Clears all data and visualization

- **Kruskal's Algorithm**
  - Union-Find data structure
  - Edge sorting by weight
  - Cycle detection

- **Prim's Algorithm**
  - Priority queue for edge selection
  - Visited set tracking
  - Dynamic edge addition

- **Visualization Control**
  - Step-by-step execution with timeouts
  - Pause/resume functionality
  - Real-time step logging
  - Performance metrics

## Customization

### Modifying Colors
In `styles.css`, update these color variables:
- `#0277bd`: Primary blue
- `#90caf9`: Light blue
- `#e3f2fd`: Very light blue background
- `#66bb6a`: Green for accepted edges
- `#ef5350`: Red for rejected edges

### Adjusting Animation Speed
In `script.js`, find these lines and modify the timeout value (in milliseconds):
```javascript
timer = setTimeout(stepFunc, 1000); // Change 1000 to your preferred delay
```

### Changing Node/Edge Appearance
In `script.js`, modify the `drawNode()` and `drawEdge()` functions:
- Node radius: `circle.setAttribute("r", 18);`
- Edge width: `line.setAttribute("stroke-width", 3);`
- Node colors: `circle.setAttribute("fill", "#0277bd");`

## Algorithm Complexity

### Kruskal's Algorithm
- **Time Complexity**: O(E log E) where E is the number of edges
- **Space Complexity**: O(V) where V is the number of vertices
- Best for sparse graphs

### Prim's Algorithm
- **Time Complexity**: O(E log V) with binary heap
- **Space Complexity**: O(V)
- Best for dense graphs

## Example Graphs

### Simple Triangle
```
A-B:1
B-C:2
C-A:3
```

### Square with Diagonal
```
A-B:4
B-C:2
C-D:5
D-A:1
A-C:3
```

### Pentagon
```
A-B:7
B-C:8
C-D:5
D-E:15
E-A:6
A-C:9
B-E:7
```

## Troubleshooting

**Problem**: Graph doesn't appear after clicking "Generate Random Graph"
- **Solution**: Check browser console for errors. Ensure all three files are properly linked.

**Problem**: Prim's algorithm shows an alert
- **Solution**: Make sure to enter a valid source vertex that exists in the graph (e.g., "A", "B", etc.)

**Problem**: Custom graph doesn't load
- **Solution**: Check the format. Each line should be: `Node1-Node2:Weight` with no extra spaces

**Problem**: Nodes are hidden behind edges
- **Solution**: This has been fixed in the current version. If still occurring, ensure you're using the latest `script.js`

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## License

This project is open source and available under the MIT License.

## Author

Created as an educational tool for understanding Minimum Spanning Tree algorithms.

## Acknowledgments

- Inspired by classic graph algorithm visualizers
- Built with vanilla JavaScript and SVG for maximum compatibility
- No external libraries required

---

**Enjoy visualizing MST algorithms! **
