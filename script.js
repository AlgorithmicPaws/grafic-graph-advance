var nodes = null;
var edges = null;
var network = null;
var data = {
    nodes: nodes,
    edges: edges,
  }
function draw() {
  destroy();
  nodes = [];
  edges = [];

  var container = document.getElementById("mynetwork");
  var options = {
    interaction: { keyboard: true },
    manipulation: {
      addNode: function (data, callback) {
        document.getElementById("operation").innerText = "Add Node";
        document.getElementById("node-id").value = data.id;
        document.getElementById("node-label").value = data.label;
        document.getElementById("node-label").value = data.title;
        document.getElementById("saveButton").onclick = saveData.bind(this, data, callback);
        document.getElementById("cancelButton").onclick = clearPopUp.bind();
        document.getElementById("network-popUp").style.display = "block";
      },
      editNode: function (data, callback) {
        document.getElementById("operation").innerText = "Edit Node";
        document.getElementById("node-id").value = data.id;
        document.getElementById("node-label").value = data.label;
        document.getElementById("saveButton").onclick = saveData.bind(this, data, callback);
        document.getElementById("cancelButton").onclick = cancelEdit.bind(this, callback);
        document.getElementById("network-popUp").style.display = "block";
      },
      addEdge: function (data, callback)  {
        document.getElementById("edge-operation").innerText = "Add Edge";
        editEdgeWithoutDrag(data, callback);
      },
      editEdge:{
        editWithoutDrag: function (data, callback) {
          document.getElementById("edge-operation").innerText =
            "Edit Edge";
          editEdgeWithoutDrag(data, callback);
        },
      },
    },
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
        strokeWidth: "2px",
      },
      
    },
  };
  network = new vis.Network(container, data, options);
}

function clearPopUp() {
  document.getElementById("saveButton").onclick = null;
  document.getElementById("cancelButton").onclick = null;
  document.getElementById("network-popUp").style.display = "none";
}

function cancelEdit(callback) {
  clearPopUp();
  callback(null);
}

function saveData(data, callback) {
  data.id = document.getElementById("node-id").value;
  data.label = document.getElementById("node-label").value;
  data.title = document.getElementById("node-title").value+ "\n Prerequisite: " +document.getElementById("node-prerequisite").value;
  document.getElementById("node-id").value = "";
  document.getElementById("node-label").value = "";
  document.getElementById("node-title").value = "";
  document.getElementById("node-prerequisite").value = "";
  clearPopUp();
  callback(data);
}

function editEdgeWithoutDrag(data, callback) {

  document.getElementById("edge-label").value = data.label;
  document.getElementById("edge-saveButtonBi").onclick = saveEdgeDataBi.bind(this,data,callback);
  document.getElementById("edge-saveButtonUni").onclick = saveEdgeDataUni.bind(this,data,callback);
  document.getElementById("edge-cancelButton").onclick =cancelEdgeEdit.bind(this, callback);
  document.getElementById("edge-popUp").style.display = "block";
}
function clearEdgePopUp() {
  document.getElementById("edge-saveButtonBi").onclick = null;
  document.getElementById("edge-saveButtonUni").onclick = null;
  document.getElementById("edge-cancelButton").onclick = null;
  document.getElementById("edge-popUp").style.display = "none";
}
function cancelEdgeEdit(callback) {
  clearEdgePopUp();
  callback(null);
}

function saveEdgeDataBi(data, callback) {
  if (typeof data.to === "object") data.to = data.to.id;
  if (typeof data.from === "object") data.from = data.from.id;
  data.label = document.getElementById("edge-label").value;
  data.arrows = null;
  clearEdgePopUp();
  callback(data);
}
function saveEdgeDataUni(data, callback) {
  if (typeof data.to === "object") data.to = data.to.id;
  if (typeof data.from === "object") data.from = data.from.id;
  data.label = document.getElementById("edge-label").value;
  data.arrows = "to";
  clearEdgePopUp();
  callback(data);
}

function init() {
  draw();
}

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}