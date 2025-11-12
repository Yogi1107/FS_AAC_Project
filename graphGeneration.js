// graphGeneration.js - Graph generation functions

import { state, resetState } from './state.js';
import { elements } from './dom.js';
import { drawNode, drawEdge } from './graphDrawing.js';
import { handleSvgMouseMove, handleSvgMouseLeave } from './interactions.js';
import { clearDebugDisplay, initializeDebugPanel } from './debugDisplay.js';

export function createInteractiveGraph() {
  resetGraph();
  state.isInteractiveMode = true;

  const nodeCount = parseInt(elements.nodeCount.value);
  let radius = 180;
  let centerX = 250;
  let centerY = 250;

  for (let i = 0; i < nodeCount; i++) {
    let angle = (2 * Math.PI * i) / nodeCount;
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);
    let label = String.fromCharCode(65 + i);
    drawNode(label, x, y, true);
  }

  state.nodes.forEach((node) => {
    elements.svg.appendChild(node.circle);
    elements.svg.appendChild(node.text);
  });

  elements.svg.addEventListener("mousemove", handleSvgMouseMove);
  elements.svg.addEventListener("mouseleave", handleSvgMouseLeave);

  elements.stepsDiv.innerText =
    "Interactive Mode Active!\nDrag from one node to another to create edges.\n\n";
}

export function generateRandomGraph() {
  resetGraph();

  const nodeCount = parseInt(elements.nodeCount.value);
  const density = elements.density.value;

  let radius = 180;
  let centerX = 250;
  let centerY = 250;

  for (let i = 0; i < nodeCount; i++) {
    let angle = (2 * Math.PI * i) / nodeCount;
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);
    let label = String.fromCharCode(65 + i);
    drawNode(label, x, y);
  }

  let edgeProbability;
  switch (density) {
    case "sparse":
      edgeProbability = 0.3;
      break;
    case "medium":
      edgeProbability = 0.5;
      break;
    case "dense":
      edgeProbability = 0.7;
      break;
  }

  const edgeSet = new Set();

  for (let i = 1; i < nodeCount; i++) {
    const target = Math.floor(Math.random() * i);
    const weight = Math.floor(Math.random() * 20) + 1;
    const edgeKey = `${Math.min(i, target)}-${Math.max(i, target)}`;
    edgeSet.add(edgeKey);

    const fromLabel = String.fromCharCode(65 + i);
    const toLabel = String.fromCharCode(65 + target);
    drawEdge(fromLabel, toLabel, weight);
  }

  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const edgeKey = `${i}-${j}`;
      if (!edgeSet.has(edgeKey) && Math.random() < edgeProbability) {
        const weight = Math.floor(Math.random() * 20) + 1;
        edgeSet.add(edgeKey);

        const fromLabel = String.fromCharCode(65 + i);
        const toLabel = String.fromCharCode(65 + j);
        drawEdge(fromLabel, toLabel, weight);
      }
    }
  }

  state.nodes.forEach((node) => {
    elements.svg.appendChild(node.circle);
    elements.svg.appendChild(node.text);
  });
}

export function resetGraph() {
  elements.svg.innerHTML = "";
  elements.stepsDiv.innerText = "";
  elements.resultDiv.innerText = "";
  clearDebugDisplay();
  resetState();
}