// main.js - Main entry point and global function exposure

import { toggleSourceInput, pauseResume, runAlgorithm } from './uiControls.js';
import { createInteractiveGraph, generateRandomGraph, resetGraph } from './graphGeneration.js';
import { confirmWeight, cancelWeight } from './modal.js';

// Expose functions to global scope for HTML onclick handlers
window.toggleSourceInput = toggleSourceInput;
window.resetGraph = resetGraph;
window.createInteractiveGraph = createInteractiveGraph;
window.generateRandomGraph = generateRandomGraph;
window.pauseResume = pauseResume;
window.runAlgorithm = runAlgorithm;
window.confirmWeight = confirmWeight;
window.cancelWeight = cancelWeight;

console.log("MST Visualizer initialized");