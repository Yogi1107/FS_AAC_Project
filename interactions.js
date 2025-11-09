// interactions.js - User interaction handlers

import { state } from './state.js';
import { elements } from './dom.js';
import { showWeightModal } from './modal.js';
import { showNotification } from './utils.js';

export function handleNodeMouseDown(e, node) {
  if (!state.isInteractiveMode) return;
  e.preventDefault();
  state.dragStartNode = node;

  state.tempLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  state.tempLine.setAttribute("x1", node.x);
  state.tempLine.setAttribute("y1", node.y);
  state.tempLine.setAttribute("x2", node.x);
  state.tempLine.setAttribute("y2", node.y);
  state.tempLine.setAttribute("stroke", "#ffd54f");
  state.tempLine.setAttribute("stroke-width", "2");
  state.tempLine.setAttribute("stroke-dasharray", "5,5");
  elements.svg.insertBefore(state.tempLine, elements.svg.firstChild);
}

export function handleSvgMouseMove(e) {
  if (!state.isInteractiveMode || !state.dragStartNode || !state.tempLine) return;

  const svgRect = elements.svg.getBoundingClientRect();
  const x = e.clientX - svgRect.left;
  const y = e.clientY - svgRect.top;

  state.tempLine.setAttribute("x2", x);
  state.tempLine.setAttribute("y2", y);
}

export function handleSvgMouseLeave(e) {
  if (state.tempLine && state.dragStartNode) {
    elements.svg.removeChild(state.tempLine);
    state.tempLine = null;
    state.dragStartNode = null;
  }
}

export function handleNodeMouseUp(e, endNode) {
  if (!state.isInteractiveMode || !state.dragStartNode) return;

  if (state.tempLine) {
    elements.svg.removeChild(state.tempLine);
    state.tempLine = null;
  }

  if (endNode.id !== state.dragStartNode.id) {
    const existingEdge = state.edges.find(
      (edge) =>
        (edge.u === state.dragStartNode.id && edge.v === endNode.id) ||
        (edge.u === endNode.id && edge.v === state.dragStartNode.id)
    );

    if (existingEdge) {
      showNotification(`Edge already exists between ${state.dragStartNode.id} and ${endNode.id}!`, 'error');
      elements.stepsDiv.innerText += `❌ Edge ${state.dragStartNode.id}-${endNode.id} already exists!\n`;
    } else {
      state.pendingEdge = { from: state.dragStartNode.id, to: endNode.id };
      showWeightModal(state.dragStartNode.id, endNode.id);
    }
  }

  state.dragStartNode = null;
}