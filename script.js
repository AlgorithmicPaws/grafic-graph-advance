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


//Display Graph info
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
    if (edge.arrows !== null) {
      matrix[fromIndex][j] = -1;
      matrix[toIndex][j] = 1;
    } else {
      matrix[fromIndex][j] = 1;
      matrix[toIndex][j] = 1;
    }
  });

  const matrixString = matrix.map((row) => row.join(' ')).join('\n');

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
      dotString += '  "' + edge.from + '" -- "' + edge.to  + '" [label="' + edge.label + '"] ;\n';
    } else {
      dotString += '  "' + edge.from + '" -> "' + edge.to  + '" [label="' + edge.label + '"] ;\n';
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

        // You can also extend the options if needed
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
  var section = document.getElementById("matrixs");
  if (section.style.display === "none" || section.style.display === "") {
    section.style.display = "block";
  } else {
    section.style.display = "none";
  }
  var section = document.getElementById("matrixs");
  if (section.style.display === "none" || section.style.display === "") {
    section.style.display = "block";
  } else {
    section.style.display = "none";
  }
}
function displayEdit() {
  var popUpDisplay = document.getElementById("edit-popUp");
  if (popUpDisplay.style.display === "none" || popUpDisplay.style.display === "") {
    popUpDisplay.style.display = "block";
  } else {
    popUpDisplay.style.display = "none";
  }
}
// Get the import graph link by its ID

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
