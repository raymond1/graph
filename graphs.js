//this file assumes the existence of debugger.js
//math.js
//vector.js
//in that order
//maybe some other stuff too
var analyzer = new Debugger(canvas);


//About the coordinate system:
//y is --------> direction
//x is |
//     |
//     |
//     V
//z is positive going out of the screen. Behind the screen is negative z.

var canvas = document.getElementsByTagName("canvas")[0];

canvas.height = 500;
canvas.width = 500;
var context = canvas.getContext("2d");

var canvasWrapper = document.getElementById("canvasWrapper");
analyzer.attach(canvasWrapper);

analyzer.disableMessages = false;

var camera = new Camera(new Vector(0,-10, 0));
var orientation = new CoordinateSystem();
orientation.push(new Vector(1,0,0));
orientation.push(new Vector(0,0,-1));
//option angleStep
var angleStep = 10;

window.graph = new Object;
window.graph.hotkeyFunctionMap = new Object;


function start(){
  var initializationObject = 
  [  
    ["panRight", panRight, "Pan right", "d"],
    ["panLeft", panLeft, "Pan left", "a"],
    ["panUp", panUp, "Pan up", "w"],
    ["panDown", panDown, "Pan down", "s"],
    ["rotateClockwise", rotateClockwise, "Rotate clockwise", "e"],
    ["rotateCounterclockwise", rotateCounterclockwise, "Rotate counterclockwise", "q"],
    ["moveForward", moveForward, "Move forwards", "i"],
    ["moveBackward", moveBackward, "Move backwards", "o"],

    ["moveUp", moveUp, "Move up", "t"],
    ["moveDown", moveDown, "Move down", "g"],
    ["moveLeft", moveLeft, "Move left", "f"],
    ["moveRight", moveRight, "Move right", "h"],
    ["increaseFocalLength", increaseFocalLength, "Zoom out", "l"],
    ["decreaseFocalLength", decreaseFocalLength, "Zoom in", "k"]
  ];
  
  function insertAfter(elementToInsert, targetLocation){
    var parentElement = targetLocation.parentNode;
    parentElement.insertBefore(elementToInsert, targetLocation.nextSibling);
  }
  
  function generateButtons(_initializationObject){
    var canvasParent = canvas.parentNode;
    var previouslyInsertedElement = null;
    for (var i = 0; i < _initializationObject.length; i++){
      var newButton = document.createElement("button");
      var _buttonID = _initializationObject[i][0];
      var _function = _initializationObject[i][1];
      var _label = _initializationObject[i][2];
      var _hotkey = _initializationObject[i][3];

      newButton.setAttribute("id", _buttonID);
      newButton.addEventListener("click", _function);
      var labelText = document.createTextNode(_label);
      newButton.appendChild(labelText);
      newButton.setAttribute("style", "float: left; clear: both;");

      //add a hotkey if it is available
      if (_initializationObject[i][3] != null){
        window.graph.hotkeyFunctionMap[_hotkey] = _function;
        labelText.nodeValue += " (" + _hotkey +")";
      }
      
      if (previouslyInsertedElement == null){
        insertAfter(newButton, canvas);
      }
      else{
        insertAfter(newButton, previouslyInsertedElement);
      }


      previouslyInsertedElement = newButton;
    }
  }
  
  generateButtons(initializationObject);
  //this.datapoints = generateCircle();
  //this.datapoints = generatePoint();
  this.datapoints = generateExponentialPoints();
  
  this.highestDatapoint = getHighestDatapoint(this.datapoints);
  this.lowestDatapoint = getLowestDatapoint(this.datapoints);
  this.height = this.highestDatapoint.getZ() - this.lowestDatapoint.getZ();
  
  var scene = new Scene();
  for (var i = 0; i < this.datapoints.length; i++){
    var colourString;
    if (this.height == 0){
      colourString = "#000000";
    }else{
      colourString = Colour.getNeutralString(Math.floor((this.datapoints[i].getZ() - this.lowestDatapoint.getZ())/this.height* Colour.numberOfGrays));
    }
    
    var point = new Point
    (
      this.datapoints[i].getX(),
      this.datapoints[i].getY(),
      this.datapoints[i].getZ(),
      colourString
    );
    scene.addPoint(point);
  }


  
  this.scene = scene;
  window.renderer = new Renderer(this.camera, this.scene, canvas, context);
  window.renderer.renderScene();
      

  function generatePoint(){
    var datapoints = [];
    datapoints.push(new Vector(0,0,120));
    return datapoints;
  }
  
  function generateSquareCorners(){
    var datapoints = [];
    datapoints.push(new Vector(-10,-10,10));
    datapoints.push(new Vector(-10,10,10));
    datapoints.push(new Vector(10,10,10));
    datapoints.push(new Vector(10,-10,10));
    return datapoints;
  }

  function generateCircle(){
    var datapoints = [];
    var radius = 50;
    
    for (var angle = 0; angle < 360; angle = angle + 36){
      var y = Math.sin(angle * Math.PI/180) * radius;
      var x = Math.cos(angle * Math.PI/180) * radius;
      datapoints.push(new Vector(x,y,10));
    }
    return datapoints;
  }

  
  //draws a square with vertices (-10,-10,10), (-10,10,10), (10,-10,10), (10,10,10)
  function generateSquare(){
    var datapoints = [];

    for (var i = -10; i < 10; i++){
      datapoints.push(new Vector(10,i,10));
    }

    for (var i = -10; i < 11; i++){
      datapoints.push(new Vector(i,10,10));
    }

    for (var i = 9; i > -11; i--){
      datapoints.push(new Vector(-10,i,10));
    }

    for (var i = 9; i > -10; i--){
      datapoints.push(new Vector(i,-10,10));
    }    
    return datapoints;
  }
    
  function getDatapoints(){
    return this.datapoints;
  }
  
  function panLeft(){
    camera.panLeft();
    window.renderer.renderScene();
  }

  function panRight(){
    camera.panRight();
    window.renderer.renderScene();
  }

  function panUp(){
    camera.panUp();
    window.renderer.renderScene();
  }
  
  function panDown(){
    camera.panDown();
    window.renderer.renderScene();
  }

  function rotateClockwise(angleStep){
    camera.rotateClockwise();
    //camera.rotateAroundAxis({angle:1 * angleStep,axisNumber:2});
    window.renderer.renderScene();
  }
  
  function rotateCounterclockwise(angleStep){
    camera.rotateCounterclockwise();
    //camera.rotateAroundAxis({angle:-1 * angleStep,axisNumber:2});
    window.renderer.renderScene();
  }
  
  function moveForward(){
    camera.moveForward();
    window.renderer.renderScene();
  }
  
  function moveBackward(){
    camera.moveBackward();
    window.renderer.renderScene();
  }
  
  function moveRight(){
    camera.moveRight();
    window.renderer.renderScene();
  }
  
  function moveLeft(){
    camera.moveLeft();
    window.renderer.renderScene();
  }
  
  function moveUp(){
    camera.moveUp();
    window.renderer.renderScene();
  }
  
  function moveDown(){
    camera.moveDown();
    window.renderer.renderScene();
  }

  function increaseFocalLength(){
    camera.focalLength = camera.focalLength * 2;
    window.renderer.renderScene();
  }
  
  function decreaseFocalLength(){
    camera.focalLength = camera.focalLength / 2;
    window.renderer.renderScene();
  }

  function generateExponentialPoints(){
    var datapoints = [];
    //x axis is the sum of factors
    //y axis is the base
    //z axis is base ^ (sum of factors/base)
    for (var x = 1; x < 20; x = x + 1){
      for (var z = 0; z < 20; z = z + 1){
        var y = Math.pow(x, z/x);
        var tuple = new Vector(x,y,z);
        datapoints.push(tuple);
      }
    }
    return datapoints;
  }

  function getHighestDatapoint(datapoints){
    var maxDatapoint = datapoints[0];
    for (var i = 0; i < datapoints.length; i++){
      if (datapoints[i].getZ() > maxDatapoint.getZ()){
        maxDatapoint = datapoints[i];
      }
    }
    return maxDatapoint;
  }
  
  function getLowestDatapoint(datapoints){
    var minDatapoint = datapoints[0];
    for (var i = 0; i < datapoints.length; i++){
      if (datapoints[i].getZ() < minDatapoint.getZ()){
        minDatapoint = datapoints[i];
      }
    }
    return minDatapoint;
  }


  
  function getKeyPress(e){
    var evtobj=window.event? event : e;
    var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode;
    var key=String.fromCharCode(unicode)

    if (window.graph.hotkeyFunctionMap[key] != null){
      window.graph.hotkeyFunctionMap[key]();
    }


    if (key=="p") analyzer.disableMessages = !analyzer.disableMessages;
  }

  document.onkeypress = getKeyPress;


}

window.onload = start;
