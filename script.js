<<<<<<< HEAD
let nodes = [];
let edges = [];
let svg = document.getElementById("graph");
let stepsDiv = document.getElementById("steps");
let resultDiv = document.getElementById("result");

let running = false;
let paused = false;
let stepFunc;
let timer;

// Drag and drop variables
let isInteractiveMode = false;
let dragStartNode = null;
let tempLine = null;

// Modal variables
let pendingEdge = null;

function resetGraph() {
  svg.innerHTML = "";
  nodes = [];
  edges = [];
  stepsDiv.innerText = "";
  resultDiv.innerText = "";
  running = false;
  paused = false;
  isInteractiveMode = false;
  dragStartNode = null;
  tempLine = null;
  clearTimeout(timer);
}

function toggleSourceInput() {
  let algo = document.getElementById("algo").value;
  document.getElementById("sourceInputDiv").style.display =
    algo === "prim" ? "block" : "none";
}

function drawNode(id, x, y, interactive = false) {
  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", 18);
  circle.setAttribute("fill", "#0277bd");
  circle.setAttribute("stroke", "white");
  circle.setAttribute("stroke-width", "3");
  circle.setAttribute("class", "node");
  if (interactive) {
    circle.style.cursor = "pointer";
  }

  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y + 5);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "white");
  text.setAttribute("font-weight", "bold");
  text.setAttribute("font-size", "14");
  text.setAttribute("class", "node");
  text.textContent = id;
  if (interactive) {
    text.style.cursor = "pointer";
    text.style.pointerEvents = "none";
  }

  if (interactive) {
    circle.addEventListener("mousedown", (e) =>
      handleNodeMouseDown(e, { id, x, y, circle, text })
    );
    circle.addEventListener("mouseup", (e) =>
      handleNodeMouseUp(e, { id, x, y, circle, text })
    );
  }

  nodes.push({ id, x, y, circle, text });
}

function drawEdge(u, v, w) {
  let n1 = nodes.find((n) => n.id === u);
  let n2 = nodes.find((n) => n.id === v);
  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", n1.x);
  line.setAttribute("y1", n1.y);
  line.setAttribute("x2", n2.x);
  line.setAttribute("y2", n2.y);
  line.setAttribute("stroke", "#90caf9");
  line.setAttribute("stroke-width", 3);
  svg.appendChild(line);

  let midX = (n1.x + n2.x) / 2;
  let midY = (n1.y + n2.y) / 2;
  let bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bgRect.setAttribute("x", midX - 12);
  bgRect.setAttribute("y", midY - 15);
  bgRect.setAttribute("width", 24);
  bgRect.setAttribute("height", 20);
  bgRect.setAttribute("fill", "white");
  bgRect.setAttribute("rx", 4);
  svg.appendChild(bgRect);

  let label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("x", midX);
  label.setAttribute("y", midY);
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("fill", "#0277bd");
  label.setAttribute("font-weight", "bold");
  label.setAttribute("font-size", "12");
  label.textContent = w;
  svg.appendChild(label);

  edges.push({ u, v, w, line, bgRect, label });
}

function createInteractiveGraph() {
  resetGraph();
  isInteractiveMode = true;

  const nodeCount = parseInt(document.getElementById("nodeCount").value);
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

  nodes.forEach((node) => {
    svg.appendChild(node.circle);
    svg.appendChild(node.text);
  });

  svg.addEventListener("mousemove", handleSvgMouseMove);
  svg.addEventListener("mouseleave", handleSvgMouseLeave);

  stepsDiv.innerText =
    "Interactive Mode Active!\nDrag from one node to another to create edges.\n\n";
}

function handleNodeMouseDown(e, node) {
  if (!isInteractiveMode) return;
  e.preventDefault();
  dragStartNode = node;

  tempLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  tempLine.setAttribute("x1", node.x);
  tempLine.setAttribute("y1", node.y);
  tempLine.setAttribute("x2", node.x);
  tempLine.setAttribute("y2", node.y);
  tempLine.setAttribute("stroke", "#ffd54f");
  tempLine.setAttribute("stroke-width", "2");
  tempLine.setAttribute("stroke-dasharray", "5,5");
  svg.insertBefore(tempLine, svg.firstChild);
}

function handleSvgMouseMove(e) {
  if (!isInteractiveMode || !dragStartNode || !tempLine) return;

  const svgRect = svg.getBoundingClientRect();
  const x = e.clientX - svgRect.left;
  const y = e.clientY - svgRect.top;

  tempLine.setAttribute("x2", x);
  tempLine.setAttribute("y2", y);
}

function handleSvgMouseLeave(e) {
  if (tempLine && dragStartNode) {
    svg.removeChild(tempLine);
    tempLine = null;
    dragStartNode = null;
  }
}

function handleNodeMouseUp(e, endNode) {
  if (!isInteractiveMode || !dragStartNode) return;

  if (tempLine) {
    svg.removeChild(tempLine);
    tempLine = null;
  }

  if (endNode.id !== dragStartNode.id) {
    const existingEdge = edges.find(
      (edge) =>
        (edge.u === dragStartNode.id && edge.v === endNode.id) ||
        (edge.u === endNode.id && edge.v === dragStartNode.id)
    );

    if (existingEdge) {
      showNotification(`Edge already exists between ${dragStartNode.id} and ${endNode.id}!`, 'error');
      stepsDiv.innerText += `❌ Edge ${dragStartNode.id}-${endNode.id} already exists!\n`;
    } else {
      pendingEdge = { from: dragStartNode.id, to: endNode.id };
      showWeightModal(dragStartNode.id, endNode.id);
    }
  }

  dragStartNode = null;
}

function showWeightModal(from, to) {
  const modal = document.getElementById('weightModal');
  const modalEdgeInfo = document.getElementById('modalEdgeInfo');
  const modalWeightInput = document.getElementById('modalWeightInput');
  const modalError = document.getElementById('modalError');
  
  modalEdgeInfo.textContent = `Enter weight for edge ${from}-${to}:`;
  modalWeightInput.value = '';
  modalError.classList.remove('active');
  modal.classList.add('active');
  modalWeightInput.focus();
  
  modalWeightInput.onkeypress = function(e) {
    if (e.key === 'Enter') {
      confirmWeight();
    }
  };
}

function confirmWeight() {
  const modalWeightInput = document.getElementById('modalWeightInput');
  const modalError = document.getElementById('modalError');
  const weight = modalWeightInput.value.trim();
  
  if (weight === '') {
    modalError.textContent = 'Please enter a weight!';
    modalError.classList.add('active');
    return;
  }
  
  const w = parseInt(weight);
  if (isNaN(w) || w <= 0) {
    modalError.textContent = 'Please enter a valid positive number!';
    modalError.classList.add('active');
    return;
  }
  
  drawEdge(pendingEdge.from, pendingEdge.to, w);
  stepsDiv.innerText += `✓ Added edge ${pendingEdge.from}-${pendingEdge.to} with weight ${w}\n`;
  stepsDiv.scrollTop = stepsDiv.scrollHeight;
  
  closeWeightModal();
}

function cancelWeight() {
  stepsDiv.innerText += `❌ Cancelled edge ${pendingEdge.from}-${pendingEdge.to}\n`;
  closeWeightModal();
}

function closeWeightModal() {
  const modal = document.getElementById('weightModal');
  modal.classList.remove('active');
  pendingEdge = null;
}

function showNotification(message, type) {
  console.log(message);
}

function generateRandomGraph() {
  resetGraph();

  const nodeCount = parseInt(document.getElementById("nodeCount").value);
  const density = document.getElementById("density").value;

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

  nodes.forEach((node) => {
    svg.appendChild(node.circle);
    svg.appendChild(node.text);
  });
}

function pauseResume() {
  if (!running) return;
  paused = !paused;
  if (!paused) stepFunc();
}

function runAlgorithm() {
  if (edges.length === 0) {
    alert("Please create a graph first!");
    return;
  }

  isInteractiveMode = false;

  resetSteps();
  let algo = document.getElementById("algo").value;
  if (algo === "kruskal") runKruskal();
  else runPrim();
}

function resetSteps() {
  stepsDiv.innerText = "";
  resultDiv.innerText = "";
  running = true;
  paused = false;
  clearTimeout(timer);
}

function runKruskal() {
  let startTime = performance.now();
  let parent = {};
  nodes.forEach((n) => (parent[n.id] = n.id));

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

  let sorted = [...edges].sort((a, b) => a.w - b.w);
  let mstCost = 0,
    i = 0;

  stepFunc = function step() {
    if (paused) return;
    if (i >= sorted.length) {
      let endTime = performance.now();
      resultDiv.innerText = `MST Complete (Kruskal)\nFinal Cost: ${mstCost}\nTotal Time: ${(
        endTime - startTime
      ).toFixed(2)} ms`;
      running = false;
      return;
    }
    let e = sorted[i];
    let nowTime = performance.now();
    stepsDiv.innerText += `Step ${i + 1}: Considering ${e.u}-${e.v} (${e.w})\n`;
    if (union(e.u, e.v)) {
      e.line.setAttribute("stroke", "#66bb6a");
      e.line.setAttribute("stroke-width", 5);
      mstCost += e.w;
      stepsDiv.innerText += `   Added | Cost: ${mstCost} | Time: ${(
        nowTime - startTime
      ).toFixed(2)} ms\n`;
    } else {
      e.line.setAttribute("stroke", "#ef5350");
      stepsDiv.innerText += `   Skipped | Cost: ${mstCost} | Time: ${(
        nowTime - startTime
      ).toFixed(2)} ms\n`;
    }
    stepsDiv.scrollTop = stepsDiv.scrollHeight;
    i++;
    timer = setTimeout(stepFunc, 1000);
  };
  stepFunc();
}

function runPrim() {
  let startTime = performance.now();
  let mstCost = 0,
    i = 0;
  let visited = new Set();
  let edgesAvailable = [];

  let src = document.getElementById("sourceVertex").value.trim();
  if (!src) {
    alert("Please enter a source vertex for Prim's algorithm!");
    running = false;
    return;
  }
  if (!nodes.find((n) => n.id === src)) {
    alert(`Source vertex '${src}' not found in graph!`);
    running = false;
    return;
  }

  visited.add(src);
  addEdges(src);

  function addEdges(u) {
    edges
      .filter(
        (e) =>
          (e.u === u && !visited.has(e.v)) || (e.v === u && !visited.has(e.u))
      )
      .forEach((e) => edgesAvailable.push(e));
  }

  stepFunc = function step() {
    if (paused) return;
    if (visited.size === nodes.length) {
      let endTime = performance.now();
      resultDiv.innerText = `MST Complete (Prim)\nFinal Cost: ${mstCost}\nTotal Time: ${(
        endTime - startTime
      ).toFixed(2)} ms`;
      running = false;
      return;
    }
    edgesAvailable.sort((a, b) => a.w - b.w);
    let e = edgesAvailable.shift();
    let nowTime = performance.now();
    stepsDiv.innerText += `Step ${i + 1}: Considering ${e.u}-${e.v} (${e.w})\n`;

    let u = e.u,
      v = e.v;
    if (visited.has(u) && visited.has(v)) {
      e.line.setAttribute("stroke", "#ef5350");
      e.line.setAttribute("stroke-width", 3);
      stepsDiv.innerText += `Skipped (cycle)\n`;
    } else {
      e.line.setAttribute("stroke", "#66bb6a");
      e.line.setAttribute("stroke-width", 5);
      mstCost += e.w;
      let newNode = visited.has(u) ? v : u;
      visited.add(newNode);
      addEdges(newNode);
      stepsDiv.innerText += `Added | Cost: ${mstCost} | Time: ${(
        nowTime - startTime
      ).toFixed(2)} ms\n`;
    }
    stepsDiv.scrollTop = stepsDiv.scrollHeight;
    i++;
    timer = setTimeout(stepFunc, 1000);
  };
  stepFunc();
}
=======
let nodes = [];
let edges = [];
let svg = document.getElementById("graph");
let stepsDiv = document.getElementById("steps");
let resultDiv = document.getElementById("result");

let running = false;
let paused = false;
let stepFunc;
let timer;

// Drag and drop variables
let isInteractiveMode = false;
let dragStartNode = null;
let tempLine = null;

function resetGraph() {
  svg.innerHTML = "";
  nodes = [];
  edges = [];
  stepsDiv.innerText = "";
  resultDiv.innerText = "";
  running = false;
  paused = false;
  isInteractiveMode = false;
  dragStartNode = null;
  tempLine = null;
  clearTimeout(timer);
}

function toggleSourceInput() {
  let algo = document.getElementById("algo").value;
  document.getElementById("sourceInputDiv").style.display =
    algo === "prim" ? "block" : "none";
}

function drawNode(id, x, y, interactive = false) {
  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", 18);
  circle.setAttribute("fill", "#0277bd");
  circle.setAttribute("stroke", "white");
  circle.setAttribute("stroke-width", "3");
  circle.setAttribute("class", "node");
  if (interactive) {
    circle.style.cursor = "pointer";
  }

  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y + 5);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "white");
  text.setAttribute("font-weight", "bold");
  text.setAttribute("font-size", "14");
  text.setAttribute("class", "node");
  text.textContent = id;
  if (interactive) {
    text.style.cursor = "pointer";
    text.style.pointerEvents = "none"; // Let clicks pass through to circle
  }

  // Add drag event listeners if in interactive mode
  if (interactive) {
    circle.addEventListener("mousedown", (e) =>
      handleNodeMouseDown(e, { id, x, y, circle, text })
    );
    circle.addEventListener("mouseup", (e) =>
      handleNodeMouseUp(e, { id, x, y, circle, text })
    );
  }

  nodes.push({ id, x, y, circle, text });
}

function drawEdge(u, v, w) {
  let n1 = nodes.find((n) => n.id === u);
  let n2 = nodes.find((n) => n.id === v);
  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", n1.x);
  line.setAttribute("y1", n1.y);
  line.setAttribute("x2", n2.x);
  line.setAttribute("y2", n2.y);
  line.setAttribute("stroke", "#90caf9");
  line.setAttribute("stroke-width", 3);
  svg.appendChild(line);

  let midX = (n1.x + n2.x) / 2;
  let midY = (n1.y + n2.y) / 2;
  let bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bgRect.setAttribute("x", midX - 12);
  bgRect.setAttribute("y", midY - 15);
  bgRect.setAttribute("width", 24);
  bgRect.setAttribute("height", 20);
  bgRect.setAttribute("fill", "white");
  bgRect.setAttribute("rx", 4);
  svg.appendChild(bgRect);

  let label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("x", midX);
  label.setAttribute("y", midY);
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("fill", "#0277bd");
  label.setAttribute("font-weight", "bold");
  label.setAttribute("font-size", "12");
  label.textContent = w;
  svg.appendChild(label);

  edges.push({ u, v, w, line, bgRect, label });
}

// New function: Create interactive graph
function createInteractiveGraph() {
  resetGraph();
  isInteractiveMode = true;

  const nodeCount = parseInt(document.getElementById("nodeCount").value);
  let radius = 180;
  let centerX = 250;
  let centerY = 250;

  // Create nodes in a circle
  for (let i = 0; i < nodeCount; i++) {
    let angle = (2 * Math.PI * i) / nodeCount;
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);
    let label = String.fromCharCode(65 + i);
    drawNode(label, x, y, true);
  }

  // Append all nodes to SVG
  nodes.forEach((node) => {
    svg.appendChild(node.circle);
    svg.appendChild(node.text);
  });

  // Add mouse move listener to SVG
  svg.addEventListener("mousemove", handleSvgMouseMove);
  svg.addEventListener("mouseleave", handleSvgMouseLeave);

  stepsDiv.innerText =
    "Interactive Mode Active!\nDrag from one node to another to create edges.\n\n";
}

// Handle mouse down on node
function handleNodeMouseDown(e, node) {
  if (!isInteractiveMode) return;
  e.preventDefault();
  dragStartNode = node;

  // Create temporary line
  tempLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  tempLine.setAttribute("x1", node.x);
  tempLine.setAttribute("y1", node.y);
  tempLine.setAttribute("x2", node.x);
  tempLine.setAttribute("y2", node.y);
  tempLine.setAttribute("stroke", "#ffd54f");
  tempLine.setAttribute("stroke-width", "2");
  tempLine.setAttribute("stroke-dasharray", "5,5");
  svg.insertBefore(tempLine, svg.firstChild); // Add to back
}

// Handle mouse move over SVG
function handleSvgMouseMove(e) {
  if (!isInteractiveMode || !dragStartNode || !tempLine) return;

  const svgRect = svg.getBoundingClientRect();
  const x = e.clientX - svgRect.left;
  const y = e.clientY - svgRect.top;

  tempLine.setAttribute("x2", x);
  tempLine.setAttribute("y2", y);
}

// Handle mouse leave SVG
function handleSvgMouseLeave(e) {
  if (tempLine && dragStartNode) {
    svg.removeChild(tempLine);
    tempLine = null;
    dragStartNode = null;
  }
}

// Handle mouse up on node
function handleNodeMouseUp(e, endNode) {
  if (!isInteractiveMode || !dragStartNode) return;

  // Remove temporary line
  if (tempLine) {
    svg.removeChild(tempLine);
    tempLine = null;
  }

  // Check if we're dropping on a different node
  if (endNode.id !== dragStartNode.id) {
    // Check if edge already exists
    const existingEdge = edges.find(
      (edge) =>
        (edge.u === dragStartNode.id && edge.v === endNode.id) ||
        (edge.u === endNode.id && edge.v === dragStartNode.id)
    );

    if (existingEdge) {
      alert(
        `Edge already exists between ${dragStartNode.id} and ${endNode.id}!`
      );
      stepsDiv.innerText += `❌ Edge ${dragStartNode.id}-${endNode.id} already exists!\n`;
    } else {
      // Prompt for weight
      const weight = prompt(
        `Enter weight for edge ${dragStartNode.id}-${endNode.id}:`,
        "5"
      );

      if (weight !== null && weight.trim() !== "") {
        const w = parseInt(weight);
        if (!isNaN(w) && w > 0) {
          drawEdge(dragStartNode.id, endNode.id, w);
          stepsDiv.innerText += `✓ Added edge ${dragStartNode.id}-${endNode.id} with weight ${w}\n`;
          stepsDiv.scrollTop = stepsDiv.scrollHeight;
        } else {
          alert("Please enter a valid positive number for the weight!");
          stepsDiv.innerText += `❌ Invalid weight for edge ${dragStartNode.id}-${endNode.id}\n`;
        }
      }
    }
  }

  dragStartNode = null;
}

function generateRandomGraph() {
  resetGraph();

  const nodeCount = parseInt(document.getElementById("nodeCount").value);
  const density = document.getElementById("density").value;

  let radius = 180;
  let centerX = 250;
  let centerY = 250;

  // First, create all nodes and store them
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

  // Draw all edges first
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

  // Now append all nodes to SVG (so they appear on top)
  nodes.forEach((node) => {
    svg.appendChild(node.circle);
    svg.appendChild(node.text);
  });
}

// function loadUserGraph() {
//   resetGraph();
//   let input = document.getElementById("graphInput").value.trim().split("\n");
//   let nodeSet = new Set();

//   input.forEach((line) => {
//     let [nodesPart, w] = line.split(":");
//     if (!nodesPart || !w) return;
//     let [u, v] = nodesPart.split("-");
//     u = u.trim();
//     v = v.trim();
//     nodeSet.add(u);
//     nodeSet.add(v);
//   });

//   let radius = 200,
//     centerX = 250,
//     centerY = 250;
//   let nodeList = Array.from(nodeSet);
//   nodeList.forEach((id, i) => {
//     let angle = (2 * Math.PI * i) / nodeList.length;
//     let x = centerX + radius * Math.cos(angle);
//     let y = centerY + radius * Math.sin(angle);
//     drawNode(id, x, y);
//   });

//   input.forEach((line) => {
//     let [nodesPart, w] = line.split(":");
//     if (!nodesPart || !w) return;
//     let [u, v] = nodesPart.split("-");
//     drawEdge(u.trim(), v.trim(), parseInt(w.trim()));
//   });

//   // Append all nodes to SVG last (so they appear on top)
//   nodes.forEach((node) => {
//     svg.appendChild(node.circle);
//     svg.appendChild(node.text);
//   });
// }

function pauseResume() {
  if (!running) return;
  paused = !paused;
  if (!paused) stepFunc();
}

function runAlgorithm() {
  if (edges.length === 0) {
    alert("Please create a graph first!");
    return;
  }

  // Disable interactive mode when running algorithm
  isInteractiveMode = false;

  resetSteps();
  let algo = document.getElementById("algo").value;
  if (algo === "kruskal") runKruskal();
  else runPrim();
}

function resetSteps() {
  stepsDiv.innerText = "";
  resultDiv.innerText = "";
  running = true;
  paused = false;
  clearTimeout(timer);
}

function runKruskal() {
  let startTime = performance.now();
  let parent = {};
  nodes.forEach((n) => (parent[n.id] = n.id));

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

  let sorted = [...edges].sort((a, b) => a.w - b.w);
  let mstCost = 0,
    i = 0;

  stepFunc = function step() {
    if (paused) return;
    if (i >= sorted.length) {
      let endTime = performance.now();
      resultDiv.innerText = `MST Complete (Kruskal)\nFinal Cost: ${mstCost}\nTotal Time: ${(
        endTime - startTime
      ).toFixed(2)} ms`;
      running = false;
      return;
    }
    let e = sorted[i];
    let nowTime = performance.now();
    stepsDiv.innerText += `Step ${i + 1}: Considering ${e.u}-${e.v} (${e.w})\n`;
    if (union(e.u, e.v)) {
      e.line.setAttribute("stroke", "#66bb6a");
      e.line.setAttribute("stroke-width", 5);
      mstCost += e.w;
      stepsDiv.innerText += `   Added | Cost: ${mstCost} | Time: ${(
        nowTime - startTime
      ).toFixed(2)} ms\n`;
    } else {
      e.line.setAttribute("stroke", "#ef5350");
      stepsDiv.innerText += `   Skipped | Cost: ${mstCost} | Time: ${(
        nowTime - startTime
      ).toFixed(2)} ms\n`;
    }
    stepsDiv.scrollTop = stepsDiv.scrollHeight;
    i++;
    timer = setTimeout(stepFunc, 1000);
  };
  stepFunc();
}

function runPrim() {
  let startTime = performance.now();
  let mstCost = 0,
    i = 0;
  let visited = new Set();
  let edgesAvailable = [];

  let src = document.getElementById("sourceVertex").value.trim();
  if (!src) {
    alert("Please enter a source vertex for Prim's algorithm!");
    running = false;
    return;
  }
  if (!nodes.find((n) => n.id === src)) {
    alert(`Source vertex '${src}' not found in graph!`);
    running = false;
    return;
  }

  visited.add(src);
  addEdges(src);

  function addEdges(u) {
    edges
      .filter(
        (e) =>
          (e.u === u && !visited.has(e.v)) || (e.v === u && !visited.has(e.u))
      )
      .forEach((e) => edgesAvailable.push(e));
  }

  stepFunc = function step() {
    if (paused) return;
    if (visited.size === nodes.length) {
      let endTime = performance.now();
      resultDiv.innerText = `MST Complete (Prim)\nFinal Cost: ${mstCost}\nTotal Time: ${(
        endTime - startTime
      ).toFixed(2)} ms`;
      running = false;
      return;
    }
    edgesAvailable.sort((a, b) => a.w - b.w);
    let e = edgesAvailable.shift();
    let nowTime = performance.now();
    stepsDiv.innerText += `Step ${i + 1}: Considering ${e.u}-${e.v} (${e.w})\n`;

    let u = e.u,
      v = e.v;
    if (visited.has(u) && visited.has(v)) {
      e.line.setAttribute("stroke", "#ef5350");
      e.line.setAttribute("stroke-width", 3);
      stepsDiv.innerText += `Skipped (cycle)\n`;
    } else {
      e.line.setAttribute("stroke", "#66bb6a");
      e.line.setAttribute("stroke-width", 5);
      mstCost += e.w;
      let newNode = visited.has(u) ? v : u;
      visited.add(newNode);
      addEdges(newNode);
      stepsDiv.innerText += `Added | Cost: ${mstCost} | Time: ${(
        nowTime - startTime
      ).toFixed(2)} ms\n`;
    }
    stepsDiv.scrollTop = stepsDiv.scrollHeight;
    i++;
    timer = setTimeout(stepFunc, 1000);
  };
  stepFunc();
}
>>>>>>> 04753c22652d39282137ce26cc6a281e184a4175
