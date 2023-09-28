var nodes, edges, network;
let adjacencyMatrix = [];
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
  // create an array with edges
  edges = new vis.DataSet();
  edges.on("*", function () {
    document.getElementById("edges").innerText = JSON.stringify(
      edges.get(),
      null,
      4
    );
    displayAdjacencyMatrix(nodes.get(), edges.get());
    displayIncidenceMatrix(nodes.get(), edges.get());
  });
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

//CRUD Graph
function addNode() {
  try {
    nodes.add({
      id: document.getElementById("node-id").value,
      label: document.getElementById("node-label").value,
      title: document.getElementById("node-title").value +
      "\n Prerequisite: " + document.getElementById("node-prerequisite").value,
      
    });

  } catch (err) { 
    alert(err);
  }
}
function updateNode() {
  try {
    nodes.update({
      id: document.getElementById("node-id").value,
      label: document.getElementById("node-label").value,
      title: document.getElementById("node-title").value +
      "\n Prerequisite: " + document.getElementById("node-prerequisite").value,
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
  var edgeType = document.getElementById("edge-type").value;

    try {
      if (edgeType === "bidirectional") {
      edges.add({
        id: document.getElementById("edge-id").value,
        from: document.getElementById("edge-from").value,
        to: document.getElementById("edge-to").value,
        label: document.getElementById("edge-label").value,
        arrows: null,
      });
    }
    else {
        edges.add({
          id: document.getElementById("edge-id").value,
          from: document.getElementById("edge-from").value,
          to: document.getElementById("edge-to").value,
          label: document.getElementById("edge-label").value,
          arrows: "to",
        });
    } }
    catch (err) {
      alert(err);
    }
    document.getElementById("edge-type").value = "";
    document.getElementById("edge-id").value = "";
    document.getElementById("edge-from").value = "";
    document.getElementById("edge-to").value = "";
    document.getElementById("edge-lable").value = "";
  } 
function removeEdge() {
  try {
    edges.remove({ id: document.getElementById("edge-id").value });
  } catch (err) {
    alert(err);
  }
}

function displayAdjacencyMatrix(nodes, edges) {
  const nodeCount = nodes.length;
  adjacencyMatrix = []; // Initialize the adjacency matrix as an empty array

  // Create an array of node IDs for easy reference
  const nodeIds = nodes.map((node) => node.id);

  // Create the header row with node IDs, including an empty cell at the top-left corner
  const headerRow = [''].concat(nodeIds);
  adjacencyMatrix.push(headerRow);

  for (let i = 0; i < nodeCount; i++) {
    const row = [nodeIds[i]]; // The first cell in each row is the node ID
    for (let j = 0; j < nodeCount; j++) {
      row.push(0); // Initialize all other entries to 0
    }
    adjacencyMatrix.push(row);
  }

  edges.forEach((edge) => {
    const fromIndex = nodeIds.indexOf(edge.from);
    const toIndex = nodeIds.indexOf(edge.to);
    console.log(edge.arrows)
    if (fromIndex !== -1 && toIndex !== -1) {
      // Check if the edge is directional or not based on the "arrows" attribute
      if (edge.arrows !== "to") {
        // If it's not directional, consider it bidirectional by setting both entries
        adjacencyMatrix[fromIndex + 1][toIndex + 1] = parseFloat(edge.label);
        adjacencyMatrix[toIndex + 1][fromIndex + 1] = parseFloat(edge.label);
      } else {
        // If it's directional, set the entry only in the "from" to "to" direction
        adjacencyMatrix[fromIndex + 1][toIndex + 1] = parseFloat(edge.label);
      }
    }
  });

  // Convert the adjacency matrix to a string and format it for display
  const matrixString = adjacencyMatrix.map((row) => row.join('   ')).join('\n');

  // Update the content of the HTML element with the adjacency matrix
  const preElement = document.getElementById('adjacency-matrix');
  preElement.textContent = matrixString;
}



function displayIncidenceMatrix(nodes, edges) {
  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  const matrix = [];

  // Create an array of node IDs for easy reference
  const nodeIds = nodes.map((node) => node.id);

  for (let i = 0; i < nodeCount; i++) {
    matrix[i] = [];
    for (let j = 0; j < edgeCount; j++) {
      matrix[i][j] = 0;
    }
  }

  edges.forEach((edge, j) => {
    const fromIndex = nodeIds.indexOf(edge.from);
    const toIndex = nodeIds.indexOf(edge.to);

    // Check if the edge is directed or not
    if (edge.arrows === "to") {
      matrix[fromIndex][j] = -1;
      matrix[toIndex][j] = 1;
    } else {
      matrix[fromIndex][j] = 1;
      matrix[toIndex][j] = 1;
    }
  });

  const matrixString = matrix.map((row) => row.join('  ')).join('\n');

  const preElement = document.getElementById('incidence-matrix');
  preElement.textContent = matrixString;
}



// Export and import info

function exportToDOT() {
  // Initialize an empty DOT string
  var dotString = 'digraph mynetwork {\n';

  // Get the current nodes and edges data
  var currentNodes = nodes.get();
  var currentEdges = edges.get();

  // Add nodes to the DOT string
  currentNodes.forEach(function (node) {
    dotString += '"' + node.id + '" [label="' + node.label + '", title="' + node.title + '"] ;\n';


  });

  // Add edges to the DOT string
  currentEdges.forEach(function (edge) {
    if (edge.arrows === null) {
      dotString += '  "' + edge.from + '" -- "' + edge.to  + '" [label="' + edge.label + '", arrows="' + edge.arrows + '"] ;\n';
    } else {
      dotString += '  "' + edge.from + '" -> "' + edge.to  + '" [label="' + edge.label + '", arrows="' + edge.arrows + '"] ;\n';
    }
  });

  // Close the DOT string
  dotString += '}';

  // Create a Blob with the DOT data
  var blob = new Blob([dotString], { type: 'text/plain' });

  // Create a URL for the Blob
  var url = window.URL.createObjectURL(blob);

  // Create a download link for the user
  var a = document.createElement('a');
  a.href = url;
  a.download = 'graph.txt';
  a.style.display = 'none';

  // Add the download link to the document and trigger a click event
  document.body.appendChild(a);
  a.click();

  // Clean up by removing the download link and revoking the URL
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}function uploadAndImportDOT() {
  // Trigger the file input when the "Import Graph" anchor tag is clicked
  document.getElementById("fileInput").click();
}

// Add an event listener to the file input to handle file selection

function uploadAndImportDOT() {
  document.getElementById("fileInput").click();
}
document.getElementById("fileInput").addEventListener("change", handleFileUpload);

// Function to handle the selected file and import the graph
function handleFileUpload(event) {
  var fileInput = event.target;
  if (fileInput.files.length > 0) {
    var file = fileInput.files[0];

    // Check if the selected file is a text file
    if (file.type === 'text/plain') {
      var reader = new FileReader();

      reader.onload = function(event) {
        var dotString = event.target.result;

        // Clear existing data
        nodes.clear();
        edges.clear();

        // Parse the DOT language string
        var parsedData = vis.parseDOTNetwork(dotString);

        // Update your existing nodes and edges data
        nodes.update(parsedData.nodes);
        edges.update(parsedData.edges);
      };

      reader.readAsText(file);
    } else {
      alert('Please select a valid text file.');
    }
  } else {
    alert('Please select a file to upload.');
  }
}
function findMinimumPath() {
  // Get the start and end node IDs from user input
  const startNodeId = document.getElementById("start-mnode").value;
  const endNodeId = document.getElementById("end-mnode").value;

  // Find the indices of start and end nodes in the adjacency matrix
  const startIndex = adjacencyMatrix.findIndex(row => row[0] === startNodeId);
  const endIndex = adjacencyMatrix.findIndex(row => row[0] === endNodeId);

  if (startIndex === -1 || endIndex === -1) {
    alert("Start or end node not found in the adjacency matrix.");
    return;
  }

  // Initialize variables for Dijkstra's algorithm
  const numNodes = adjacencyMatrix.length;
  const visited = Array(numNodes).fill(false);
  const distances = Array(numNodes).fill(Infinity);
  distances[startIndex] = 0;
  const previous = Array(numNodes).fill(null);

  // Dijkstra's algorithm
  for (let i = 0; i < numNodes - 1; i++) {
    const minDistanceNodeIndex = findMinDistanceNode(distances, visited);
    visited[minDistanceNodeIndex] = true;

    for (let j = 0; j < numNodes; j++) {
      if (!visited[j] && adjacencyMatrix[minDistanceNodeIndex][j] !== 0) {
        const potentialDistance = distances[minDistanceNodeIndex] + adjacencyMatrix[minDistanceNodeIndex][j];
        if (potentialDistance < distances[j]) {
          distances[j] = potentialDistance;
          previous[j] = minDistanceNodeIndex;
        }
      }
    }
  }

  // Reconstruct the minimum path
  const path = [];
  let currentNodeIndex = endIndex;
  while (currentNodeIndex !== null) {
    const currentNodeId = adjacencyMatrix[currentNodeIndex][0];
        // Add current node to the path
    path.unshift(currentNodeId);

        // Update the color of the current node in the network visualization
    network.body.data.nodes.update([{ id: currentNodeId, color: { background: '#5e03fc', border: '#2302c9' } }]);
        
    currentNodeIndex = previous[currentNodeIndex];

  }
  console.log(path)
  // Display the minimum path result
  const resultElement = document.getElementById("minimum-path-result");
  if (path.length === 0) {
    resultElement.textContent = "No path found.";
  } else {
    resultElement.textContent = "Minimum Path: " + path.join(" -> ");
  }
}


function findMinDistanceNode(distances, visited) {
  let minDistance = Infinity;
  let minDistanceIndex = -1;

  for (let i = 0; i < distances.length; i++) {
    if (!visited[i] && distances[i] < minDistance) {
      minDistance = distances[i];
      minDistanceIndex = i;
    }
  }

  return minDistanceIndex;
}

function findCriticalPath() {
  // Get the start and end node IDs from user input
  const startNodeId = document.getElementById("start-cnode").value;
  const endNodeId = document.getElementById("end-cnode").value;

  // Find the indices of start and end nodes in the adjacency matrix
  const startIndex = adjacencyMatrix.findIndex(row => row[0] === startNodeId);
  const endIndex = adjacencyMatrix.findIndex(row => row[0] === endNodeId);

  if (startIndex === -1 || endIndex === -1) {
    alert("Start or end node not found in the adjacency matrix.");
    return;
  }

  // Initialize variables for critical path
  const numNodes = adjacencyMatrix.length;
  const visited = Array(numNodes).fill(false);
  const distances = Array(numNodes).fill(-Infinity); // Initialize distances to negative infinity
  distances[startIndex] = 0;
  const previous = Array(numNodes).fill(null);

  // Critical Path Algorithm (Longest Path)
  for (let i = 0; i < numNodes - 1; i++) {
    const maxDistanceNodeIndex = findMaxDistanceNode(distances, visited);
    visited[maxDistanceNodeIndex] = true;

    let currentNodeIndex = maxDistanceNodeIndex; // Initialize currentNodeIndex

    for (let j = 0; j < numNodes; j++) {
      if (!visited[j] && adjacencyMatrix[currentNodeIndex][j] !== 0) {
        const potentialDistance = distances[currentNodeIndex] + adjacencyMatrix[currentNodeIndex][j];
        if (potentialDistance > distances[j]) {
          distances[j] = potentialDistance;
          previous[j] = currentNodeIndex;
        }
      }
    }

    // Check if there are unvisited connected nodes
    let foundUnvisited = false;
    for (let j = 0; j < numNodes; j++) {
      if (!visited[j] && adjacencyMatrix[currentNodeIndex][j] !== 0) {
        foundUnvisited = true;
        break;
      }
    }

    // If there are no unvisited connected nodes, break out of the loop
    if (!foundUnvisited && currentNodeIndex === endIndex) {
      break;
    }
  }

  // Reconstruct the critical path (longest path)
  const criticalPath = [];
  let currentNodeIndex = endIndex;
  while (currentNodeIndex !== null) {
    const currentNodeId = adjacencyMatrix[currentNodeIndex][0];
    if (currentNodeId) {
      criticalPath.unshift(currentNodeId); // Add current node to the critical path
      network.body.data.nodes.update([{ id: currentNodeId, color: { background: '#5e03fc', border: '#2302c9' } }]);
    }
    currentNodeIndex = previous[currentNodeIndex];
  }

  // Display the critical path result
  const resultElement = document.getElementById("critical-path-result");
  if (criticalPath.length === 0) {
    resultElement.textContent = "No critical path found.";
  } else {
    resultElement.textContent = "Critical Path (Longest Path): " + criticalPath.join(" -> ");
  }
}



function findMaxDistanceNode(distances, visited) {
  let maxDistance = -Infinity;
  let maxDistanceIndex = -1;

  for (let i = 0; i < distances.length; i++) {
    if (!visited[i] && distances[i] > maxDistance) {
      maxDistance = distances[i];
      maxDistanceIndex = i;
    }
  }

  return maxDistanceIndex;
}




// Dom funtions
function displayInfoSection() {
  var infoNode = document.getElementById("graphInfo");
  if (infoNode.style.display === "none" || infoNode.style.display === "") {
    infoNode.style.display = "block";
  } else {
    infoNode.style.display = "none";
  }
}
function displayAdjaMatrix() {
  var section = document.getElementById("matrixes");
  if (section.style.display === "none" || section.style.display === "") {
    section.style.display = "block";
  } else {
    section.style.display = "none";
  }
}
function displayEdit() {
  var popUpDisplay = document.getElementById("edit-popUp");
  var minPathPopup  = document.getElementById("mpath-popUp");
  var cPathPopup  = document.getElementById("cpath-popUp");
  if (popUpDisplay.style.display === "none" || popUpDisplay.style.display === "") {
    minPathPopup.style.display = "none"
    const allNodes = nodes.get();
    const resetNodeColors = allNodes.map((node) => ({ id: node.id, color: { background: '#FE7BE5', border: '#d6116d' } }));
    network.body.data.nodes.update(resetNodeColors);
    cPathPopup.style.display = "none"
    popUpDisplay.style.display = "block";
  } else {
    popUpDisplay.style.display = "none";
  }
}
function showMinPathPopup() {
  var popUpDisplay = document.getElementById("edit-popUp");
  var minPathPopup  = document.getElementById("mpath-popUp");
  var cPathPopup  = document.getElementById("cpath-popUp");
  if (minPathPopup.style.display === "none" || minPathPopup.style.display === "") {
    cPathPopup.style.display = "none"
    popUpDisplay.style.display = "none";
    minPathPopup.style.display = "block";
  } else {
    const allNodes = nodes.get();
    const resetNodeColors = allNodes.map((node) => ({ id: node.id, color: { background: '#FE7BE5', border: '#d6116d' } }));
    network.body.data.nodes.update(resetNodeColors);
    minPathPopup.style.display = "none";
  }
}
function showCriticalPathPopup() {
  var popUpDisplay = document.getElementById("edit-popUp");
  var minPathPopup  = document.getElementById("mpath-popUp");
  var cPathPopup  = document.getElementById("cpath-popUp");
  if (cPathPopup.style.display === "none" || cPathPopup.style.display === "") {
    minPathPopup.style.display = "none"
    const allNodes = nodes.get();
    const resetNodeColors = allNodes.map((node) => ({ id: node.id, color: { background: '#FE7BE5', border: '#d6116d' } }));
    network.body.data.nodes.update(resetNodeColors);
    popUpDisplay.style.display = "none";
    cPathPopup.style.display = "block";
  } else {
    cPathPopup.style.display = "none";
  }
}


function toggleSubmenu(submenuId) {
  var submenu = document.getElementById(submenuId);
  if (submenu.style.display === "none" || submenu.style.display === "") {
      submenu.style.display = "block";
  } else {
      submenu.style.display = "none";
  }
}
function toggleIconClass(submenuId) {
  const iconElement = document.getElementById(submenuId + '-icon'); // Get the <i> element by ID
  if (iconElement) {
      // Toggle between 'uil-angle-left' and 'uil-angle-right' classes
      if (iconElement.classList.contains('uil-angle-left')) {
          iconElement.classList.remove('uil-angle-left');
          iconElement.classList.add('uil-angle-down');
      } else {
          iconElement.classList.remove('uil-angle-down');
          iconElement.classList.add('uil-angle-left');
      }
  }
}
// convenience method to stringify a JSON object
function toJSON(obj) {
  return JSON.stringify(obj, null, 4);
}

//Draw graph
window.addEventListener("load", () => {
  draw();
});