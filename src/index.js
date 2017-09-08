var vis = require('vis');
var $ = require('jquery');

$('#updateNode').hide()
$('#updateEdge').hide()

// create an array with nodes
var nodes = new vis.DataSet([
  {id: 10, label: 'Node 10', shape:'box'},
  {id: 2, label: 'Node 2', shape:'box'},
  {id: 3, label: 'Node 3', shape:'box'},
  {id: 4, label: 'Node 4', shape:'box'},
  {id: 5, label: 'Node 5', shape:'box'}
]);

// create an array with edges
var edges = new vis.DataSet([
  {from: 10, to: 3, arrows:{to:{enabled:true}}},
  {from: 10, to: 2, arrows:{to:{enabled:true}}},
  {from: 2, to: 4, arrows:{to:{enabled:true}}},
  {from: 2, to: 5, arrows:{to:{enabled:true}}}
]);

// create a network
var container = document.getElementById('myNetwork');

// provide the data in the vis format
var data = {
  nodes: nodes,
  edges: edges
};

var options = {
  interaction:{hover:true}
};

// initialize your network!
var network = new vis.Network(container, data, options);

network.on('click', function(prm){

});

var nodeObj = {id:'', label:''}
var edgeObj = {id:'', label:''}

network.on('doubleClick', function(prm){


  if(prm.nodes.length > 0){

    //if clicked on a node

    nodeObj = nodes._data[prm.nodes[0]];

    //show update panel
    $('#updateNode').show();
    $('#newNodeInput').focus().val(nodeObj.label);

  } else if (prm.edges.length >0 && prm.nodes.length == 0) {
    //if clicked on an edge

    edgeObj = edges._data[prm.edges[0]]

    $('#updateEdge').show()
    $('#newEdgeInput').focus().val(edgeObj.label);



  } else {
    //if clicked on an empty space create new node

    var nodeX = prm.pointer.canvas.x;
    var nodeY = prm.pointer.canvas.y;

    nodeObj.id = uuidv4();

    nodes.add({id:nodeObj.id,label:"new text", x:nodeX, y:nodeY, shape:'box'})

    $('#updateNode').show(200);
    $('#newNodeInput').focus().val('');

  }

});

network.on('dragging', function(prm){
  var pointerPosition = prm.pointer.DOM;
  var dragedNode = prm.nodes[0];

  var dragUponNode = whichNodeColide(dragedNode, pointerPosition)

  if(dragUponNode != undefined && dragedNode != dragUponNode){

    var doEdgeExists = edges.get({
      filter: function(item){
        return (item.from == dragedNode &&  item.to == dragUponNode )
      }
    })


    if (doEdgeExists.length == 0){
      //if an edge do not exit, then create an edge

      edges.update({from:dragedNode, to:dragUponNode, arrows:{to:{enabled:true}} })
    }


  }
})

// --- events in the DOM ---

//update node button click
document.getElementById("updateNodeBtn").addEventListener("click", function(event){

  event.preventDefault()
  var newName =  $('#newNodeInput').val()
  $('#newNameInput').val('')

  nodes.update({id:nodeObj.id, label: newName, shape:'box'})

  $('#updateNode').hide(300)

  nodeObj = {id:'', label:''};

});

//delete node
document.getElementById('deleteNodeBtn').addEventListener('click', function(event){
  event.preventDefault()
  console.log(nodeObj.id)
  //get edges that are connected
  var connectedEdges = network.getConnectedEdges(nodeObj.id)

  edges.remove(connectedEdges);
  nodes.remove(nodeObj.id);
  
})

//update edge button click
document.getElementById("updateEdgeBtn").addEventListener("click", function(event){

  event.preventDefault()

  var newLabel =  $('#newEdgeInput').val()
  $('#newEdgeInput').val('')

  edges.update({id:edgeObj.id, label: newLabel})

  $('#updateEdge').hide(300)

  edgeObj = {id:'', label:''};

});

//delete nodeObj
//update edge button click
document.getElementById("deleteEdgeBtn").addEventListener("click", function(event){

  event.preventDefault()

  edges.remove(edgeObj.id);
  $('#updateEdge').hide(300)

});

//cancel editing, by clicking on the screen
document.getElementById("updateNode").addEventListener('click', function(event){

  $('#updateNode').hide(300)

  nodeObj = {id:'', label:''};
})


//helpers functions

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function whichNodeColide(dragedNode, pointerPosition){

  var positionsToCheck = [{x:-30,y:0},{x:30,y:0},{x:0,y:-30},{x:0,y:+30}]

  for (var i in positionsToCheck){
    var whichNode = network.getNodeAt({
      x: pointerPosition.x +positionsToCheck[i].x,
      y: pointerPosition.y+ positionsToCheck[i].y
    });
    if (whichNode !=undefined && dragedNode != whichNode){

      return whichNode

    }
  }
  return undefined;


}
