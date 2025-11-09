// graphDrawing.js - Graph drawing functions

import { state } from './state.js';
import { elements } from './dom.js';
import { handleNodeMouseDown, handleNodeMouseUp } from './interactions.js';

export function drawNode(id, x, y, interactive = false) {
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

  state.nodes.push({ id, x, y, circle, text });
}

export function drawEdge(u, v, w) {
  let n1 = state.nodes.find((n) => n.id === u);
  let n2 = state.nodes.find((n) => n.id === v);
  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", n1.x);
  line.setAttribute("y1", n1.y);
  line.setAttribute("x2", n2.x);
  line.setAttribute("y2", n2.y);
  line.setAttribute("stroke", "#90caf9");
  line.setAttribute("stroke-width", 3);
  elements.svg.appendChild(line);

  let midX = (n1.x + n2.x) / 2;
  let midY = (n1.y + n2.y) / 2;
  let bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bgRect.setAttribute("x", midX - 12);
  bgRect.setAttribute("y", midY - 15);
  bgRect.setAttribute("width", 24);
  bgRect.setAttribute("height", 20);
  bgRect.setAttribute("fill", "white");
  bgRect.setAttribute("rx", 4);
  elements.svg.appendChild(bgRect);

  let label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("x", midX);
  label.setAttribute("y", midY);
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("fill", "#0277bd");
  label.setAttribute("font-weight", "bold");
  label.setAttribute("font-size", "12");
  label.textContent = w;
  elements.svg.appendChild(label);

  state.edges.push({ u, v, w, line, bgRect, label });
}