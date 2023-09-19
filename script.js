var nodes, edges, network;

function draw() {
  // create an array with nodes
  nodes = new vis.DataSet();
  nodes.on("*", function () {
    document.getElementById("nodes").innerText = JSON.stringify(
      nodes.get(),
      null,
      4
    );
  });
  nodes.add([
    { id: "1", label: "Node 1" },
    { id: "2", label: "Node 2" },
    { id: "3", label: "Node 3" },
    { id: "4", label: "Node 4" },
    { id: "5", label: "Node 5" },
  ]);

  // create an array with edges
  edges = new vis.DataSet();
  edges.on("*", function () {
    document.getElementById("edges").innerText = JSON.stringify(
      edges.get(),
      null,
      4
    );
  });
  edges.add([
    { id: "1", from: "1", to: "2" },
    { id: "2", from: "1", to: "3" },
    { id: "3", from: "2", to: "4" },
    { id: "4", from: "2", to: "5" },
  ]);

  // create a network
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
    nodes: {
      shape: "dot",
      size: 20,
      color: "#FE7BE5",
      font: {
        size: 18,
        color: "#ffffff",
      },
      borderWidth: 2,
    },
    edges: {
      color: "#d6116d",
      width: 3,
      font: { 
        size: 18,
        color: "#ffffff",
        strokeWidth: 0.8,
      },
      
    },
  };
  network = new vis.Network(container, data, options);
}

// convenience method to stringify a JSON object
function toJSON(obj) {
  return JSON.stringify(obj, null, 4);
}
function displayNode() {
  document.getElementById("network-popUp").style.display = "block";
}
function displayEdge() {
  document.getElementById("edge-popUp").style.display = "block";
}
function addNode() {
  try {
    nodes.add({
      id: document.getElementById("node-id").value,
      label: document.getElementById("node-label").value,
    });
    document.getElementById("network-popUp").style.display = "block";
  } catch (err) { 
    alert(err);
  }
}

function updateNode() {
  try {
    nodes.update({
      id: document.getElementById("node-id").value,
      label: document.getElementById("node-label").value,
    });
  } catch (err) {
    alert(err);
  }
}
function removeNode() {
  try {
    nodes.remove({ id: document.getElementById("node-id").value });
  } catch (err) {
    alert(err);
  }
}

function addEdge() {
  try {
    edges.add({
      id: document.getElementById("edge-id").value,
      from: document.getElementById("edge-from").value,
      to: document.getElementById("edge-to").value,
    });
  } catch (err) {
    alert(err);
  }
}
function updateEdge() {
  try {
    edges.update({
      id: document.getElementById("edge-id").value,
      from: document.getElementById("edge-from").value,
      to: document.getElementById("edge-to").value,
    });
  } catch (err) {
    alert(err);
  }
}
function removeEdge() {
  try {
    edges.remove({ id: document.getElementById("edge-id").value });
  } catch (err) {
    alert(err);
  }
}


window.addEventListener("load", () => {
  draw();
});
