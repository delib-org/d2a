//TODO:
//check problems with UX of gestures
//Check on mobile

var vis = require('vis');
var $ = require('jquery');

$('#updateNode').hide()
$('#updateEdge').hide()

//change canvas size according to window size
$('#myNetwork').height(window.innerHeight).width(window.innerWidth);
$(window).resize(function() {
  $('#myNetwork').height(window.innerHeight).width(window.innerWidth);
});


// create an array with nodes
var nodes = new vis.DataSet([{
    id: 10,
    label: 'Node 10 dg d dfg dfg dfg dfg',
    type: 'option',
    shape: 'diamond',
    color:{
      background:'#C0CA33',
      highlight: '#AFB42B',
      border:'#827717'
    },
    font:{
      color: '#424242'
    }
  },
  {
    id: 2,
    label: 'Node 2',
    type: 'option',
    shape: 'diamond',
    color:{
      background:'#C0CA33',
      highlight: '#AFB42B',
      border:'#827717'
    },
    font:{
      color: '#424242'
    }
  },
  {
    id: 3,
    label: 'Node 3',
    type: 'question',
    shape: 'ellipse',
    color:{
      background:'#039BE5',
      highlight: '#0277BD'
    },
    font:{
      color: 'white'
    }
  },
  {
    id: 4,
    label: 'Node 4',
    type: 'option',
    shape: 'box',
    color:{
      background:'#C0CA33',
      highlight: '#AFB42B',
      border:'#827717'
    },
    font:{
      color: '#424242'
    }
  },
  {
    id: 5,
    label: 'Node 5',
    type: 'question',
    shape: 'ellipse',
    color:{
      background:'#039BE5',
      highlight: '#0277BD'
    },
    font:{
      color: 'white'
    }
  }
]);

// create an array with edges
var edges = new vis.DataSet([{
    from: 10,
    to: 3,
    arrows: {
      to: {
        enabled: true
      }
    }
  },
  {
    from: 10,
    to: 2,
    arrows: {
      to: {
        enabled: true
      }
    }
  },
  {
    from: 2,
    to: 4,
    arrows: {
      to: {
        enabled: true
      }
    }
  },
  {
    from: 2,
    to: 5,
    arrows: {
      to: {
        enabled: true
      }
    }
  }
]);

// create a network
var container = document.getElementById('myNetwork');

// provide the data in the vis format
var data = {
  nodes: nodes,
  edges: edges
};

var options = {
  nodes:{
    widthConstraint:{
      minimum:40,
      maximum:120
    }
  },
  interaction: {
    hover: true
  },
  physics:{enabled:false}
};

// initialize your network!
var network = new vis.Network(container, data, options);

network.on('click', function(prm) {
  
});

var nodeObj = {
  id: '',
  label: ''
}
var edgeObj = {
  id: '',
  label: ''
}

network.on('doubleClick', function(prm) {


  if (prm.nodes.length > 0) {

    //if clicked on a node

    nodeObj = nodes._data[prm.nodes[0]];

    //show update panel
    $('#updateNode').show();
    $('#newNodeInput').focus().val(nodeObj.label);

    //change type buttons according to type
    switch (nodeObj.type) {
      case 'option':
        $('.option').css('background', '#C0CA33');
        $('.question').css('background', '#e0e0e0');
        break;
      case 'question':
        $('.question').css('background', '#039BE5');
        $('.option').css('background', '#e0e0e0');
        break;
      default:
        $('.question').css('background', '#e0e0e0');
        $('.option').css('background', '#e0e0e0');

    }


  } else if (prm.edges.length > 0 && prm.nodes.length == 0) {
    //if clicked on an edge

    edgeObj = edges._data[prm.edges[0]]

    $('#updateEdge').show()
    $('#newEdgeInput').focus().val(edgeObj.label);



  } else {
    //if clicked on an empty space create new node

    var nodeX = prm.pointer.canvas.x;
    var nodeY = prm.pointer.canvas.y;

    nodeObj.id = uuidv4();

    nodes.add({
      id: nodeObj.id,
      label: "new text",
      x: nodeX,
      y: nodeY,
      shape: 'box'
    })

    $('#updateNode').show(400);
    $('#newNodeInput').focus().val('');

  }

});

network.on('dragging', function(prm) {
  var pointerPosition = prm.pointer.DOM;
  var dragedNode = prm.nodes[0];

  var dragUponNode = whichNodeColide(dragedNode, pointerPosition)

  if (dragUponNode != undefined && dragedNode != dragUponNode) {

    var doEdgeExists = edges.get({
      filter: function(item) {
        return (item.from == dragedNode && item.to == dragUponNode)
      }
    })


    if (doEdgeExists.length == 0) {
      //if an edge do not exit, then create an edge

      edges.update({
        from: dragedNode,
        to: dragUponNode,
        arrows: {
          to: {
            enabled: true
          }
        }
      })
    }


  }
})

// --- events in the DOM ---

//update node button click
document.getElementById("updateNodeBtn").addEventListener("click", function(event) {

  event.preventDefault()
  var newName = $('#newNodeInput').val()
  $('#newNameInput').val('')

  nodes.update({
    id: nodeObj.id,
    label: newName,
    shape: 'box'
  })
    
  $('#updateNode').hide(300);

  nodeObj = {
    id: '',
    label: ''
  };

});

//delete node
document.getElementById('deleteNodeBtn').addEventListener('click', function(event) {
  event.preventDefault()
  
  //get edges that are connected
  var connectedEdges = network.getConnectedEdges(nodeObj.id)

  edges.remove(connectedEdges);
  nodes.remove(nodeObj.id);

})

//change node to option
document.getElementById('optionBtn').addEventListener('click', function(event) {

  event.preventDefault();

  nodes.update({
    id: nodeObj.id,
    type: 'option',
    shape: 'box',
    color:{
      background:'#C0CA33',
      highlight: '#AFB42B',
      border:'#827717'
    },
    font:{
      color: '#424242'
    }
  });

})

//change node to question
document.getElementById('questionBtn').addEventListener('click', function(event) {

  event.preventDefault();

  nodes.update({
    id: nodeObj.id,
    type: 'question',
    shape: 'ellipse',
    color:{
      background:'#039BE5',
      highlight: '#0277BD'
    },
    font:{
      color: 'white'
    }
  });

})

// -- edge events ---

//update edge button click
document.getElementById("updateEdgeBtn").addEventListener("click", function(event) {

  event.preventDefault()

  var newLabel = $('#newEdgeInput').val()
  $('#newEdgeInput').val('')

  edges.update({
    id: edgeObj.id,
    label: newLabel
  })

  
  $('#updateEdge').hide(300);

  edgeObj = {
    id: '',
    label: ''
  };

});

//delete nodeObj
//update edge button click
document.getElementById("deleteEdgeBtn").addEventListener("click", function(event) {

  event.preventDefault()

  edges.remove(edgeObj.id);
  $('#updateEdge').hide(300)

});

//cancel editing, by clicking on the screen
document.getElementById("closeEditNode").addEventListener('click', function(event) {
  
  event.stopPropagation();
  
  $('#updateNode').hide(300);

  nodeObj = {
    id: '',
    label: ''
  };
})


//helpers functions

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function whichNodeColide(dragedNode, pointerPosition) {

  var positionsToCheck = [{
    x: -30,
    y: 0
  }, {
    x: 30,
    y: 0
  }, {
    x: 0,
    y: -30
  }, {
    x: 0,
    y: +30
  }]

  for (var i in positionsToCheck) {
    var whichNode = network.getNodeAt({
      x: pointerPosition.x + positionsToCheck[i].x,
      y: pointerPosition.y + positionsToCheck[i].y
    });
    if (whichNode != undefined && dragedNode != whichNode) {

      return whichNode

    }
  }
  return undefined;


}
