// uiControls.js - UI control functions

import { state } from './state.js';
import { elements } from './dom.js';
import { runKruskal, runPrim } from './algorithms.js';

export function toggleSourceInput() {
  let algo = elements.algoSelect.value;
  elements.sourceInputDiv.style.display = algo === "prim" ? "block" : "none";
}

export function pauseResume() {
  if (!state.running) return;
  state.paused = !state.paused;
  if (!state.paused) state.stepFunc();
}

export function runAlgorithm() {
  if (state.edges.length === 0) {
    alert("Please create a graph first!");
    return;
  }

  state.isInteractiveMode = false;

  resetSteps();
  let algo = elements.algoSelect.value;
  if (algo === "kruskal") runKruskal();
  else runPrim();
}

function resetSteps() {
  elements.stepsDiv.innerText = "";
  elements.resultDiv.innerText = "";
  state.running = true;
  state.paused = false;
  clearTimeout(state.timer);
}