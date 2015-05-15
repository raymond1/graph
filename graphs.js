var canvas = document.getElementsByTagName("canvas")[0];
var posts = new Posts(canvas);

function start(){
  function calculateGraphRadius(centroid,datapoints){
    var distances = [];
    for (var i = 0; i < datapoints.length; i++){
      var distance = Vector.distance(centroid,datapoints[i]);
      distances[i] = distance;
    }
    var greatestDistance = MyMath.max(distances);
    return greatestDistance;
  }
  
  //assumes an array of vectors is passed in
  //calculates a 3d centroid
  function calculateCentroid(datapoints){
    var numberOfPoints = datapoints.length;
    var totalX = 0;
    var totalY = 0;
    var totalZ = 0;
    for (var i = 0; i < numberOfPoints; i++){
      totalX += datapoints[i].getX();
      totalY += datapoints[i].getY();
      totalZ += datapoints[i].getZ();
    }
    var averageX = totalX/numberOfPoints;
    var averageY = totalY/numberOfPoints;
    var averageZ = totalZ/numberOfPoints;
    return new Vector(averageX,averageY,averageZ);
  }
  
  function insertAfter(elementToInsert, targetLocation){
    var parentElement = targetLocation.parentNode;
    parentElement.insertBefore(elementToInsert, targetLocation.nextSibling);
  }
  
  function generateButtons(_initializationObject){
    var canvasParent = window.graph.canvas.parentNode;
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
        insertAfter(newButton, window.graph.canvas);
      }
      else{
        insertAfter(newButton, previouslyInsertedElement);
      }

      previouslyInsertedElement = newButton;
    }
  }

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
  
  function cameraInFocusMode(){
    if (window.graph.cameraMode == "focus point"){
      return true;
    }
    else{
      return false;
    }
  }
  
  //degrees is a number of degrees from -360 to +360.
  //axis is a string, either "y" or "x"
  function rotateCameraAroundFocusPoint(degrees, axis){
    var rotationAxis;
    switch(axis){
      case "y":
        rotationAxis = window.graph.camera.yAxis;
        break;
      case "x":
        rotationAxis = window.graph.camera.xAxis;
        break;
      default:
        break;
    }
    
    var radiansToRotate = degrees * Math.PI/180;
    var vectorToRotate = Vector.getVectorAB(window.graph.focusPoint,window.graph.camera.position);
    
    if (Vector.isNull(vectorToRotate)){
      //If the camera is already at the focus point, move the camera backwards, focus, then move towards the focus point
      window.graph.camera.moveBackward(100);
      vectorToRotate = Vector.getVectorAB(window.graph.focusPoint,window.graph.camera.position);
      window.graph.camera.position = Vector.add(window.graph.focusPoint, Vector.rotate3dAroundOrigin(vectorToRotate, rotationAxis,radiansToRotate));
      window.graph.camera.focus(window.graph.focusPoint);
      window.graph.camera.position = window.graph.focusPoint;
    }else{
      window.graph.camera.position = Vector.add(window.graph.focusPoint, Vector.rotate3dAroundOrigin(vectorToRotate, rotationAxis,radiansToRotate));
      window.graph.camera.focus(window.graph.focusPoint);      
    }
  }
  
  //This function does the following:
  //1)Makes sure the camera is focused on the focus point
  //2)Plane of rotation is defined by x axis of the camera and the focus point and the position of the camera
  //The y axis of the camera is perpendicular to this plane.
  //
  //rotates the camera's position
  function rotateCameraLeftAroundFocusPoint(){
    rotateCameraAroundFocusPoint(1, "y");
  }

  function rotateCameraRightAroundFocusPoint(){
    rotateCameraAroundFocusPoint(-1, "y");
  }

  function rotateCameraUpAroundFocusPoint(){
    rotateCameraAroundFocusPoint(1, "x");
  }

  function rotateCameraDownAroundFocusPoint(){
    rotateCameraAroundFocusPoint(-1, "x");
  }
  
  function render(){
    window.renderer.renderScene();
  }

  function panLeftHead(){
    Logic.binaryCondition(cameraInFocusMode, rotateCameraLeftAroundFocusPoint, _panLeft);
  }
  
  function _panLeft(){
    window.graph.camera.panLeft();    
  }
  
  function panLeft(){
    Logic.doAThenB(panLeftHead, render);
  }

  function _panRight(){
    window.graph.camera.panRight();
  }
  
  function panRightHead(){
    Logic.binaryCondition(cameraInFocusMode, rotateCameraRightAroundFocusPoint, _panRight);
  }
  
  function panRight(){
    Logic.doAThenB(panRightHead, render);
  }

  function _panUp(){
    window.graph.camera.panUp();
  }
  
  function panUp(){
    Logic.binaryCondition(cameraInFocusMode, rotateCameraUpAroundFocusPoint, _panUp);
    window.renderer.renderScene();
  }
  
  function _panDown(){
    window.graph.camera.panDown();
  }
  
  function panDown(){
    Logic.binaryCondition(cameraInFocusMode, rotateCameraDownAroundFocusPoint, _panDown)
    window.renderer.renderScene();
  }

  function rotateClockwise(angleStep){
    window.graph.camera.rotateClockwise();
    //camera.rotateAroundAxis({angle:1 * angleStep,axisNumber:2});
    window.renderer.renderScene();
  }
  
  function rotateCounterclockwise(angleStep){
    window.graph.camera.rotateCounterclockwise();
    //camera.rotateAroundAxis({angle:-1 * angleStep,axisNumber:2});
    window.renderer.renderScene();
  }
  
  function _moveForward(){
    window.graph.camera.moveForward();
  }
  
  function moveCameraTowardFocus(){
    window.graph.camera.focus(window.graph.focusPoint);
    window.graph.camera.moveForward(100);
    
    //if the camera ends up behind the focus point, then make it stop at the focus point
    if (!Vector.inSameDirections(window.graph.camera.getZAxis(), Vector.getVectorAB(window.graph.camera.position,window.graph.focusPoint))){
      window.graph.camera.moveTo(window.graph.focusPoint);
    }
  }
  
  function moveForward(){
    Logic.binaryCondition(cameraInFocusMode, moveCameraTowardFocus, _moveForward);
    window.renderer.renderScene();
  }
  
  function moveBackward(){
    window.graph.camera.moveBackward();
    window.renderer.renderScene();
  }
  
  function moveRight(){
    window.graph.camera.moveRight();
    window.renderer.renderScene();
  }
  
  function moveLeft(){
    window.graph.camera.moveLeft();
    window.renderer.renderScene();
  }
 
  function moveUp(){
    window.graph.camera.moveUp();
    window.renderer.renderScene();
  }
  
  function moveDown(){
    window.graph.camera.moveDown();
    window.renderer.renderScene();
  }

  function increaseFocalLength(){
    window.graph.camera.focalLength = window.graph.camera.focalLength * 2;
    window.renderer.renderScene();
  }
  
  function decreaseFocalLength(){
    window.graph.camera.focalLength = window.graph.camera.focalLength / 2;
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
  
  function switchCameraMode(){
    if (window.graph.cameraMode == "focus point"){
      setCameraMode("free camera");
    }
    else{
      setCameraMode("focus point");
    }
  }
  
  function getKeyPress(e){
    var evtobj=window.event? event : e;
    var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode;
    var key=String.fromCharCode(unicode)

    if (window.graph.hotkeyFunctionMap[key] != null){
      window.graph.hotkeyFunctionMap[key]();
    }


    if (key=="p") posts.disableMessages = !posts.disableMessages;
  }



  function init(){
    canvas.height = 500;
    canvas.width = 500;
    var context = canvas.getContext("2d");

    var canvasWrapper = document.getElementById("canvasWrapper");
    posts.attach(canvasWrapper);

    posts.disableMessages = false;

    
    

    var angleStep = 10;

    window.graph = new Object;
    window.graph.canvas = canvas;
    window.graph.camera = new Camera(new Vector(0,-10, 0));
    window.graph.hotkeyFunctionMap = new Object;
    
    //there are two available camera modes: "focus point" and "free camera"
    window.graph.cameraMode = "focus point";
    
    posts.stickyMessage("Camera Mode: " + window.graph.cameraMode, "camera mode");
    
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
      ["decreaseFocalLength", decreaseFocalLength, "Zoom in", "k"],
      
      ["switchCameraMode", switchCameraMode, "Switch camera mode", "j"]
    ];

    
    generateButtons(initializationObject);
    this.datapoints = generateExponentialPoints();
    
    this.highestDatapoint = getHighestDatapoint(this.datapoints);
    this.lowestDatapoint = getLowestDatapoint(this.datapoints);
    this.height = this.highestDatapoint.getZ() - this.lowestDatapoint.getZ();


    this.centroid = calculateCentroid(this.datapoints);
    window.graph.focusPoint = this.centroid;
    //graphRadius is the distance from the centroid of the graph to the farthest extremity
    this.graphRadius = calculateGraphRadius(this.centroid, this.datapoints);
    window.graph.camera.position = new Vector(0,0,2 * this.graphRadius);
    window.graph.camera.focus(window.graph.focusPoint);

    var scene = new Scene();
    //plot the centroid for now
    scene.addPoint(new Point(this.centroid.getX(), this.centroid.getY(), this.centroid.getZ(), "#0000ff"));
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
    window.renderer = new Renderer(window.graph.camera, this.scene, canvas, context);
    window.renderer.renderScene();
  
    document.onkeypress = getKeyPress;
    setCameraMode("focus point");
  }
  
  function setCameraMode(cameraMode){
    window.graph.cameraMode = cameraMode;
    posts.stickyMessage("Camera Mode: " + window.graph.cameraMode, "camera mode");
  }
  
  init();
}

window.onload = start;
