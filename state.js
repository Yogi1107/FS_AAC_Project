// state.js - Central state management

export const state = {
  nodes: [],
  edges: [],
  running: false,
  paused: false,
  stepFunc: null,
  timer: null,
  
  // Drag and drop variables
  isInteractiveMode: false,
  dragStartNode: null,
  tempLine: null,
  
  // Modal variables
  pendingEdge: null
};

export function resetState() {
  state.nodes = [];
  state.edges = [];
  state.running = false;
  state.paused = false;
  state.stepFunc = null;
  state.isInteractiveMode = false;
  state.dragStartNode = null;
  state.tempLine = null;
  state.pendingEdge = null;
  clearTimeout(state.timer);
}