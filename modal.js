// modal.js - Modal window handling

import { state } from './state.js';
import { elements } from './dom.js';
import { drawEdge } from './graphDrawing.js';

export function showWeightModal(from, to) {
  elements.modalEdgeInfo.textContent = `Enter weight for edge ${from}-${to}:`;
  elements.modalWeightInput.value = '';
  elements.modalError.classList.remove('active');
  elements.modal.classList.add('active');
  elements.modalWeightInput.focus();
  
  elements.modalWeightInput.onkeypress = function(e) {
    if (e.key === 'Enter') {
      confirmWeight();
    }
  };
}

export function confirmWeight() {
  const weight = elements.modalWeightInput.value.trim();
  
  if (weight === '') {
    elements.modalError.textContent = 'Please enter a weight!';
    elements.modalError.classList.add('active');
    return;
  }
  
  const w = parseInt(weight);
  if (isNaN(w) || w <= 0) {
    elements.modalError.textContent = 'Please enter a valid positive number!';
    elements.modalError.classList.add('active');
    return;
  }
  
  drawEdge(state.pendingEdge.from, state.pendingEdge.to, w);
  elements.stepsDiv.innerText += `✓ Added edge ${state.pendingEdge.from}-${state.pendingEdge.to} with weight ${w}\n`;
  elements.stepsDiv.scrollTop = elements.stepsDiv.scrollHeight;
  
  closeWeightModal();
}

export function cancelWeight() {
  elements.stepsDiv.innerText += `❌ Cancelled edge ${state.pendingEdge.from}-${state.pendingEdge.to}\n`;
  closeWeightModal();
}

export function closeWeightModal() {
  elements.modal.classList.remove('active');
  state.pendingEdge = null;
}