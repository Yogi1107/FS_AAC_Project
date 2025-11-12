// debugDisplay.js - Display data structures and edge tables

import { state } from './state.js';
import { elements } from './dom.js';

/**
 * Creates a table showing all edges with their status
 */
export function createEdgeTable() {
  const tableHTML = `
    <div class="debug-section">
      <h4>📊 Edge Table</h4>
      <table class="edge-table" id="edgeTable">
        <thead>
          <tr>
            <th>#</th>
            <th>Edge</th>
            <th>Weight</th>
            <th>Status</th>
            <th>Step</th>
          </tr>
        </thead>
        <tbody id="edgeTableBody">
          ${state.edges.map((edge, i) => `
            <tr id="edge-row-${i}">
              <td>${i + 1}</td>
              <td>${edge.u}-${edge.v}</td>
              <td>${edge.w}</td>
              <td class="status-pending">Pending</td>
              <td>-</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  return tableHTML;
}

/**
 * Updates edge table row when edge is processed
 */
export function updateEdgeTableRow(edgeIndex, status, stepNumber) {
  const row = document.getElementById(`edge-row-${edgeIndex}`);
  if (row) {
    const statusCell = row.children[3];
    const stepCell = row.children[4];
    
    statusCell.textContent = status;
    statusCell.className = status === 'Accepted' ? 'status-accepted' : 'status-rejected';
    stepCell.textContent = stepNumber;
    
    // Highlight the row briefly
    row.classList.add('row-highlight');
    setTimeout(() => row.classList.remove('row-highlight'), 1000);
  }
}

/**
 * Creates Union-Find parent array display for Kruskal's
 */
export function createParentArrayDisplay(initialParents) {
  const nodeIds = Object.keys(initialParents).sort();
  
  const displayHTML = `
    <div class="debug-section">
      <h4>🌳 Union-Find Parent Array (Kruskal's)</h4>
      <table class="parent-table">
        <thead>
          <tr>
            <th>Node</th>
            ${nodeIds.map(id => `<th>${id}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Parent</strong></td>
            ${nodeIds.map(id => `
              <td id="parent-${id}" class="parent-cell">${initialParents[id]}</td>
            `).join('')}
          </tr>
        </tbody>
      </table>
      <div class="array-legend">
        <span>🔵 Initial: Each node points to itself</span>
        <span>🟢 Updated: After union operation</span>
      </div>
    </div>
  `;
  return displayHTML;
}

/**
 * Updates parent array display when union operation occurs
 */
export function updateParentArray(node, newParent, highlightColor = '#66bb6a') {
  const element = document.getElementById(`parent-${node}`);
  if (element) {
    const oldValue = element.textContent;
    element.textContent = newParent;
    
    // Animate the change
    element.style.backgroundColor = highlightColor;
    element.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
      element.style.backgroundColor = '#e3f2fd';
      element.style.transform = 'scale(1)';
    }, 800);
    
    // Log the change
    elements.stepsDiv.innerText += `   Parent[${node}]: ${oldValue} → ${newParent}\n`;
  }
}

/**
 * Creates visited set display for Prim's algorithm
 */
export function createVisitedSetDisplay(sourceVertex) {
  const allNodes = state.nodes.map(n => n.id).sort();
  
  const displayHTML = `
    <div class="debug-section">
      <h4>🎯 Visited Set (Prim's)</h4>
      <table class="visited-table">
        <thead>
          <tr>
            <th>Node</th>
            ${allNodes.map(id => `<th>${id}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Visited</strong></td>
            ${allNodes.map(id => `
              <td id="visited-${id}" class="visited-cell ${id === sourceVertex ? 'visited-yes' : 'visited-no'}">
                ${id === sourceVertex ? '✓' : '✗'}
              </td>
            `).join('')}
          </tr>
        </tbody>
      </table>
      <div class="set-info">
        <span id="visitedCount">Visited: 1</span>
        <span id="visitedTotal">/ ${state.nodes.length}</span>
      </div>
    </div>
  `;
  return displayHTML;
}

/**
 * Updates visited set when new vertex is added
 */
export function updateVisitedSet(newVertex) {
  const cell = document.getElementById(`visited-${newVertex}`);
  const countElement = document.getElementById('visitedCount');
  
  if (cell && countElement) {
    // Update cell
    cell.textContent = '✓';
    cell.classList.remove('visited-no');
    cell.classList.add('visited-yes', 'cell-highlight');
    
    // Remove highlight after animation
    setTimeout(() => {
      cell.classList.remove('cell-highlight');
    }, 1000);
    
    // Update count
    const currentCount = document.querySelectorAll('.visited-yes').length;
    countElement.textContent = `Visited: ${currentCount}`;
    
    // Log the change
    elements.stepsDiv.innerText += `   Visited += {${newVertex}}\n`;
  }
}

/**
 * Creates available edges queue display for Prim's
 */
export function createAvailableEdgesDisplay() {
  const displayHTML = `
    <div class="debug-section">
      <h4>📋 Available Edges Queue (Prim's)</h4>
      <table class="queue-table" id="queueTable">
        <thead>
          <tr>
            <th>Priority</th>
            <th>Edge</th>
            <th>Weight</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="queueTableBody">
          <tr>
            <td colspan="4" class="queue-empty">No edges in queue</td>
          </tr>
        </tbody>
      </table>
      <div class="queue-info">
        <span id="queueSize">Queue Size: 0</span>
      </div>
    </div>
  `;
  return displayHTML;
}

/**
 * Updates available edges queue display
 */
export function updateAvailableEdgesQueue(edgesAvailable) {
  const tbody = document.getElementById('queueTableBody');
  const sizeElement = document.getElementById('queueSize');
  
  if (tbody && sizeElement) {
    // Sort by weight for display
    const sortedEdges = [...edgesAvailable].sort((a, b) => a.w - b.w);
    
    if (sortedEdges.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="queue-empty">No edges in queue</td></tr>';
    } else {
      tbody.innerHTML = sortedEdges.map((edge, i) => `
        <tr class="${i === 0 ? 'queue-next' : ''}">
          <td>${i + 1}</td>
          <td>${edge.u}-${edge.v}</td>
          <td>${edge.w}</td>
          <td>${i === 0 ? '👉 Next' : 'Waiting'}</td>
        </tr>
      `).join('');
    }
    
    // Update size
    sizeElement.textContent = `Queue Size: ${sortedEdges.length}`;
  }
}

/**
 * Creates MST cost tracker
 */
export function createCostTracker() {
  const displayHTML = `
    <div class="debug-section">
      <h4>💰 MST Cost Tracker</h4>
      <div class="cost-display">
        <div class="cost-value" id="currentCost">0</div>
        <div class="cost-label">Current Total Cost</div>
      </div>
      <div class="cost-breakdown" id="costBreakdown">
        <div class="cost-empty">No edges added yet</div>
      </div>
    </div>
  `;
  return displayHTML;
}

/**
 * Updates cost tracker when edge is added
 */
export function updateCostTracker(edge, newTotal) {
  const costElement = document.getElementById('currentCost');
  const breakdownElement = document.getElementById('costBreakdown');
  
  if (costElement && breakdownElement) {
    // Animate cost update
    const oldCost = parseInt(costElement.textContent);
    costElement.textContent = newTotal;
    costElement.classList.add('cost-updated');
    setTimeout(() => costElement.classList.remove('cost-updated'), 600);
    
    // Add to breakdown
    if (breakdownElement.querySelector('.cost-empty')) {
      breakdownElement.innerHTML = '';
    }
    
    const breakdownItem = document.createElement('div');
    breakdownItem.className = 'cost-item';
    breakdownItem.innerHTML = `
      <span class="cost-edge">${edge.u}-${edge.v}</span>
      <span class="cost-weight">+${edge.w}</span>
      <span class="cost-running">= ${newTotal}</span>
    `;
    breakdownElement.appendChild(breakdownItem);
    
    // Auto scroll
    breakdownElement.scrollTop = breakdownElement.scrollHeight;
  }
}

/**
 * Initialize debug display panel
 */
export function initializeDebugPanel() {
  const debugPanel = document.getElementById('debugPanel');
  if (!debugPanel) {
    console.warn('Debug panel not found in HTML');
    return;
  }
  
  debugPanel.innerHTML = `
    <h3>📊 Data Structure Visualization</h3>
    <div id="debugContent">
      <p class="debug-placeholder">Run an algorithm to see data structures...</p>
    </div>
  `;
}

/**
 * Setup debug display for Kruskal's algorithm
 */
export function setupKruskalDebug(parentArray) {
  const debugContent = document.getElementById('debugContent');
  if (debugContent) {
    debugContent.innerHTML = 
      createEdgeTable() +
      createParentArrayDisplay(parentArray) +
      createCostTracker();
  }
}

/**
 * Setup debug display for Prim's algorithm
 */
export function setupPrimDebug(sourceVertex) {
  const debugContent = document.getElementById('debugContent');
  if (debugContent) {
    debugContent.innerHTML = 
      createEdgeTable() +
      createVisitedSetDisplay(sourceVertex) +
      createAvailableEdgesDisplay() +
      createCostTracker();
  }
}

/**
 * Clear debug display
 */
export function clearDebugDisplay() {
  const debugContent = document.getElementById('debugContent');
  if (debugContent) {
    debugContent.innerHTML = '<p class="debug-placeholder">Run an algorithm to see data structures...</p>';
  }
}