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
  displayAdjacencyMatrix(nodes.get(), edges.get());
  displayIncidenceMatrix(nodes.get(), edges.get());

} 

// convenience method to stringify a JSON object
function toJSON(obj) {
  return JSON.stringify(obj, null, 4);
}
function displayEdit() {
  document.getElementById("edit-popUp").style.display = "block";
}
function toggleSubmenu(submenuId) {
  var submenu = document.getElementById(submenuId);
  if (submenu.style.display === "none" || submenu.style.display === "") {
      submenu.style.display = "block";
  } else {
      submenu.style.display = "none";
  }
}
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
  // Obtén el valor del elemento select con ID "edge-type"
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

function exportToDOT() {
  // Initialize an empty DOT string
  var dotString = 'digraph mynetwork {\n';

  // Get the current nodes and edges data
  var currentNodes = nodes.get();
  var currentEdges = edges.get();

  // Add nodes to the DOT string
  currentNodes.forEach(function (node) {
    dotString += '  "' + node.id + '" [label="' + node.label + '"];\n';
  });

  // Add edges to the DOT string
  currentEdges.forEach(function (edge) {
    dotString += '  "' + edge.from + '" -> "' + edge.to + '";\n';
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
}


function uploadAndImportDOT() {
  var fileInput = document.getElementById('fileInput');
  
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

        // You can also extend the options if needed
        var updatedOptions = Object.assign({}, options);
        // For example, set node color to 'red'
        updatedOptions.nodes = {
          color: 'red'
        };

        // Create a network with the updated data and options
        network = new vis.Network(container, { nodes, edges }, updatedOptions);
      };
      
      reader.readAsText(file);
    } else {
      alert('Please select a valid text file.');
    }
  } else {
    alert('Please select a file to upload.');
  }
}

function displayAdjacencyMatrix(nodes, edges) {
  const nodeCount = nodes.length;
  const matrix = [];

  // Create an array of node IDs for easy reference
  const nodeIds = nodes.map((node) => node.id);

  for (let i = 0; i < nodeCount; i++) {
    matrix[i] = [];
    for (let j = 0; j < nodeCount; j++) {
      matrix[i][j] = 0;
    }
  }

  edges.forEach((edge) => {
    const fromIndex = nodeIds.indexOf(edge.from);
    const toIndex = nodeIds.indexOf(edge.to);
    if (fromIndex !== -1 && toIndex !== -1) {
      matrix[fromIndex][toIndex] = 1;
      // If your graph is undirected, you can also set matrix[toIndex][fromIndex] = 1;
    }
  });

  const matrixString = matrix.map((row) => row.join(' ')).join('\n');

  const preElement = document.getElementById('adjacency-matrix');
  preElement.textContent = matrixString;
}

// Call the function with your nodes and edges


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
    if (fromIndex !== -1) {
      matrix[fromIndex][j] = -1;
    }
    if (toIndex !== -1) {
      matrix[toIndex][j] = 1;
    }
  });

  const matrixString = matrix.map((row) => row.join(' ')).join('\n');

  const preElement = document.getElementById('incidence-matrix');
  preElement.textContent = matrixString;
}




function createNetwork(nodes, edges, options) {
  // Create a network
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  
  // Extend options as needed
  options.nodes = {
    color: 'red',
    ...options.nodes, // You can extend other options here
  };

  var network = new vis.Network(container, data, options);
}


window.addEventListener("load", () => {
  draw();
});
