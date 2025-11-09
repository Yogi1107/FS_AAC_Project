// algorithms.js - Kruskal's and Prim's algorithms

import { state } from './state.js';
import { elements } from './dom.js';

export function runKruskal() {
  let startTime = performance.now();
  let parent = {};
  state.nodes.forEach((n) => (parent[n.id] = n.id));

  function find(x) {
    return parent[x] === x ? x : (parent[x] = find(parent[x]));
  }
  
  function union(a, b) {
    let pa = find(a),
      pb = find(b);
    if (pa !== pb) {
      parent[pa] = pb;
      return true;
    }
    return false;
  }

  let sorted = [...state.edges].sort((a, b) => a.w - b.w);
  let mstCost = 0,
    i = 0;

  state.stepFunc = function step() {
    if (state.paused) return;
    if (i >= sorted.length) {
      let endTime = performance.now();
      elements.resultDiv.innerText = `MST Complete (Kruskal)\nFinal Cost: ${mstCost}\nTotal Time: ${(
        endTime - startTime
      ).toFixed(2)} ms`;
      state.running = false;
      return;
    }
    let e = sorted[i];
    let nowTime = performance.now();
    elements.stepsDiv.innerText += `Step ${i + 1}: Considering ${e.u}-${e.v} (${e.w})\n`;
    if (union(e.u, e.v)) {
      e.line.setAttribute("stroke", "#66bb6a");
      e.line.setAttribute("stroke-width", 5);
      mstCost += e.w;
      elements.stepsDiv.innerText += `   Added | Cost: ${mstCost} | Time: ${(
        nowTime - startTime
      ).toFixed(2)} ms\n`;
    } else {
      e.line.setAttribute("stroke", "#ef5350");
      elements.stepsDiv.innerText += `   Skipped | Cost: ${mstCost} | Time: ${(
        nowTime - startTime
      ).toFixed(2)} ms\n`;
    }
    elements.stepsDiv.scrollTop = elements.stepsDiv.scrollHeight;
    i++;
    state.timer = setTimeout(state.stepFunc, 1000);
  };
  state.stepFunc();
}

export function runPrim() {
  let startTime = performance.now();
  let mstCost = 0,
    i = 0;
  let visited = new Set();
  let edgesAvailable = [];

  let src = elements.sourceVertex.value.trim();
  if (!src) {
    alert("Please enter a source vertex for Prim's algorithm!");
    state.running = false;
    return;
  }
  if (!state.nodes.find((n) => n.id === src)) {
    alert(`Source vertex '${src}' not found in graph!`);
    state.running = false;
    return;
  }

  visited.add(src);
  addEdges(src);

  function addEdges(u) {
    state.edges
      .filter(
        (e) =>
          (e.u === u && !visited.has(e.v)) || (e.v === u && !visited.has(e.u))
      )
      .forEach((e) => edgesAvailable.push(e));
  }

  state.stepFunc = function step() {
    if (state.paused) return;
    if (visited.size === state.nodes.length) {
      let endTime = performance.now();
      elements.resultDiv.innerText = `MST Complete (Prim)\nFinal Cost: ${mstCost}\nTotal Time: ${(
        endTime - startTime
      ).toFixed(2)} ms`;
      state.running = false;
      return;
    }
    edgesAvailable.sort((a, b) => a.w - b.w);
    let e = edgesAvailable.shift();
    let nowTime = performance.now();
    elements.stepsDiv.innerText += `Step ${i + 1}: Considering ${e.u}-${e.v} (${e.w})\n`;

    let u = e.u,
      v = e.v;
    if (visited.has(u) && visited.has(v)) {
      e.line.setAttribute("stroke", "#ef5350");
      e.line.setAttribute("stroke-width", 3);
      elements.stepsDiv.innerText += `Skipped (cycle)\n`;
    } else {
      e.line.setAttribute("stroke", "#66bb6a");
      e.line.setAttribute("stroke-width", 5);
      mstCost += e.w;
      let newNode = visited.has(u) ? v : u;
      visited.add(newNode);
      addEdges(newNode);
      elements.stepsDiv.innerText += `Added | Cost: ${mstCost} | Time: ${(
        nowTime - startTime
      ).toFixed(2)} ms\n`;
    }
    elements.stepsDiv.scrollTop = elements.stepsDiv.scrollHeight;
    i++;
    state.timer = setTimeout(state.stepFunc, 1000);
  };
  state.stepFunc();
}