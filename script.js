let nodes = [];
let edges = [];
let svg = document.getElementById("graph");
let stepsDiv = document.getElementById("steps");
let resultDiv = document.getElementById("result");

let running = false;
let paused = false;
let stepFunc;
let timer;

function resetGraph() {
  svg.innerHTML = "";
  nodes = [];
  edges = [];
  stepsDiv.innerText = "";
  resultDiv.innerText = "";
  running = false;
  paused = false;
  clearTimeout(timer);
}

function toggleSourceInput() {
  let algo = document.getElementById("algo").value;
  document.getElementById("sourceInputDiv").style.display =
    algo === "prim" ? "block" : "none";
}

function drawNode(id, x, y) {
  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", 18);
  circle.setAttribute("fill", "#0277bd");
  circle.setAttribute("stroke", "white");
  circle.setAttribute("stroke-width", "3");
  circle.setAttribute("class", "node");

  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y + 5);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "white");
  text.setAttribute("font-weight", "bold");
  text.setAttribute("font-size", "14");
  text.setAttribute("class", "node");
  text.textContent = id;

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

  edges.push({ u, v, w, line });
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

function loadUserGraph() {
  resetGraph();
  let input = document.getElementById("graphInput").value.trim().split("\n");
  let nodeSet = new Set();

  input.forEach((line) => {
    let [nodesPart, w] = line.split(":");
    if (!nodesPart || !w) return;
    let [u, v] = nodesPart.split("-");
    u = u.trim();
    v = v.trim();
    nodeSet.add(u);
    nodeSet.add(v);
  });

  let radius = 200,
    centerX = 250,
    centerY = 250;
  let nodeList = Array.from(nodeSet);
  nodeList.forEach((id, i) => {
    let angle = (2 * Math.PI * i) / nodeList.length;
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);
    drawNode(id, x, y);
  });

  input.forEach((line) => {
    let [nodesPart, w] = line.split(":");
    if (!nodesPart || !w) return;
    let [u, v] = nodesPart.split("-");
    drawEdge(u.trim(), v.trim(), parseInt(w.trim()));
  });

  // Append all nodes to SVG last (so they appear on top)
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
      resultDiv.innerText = `✅ MST Complete (Prim)\nFinal Cost: ${mstCost}\nTotal Time: ${(
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
