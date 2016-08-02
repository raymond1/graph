//An x,y grid, where each x,y coordinate corresponds to a set of pixels with those x,y values.
//For example: (2,3,5), (2,3,8) will both be in coordinate (2,3) in the virtual grid.
function VirtualGrid(){
  this.objectType='VirtualGrid';
  this.objects = [];

  //inserts object at grid location x,y
  this.insert = function(x,y,object){
    if (this.objects[x] == null){
      this.objects[x] = [];
    }
    
    if (this.objects[x][y] == null){
      this.objects[x][y] = [];
    }
    
    this.objects[x][y].push(object);
  }


  //iterationData is the data at a particular location in the virtual grid
  //iterationData is an array of coordinates with the same x and y values.
  this.discardAllPointsBehindCameraHelper = function(iterationData){
    for (var i = 0; i < iterationData.length; i++){
    }
    if (iterationObject.getZ() < 0){
      this.discard(iterationObject);
    }
  }


  //given a colourPoint to discard, get rid of it from the virtual grid...
  //get rid of it from the virtual grid by 
  this.discard = function(colourPointToDiscard){
    var xToBeDiscarded = colourPointToDiscard.vector.getX();
    var yToBeDiscarded = colourPointToDiscard.vector.getY();

    if (this.objects.length == 0){
      return;
    }

    var listOfColourPointsWithSameXY = this.objects[xToBeDiscarded][yToBeDiscarded];

    var colourPointCoordinatesComparisonFunction = function(B){
      if (Vector.equal(colourPointToDiscard.vector,B.vector)){
        return true;
      }
      return false;
    }

    var indexToDiscard = Programming.getIndexThroughLinearSearch(colourPointCoordinatesComparisonFunction, listOfColourPointsWithSameXY);

    listOfColourPointsWithSameXY.splice(indexToDiscard,1);

    //removing the empty columns and rows causes an error.
  }

  
  //Iterate over every grid item, returns at every grid location an array of points
  //Assumes no items are deleted during iteration. If there are, there may be some problems
  this.iterateOverGrid = function(passedInFunction){
    var columnKeys = Programming.getArrayKeys(this.objects);
    for (var i = 0; i < columnKeys.length; i++){
      var rowKeys = Programming.getArrayKeys(this.objects[columnKeys[i]]);
      for (j = 0; j < rowKeys.length; j++){
        passedInFunction(this.objects[columnKeys[i]][rowKeys[j]]);
      }
    }
  }


  //Iterate over every grid item, and then over every point at that grid location
  this.iterate = function(passedInFunction){
    if (this.objects.length == 0){
      return;
    }

    function getIterationClosureFunction(){
      function iterationClosure(listOfGridPoints){
        for (var i = 0; i < listOfGridPoints.length; i++){
          passedInFunction(listOfGridPoints[i]);
        }
      }
      return iterationClosure;
    }

    var a = getIterationClosureFunction();

    this.iterateOverGrid(a);
  }

  //if mode is "keep", then this method returns the set of coordinates that return true when filter(coordinate) is applied to them
  //in the iterate function
  //if mode is "discard", then this method returns the set of coordinates that return false when filter(coordinate) is applied
  this.applyFilter = function(mode, filterFunction){
    var data = [];

    //when keepOrDiscard is true, then the values accepted by the filter are kept
    //if keepOrDiscard is false, then the values accepted by the filter are rejected, and the values not accepted by the filter are accepted.
    var keepOrDiscard;
    if (mode == "keep"){
      keepOrDiscard = true;
    }
    else if (mode == "discard"){
      keepOrDiscard = false;
    }

    var loopingFunction = function(iterationObject){
      if (filterFunction(iterationObject) == keepOrDiscard){
        data.push(iterationObject);
      }
    }

    var columnKeys = Programming.getArrayKeys(this.objects);
    for (var i = 0; i < columnKeys.length; i++){
      var rowKeys = Programming.getArrayKeys(this.objects[columnKeys[i]]);
      for (j = 0; j < rowKeys.length; j++){
        for (var k = 0; k < this.objects[columnKeys[i]][rowKeys[j]].length; k++){
          loopingFunction(this.objects[columnKeys[i]][rowKeys[j]][k]);
        }
      }
    }
    //this.iterate(loopingFunction);
    return data;
  }
}





function CoordinateSystem(){
  this.axes = [];
  this.addAxis = function(axis){
    this.axes.push(axis);
  }
  
  this.push = this.addAxis;
  this.getVector = function(inputVector){
    var newVector = new Vector;
    for (var i = 0; i < this.axes.length; i++){
      newVector.push(Vector.getComponent(inputVector, this.axes[i]));
    }
    return newVector;
  }
  
  this.toString = function(){
    var stringToReturn = "";
    for (var i = 0; i < this.axes.length; i++){
      stringToReturn += this.axes[i].contents() + "<br>\n";
    }
    return stringToReturn;
  }
}


function Logic(){

}

//if condition is true, then run function A, otherwise, run function B
Logic.binaryCondition = function(condition,functionA,functionB){
  if (condition()){
    functionA();
  }
  else{
    functionB();
  }
}

//Does A, then B
Logic.doAThenB = function(functionA,functionB){
  functionA();
  functionB();
}



//Just an idea. The test probe will take in a set of inputs and outputs and measures an object to see if it meets the spec.
function TestProbe(){
}

//add to the tail and take from the head
function FIFOQueue(){
  function QueueNode(data){
    this.data = data;
    this.next = null;
  }

  this.head = null;
  this.tail = null;


  //pass in the data you want to store in the queue
  //a node will be automatically created
  //element added to tail
  this.add = function (element){
    if (this.tail == null){
      this.tail = new QueueNode(element);
      this.head = this.tail;//assume that the only time tail is null is when head == tail
    }else{
      this.tail.next = new QueueNode(element);
      this.tail = this.tail.next;
    }
  }

  //element removed from head
  this.remove = function(){
    if (this.head == null){
      //do nothing
    }else{
      this.head = this.head.next;
    }
    if (this.head == null){
      this.tail = null
    }
  }
}



//In this theoretical mouse, there is only one button. In practice, the mouse code assumes only the left button works on a two button mouse
//Note on nomenclature: actions are set by the end user, handlers are used internally by the programmer
function Mouse(element){//attaches events to element
  this.objectType = 'mouse';
  this.customDebugger = null;
  function MouseCoordinates(x,y){
    this.x = x;
    this.y = y;
  }

  this.previousPosition = new MouseCoordinates(0,0);

  //eventIDString is a unique string representing the event that occurred
  //move
  function HistoricalMouseEvent(eventIDString, time){
    this.eventIDString = eventIDString;
    this.time = time;
  }

  this.getHistoricalEventsAsString = function(){
    var returnString = '';
    var cursor = this.historicalEvents.head;
    while (cursor != null){
      returnString += cursor.data.eventIDString + cursor.data.time;
      cursor = cursor.next;
    }
    return returnString;
  }

  this.memoryThreshhold = 2000; //number of milliseconds events are stored for;
  this.stopThreshhold = 500; //number of milliseconds without movement after which a mouse is considered stopped
  this.recordHistoricalMouseEventAndPruneHistory = function(historicalMouseEvent){
    this.historicalEvents.add(historicalMouseEvent);
    this.pruneOldEvents();
  }

  this.pruneOldEvents = function(){
    if (this.historicalEvents.head == null){
      return;
    }
    var now = (new Date()).getTime();
    while(this.historicalEvents.head.data.time + this.memoryThreshhold < now){
      this.historicalEvents.remove();
    }
  }

  this.historicalEvents = new FIFOQueue();

  this.lastStopTime = -1;
  this.lastMoveTime = 0;

  //returns true if there were no move events from now - stopThreshhold to now
  this.noMoveEvents = function(){
    var found = false;
    var now = (new Date()).getTime();

    var cursor = this.historicalEvents.head;
    while (cursor != null){
      if (cursor.data.eventIDString == 'move' && Programming.between(cursor.data.time, now - this.stopThreshhold, now)){
        found = true;
        break;
      }
      cursor = cursor.next;
    }

    return !found;
  }

  this.getLastMoveEvent = function(){
    var lastMoveEvent = null;
    var cursor = this.historicalEvents.head;
    while(cursor != null){
      if (cursor.data.eventIDString == 'move'){
        lastMoveEvent = cursor.data;
        break;
      }
    }
    return lastMoveEvent;
  }

  this.stopAction = function(){
  }

  this.stopDetector = (function(){
    if (this.lastMoveTime <= this.lastStopTime) return;

    var now = (new Date()).getTime();
    if (now - this.lastMoveTime > this.stopThreshhold){
      this.lastStopTime = now;
      this.updateMouseStatus('events detected', 'move stop');
      this.stopAction();
    }
  }).bind(this);

  this.stopCheckInterval = 1000;
  window.setInterval(this.stopDetector, this.stopCheckInterval);

  //default state assumptions when mouse is first initialized
  this.buttonState = "up";
  this.dragState = "not dragging";
  this.timeOfLastButtonDown = 0;
  this.timeOfLastButtonUp = 0;
  this.buttonDownPosition = new MouseCoordinates(0,0);
  this.buttonUpPosition = new MouseCoordinates(0,0);
  this.draggingVector = new MouseCoordinates(0,0);


  this.position = new MouseCoordinates(0,0);//position relative to the element the mouse is in

  this.boundingClientRect = element.getBoundingClientRect();
  this.updateBoundingClientRect = function(element){
    this.boundingClientRect = element.getBoundingClientRect();
  }


  this.updatePosition = function(eventInfo){
    this.position.x = eventInfo.clientX - this.boundingClientRect.x;
    this.position.y = eventInfo.clientY - this.boundingClientRect.y;
  };

  this.eventsDetected = {move: false, click: false, buttonUp: false, buttonDown: false, dragStart:false, drag: false, dragEnd: false};

  this.resetEventsDetected = function(){
    this.eventsDetected.move = false;
    this.eventsDetected.click = false;
    this.eventsDetected.buttonUp = false;
    this.eventsDetected.buttonDown = false;
    this.eventsDetected.dragStart = false;
    this.eventsDetected.drag = false;
    this.eventsDetected.dragEnd = false;
  }

  //when called with no arguments, simply update the sticky notes
  this.updateMouseStatus = function(attribute, argument){

    switch(attribute){
      case 'last move time':
        this.lastMoveTime = argument;
        break;
      case "move state":
        this.moveState = argument;
        break;
      case 'previous position':
        this.previousPosition = argument;
        break;
      case "position":
        //argument is the eventInfo object
        this.updatePosition(argument);
        break;
      case "button state":
        this.buttonState = argument;
        break;
      case "drag state":
        this.dragState = argument;
        break;
      case "time of last button up":
        this.timeOfLastButtonUp = argument;
        break;
      case "time of last button down":
        this.timeOfLastButtonDown = argument;
        break;
      case "dragging vector":
        this.draggingVector = argument;
        break;
      case "button up position":
        this.buttonUpPosition = argument;
        break;
      case "button down position":
        this.buttonDownPosition = argument;
        break;
      case "events detected":
        //argument is the type of mouse event(example: move)
        this.recordHistoricalMouseEventAndPruneHistory(new HistoricalMouseEvent(argument, (new Date()).getTime()));
        break;
      case 'historical events':
        this.historicalEvents.add(new HistoricalMouseEvent(argument, (new Date()).getTime()));
        break;
      default:
        if (this.debuggingEnabled){
          if (attribute != undefined){
            //unrecognized attribute
            alert('not recognized attribute:' + attribute);
          }
        }
        break;
    }

    if (this.customDebugger != null){
/*
      this.customDebugger.stickyMessage("this.buttonUpPostion: " + this.buttonUpPosition.x + "," + this.buttonUpPosition.y, "up position");
      this.customDebugger.stickyMessage("this.buttonDownPostion: " + this.buttonDownPosition.x + "," + this.buttonDownPosition.y, "down position");
      this.customDebugger.stickyMessage("this.timeOfLastButtonDown: " + this.timeOfLastButtonDown, "time of last button down");
      this.customDebugger.stickyMessage("this.timeOfLastButtonUp: " + this.timeOfLastButtonUp, "time of last button up");
      this.customDebugger.stickyMessage("this.buttonState: " + this.buttonState, "Button state");
      this.customDebugger.stickyMessage("this.position.xy:" + this.position.x + "," + this.position.y, "Mouse Coordinates");
      this.customDebugger.stickyMessage("this.boundingClientRect.xy:" + this.boundingClientRect.x + "," + this.boundingClientRect.y, "this.boundingClientRect.xy");
      this.customDebugger.stickyMessage("this.dragState: " + this.dragState, "this.dragState");
      this.customDebugger.stickyMessage("start to finish vector for dragging: " + this.draggingVector.x + "," + this.draggingVector.y, "dragging vector");
      this.customDebugger.stickyMessage('events detected: ' + this.getEventsString(), 'events detected');
*/
      if (window.graph.debuggingEnabled){
        //this.customDebugger.stickyMessage('historical events:' + this.getHistoricalEventsAsString(), 'historical events');
      }
    }
  }

  this.eventsString = '';
  this.getEventsString = function(){
    this.eventsString = '';
    if (this.eventsDetected.move){
      this.eventsString += 'move detected';
    }else{
      this.eventsString += 'move not detected';
    }

    //if (this.eventsDetected.buttonDown){
    //}

    this.eventsString += '|';
    return this.eventsString;
  }

  this.moveHandler = function (eventInfo){
    this.updateMouseStatus('move state', true);
    this.updateMouseStatus('last move time', (new Date()).getTime());
    this.updateMouseStatus('previous position', new MouseCoordinates(this.position.x, this.position.y));
    this.updateMouseStatus("position", eventInfo);
    if (this.buttonState == "down"){
      if (this.dragState == "not dragging"){
        this.dragStartHandler();
      }
      this.updateMouseStatus("drag state", "dragging");
      this.dragHandler();
    }

    //record that a move event was detected
    this.updateMouseStatus('events detected', 'move');

    this.moveAction();
    this.resetEventsDetected();
  }.bind(this);

  this.dragStartHandler = function(){
    this.eventsDetected.dragStart = true;
    this.updateMouseStatus('events', ['drag start', true]);
    this.dragStartAction();
  }

  this.dragEndHandler = function(){
    this.eventsDetected.dragEnd = true;
    this.dragEndAction();
  }

  this.dragHandler = function(){
    var deltaX = this.position.x - this.buttonDownPosition.x;
    var deltaY = this.position.y - this.buttonDownPosition.y;
    var differenceVector = new MouseCoordinates(deltaX, deltaY);
    this.updateMouseStatus("dragging vector", differenceVector);

    this.eventsDetected.drag = true;
    this.dragAction();
  }

  this.buttonUpHandler = function(event){
    this.updateMouseStatus("button state", "up");
    this.updateMouseStatus("time of last button up", (new Date()).getTime());

    this.updateMouseStatus("button up position", new MouseCoordinates(this.position.x, this.position.y));
    if (this.dragState == "dragging"){
      this.updateMouseStatus("drag state", "not dragging");
      this.dragEndHandler();
    }else{
      this.clickHandler();
    }
    this.buttonUpAction();
  }.bind(this);

  this.clickHandler = function(){
    this.clickAction();
  }

  this.buttonDownHandler = function(event){
    this.updateMouseStatus("time of last button down",  (new Date()).getTime());
    this.updateMouseStatus("button state", "down");
    this.updateMouseStatus("button down position", new MouseCoordinates(this.position.x, this.position.y));
    this.buttonDownAction();
  }.bind(this);

  this.clickAction = function(){
  }

  this.dragStartAction = function(){
  }

  this.dragAction = function(){
  }

  this.dragEndAction = function(){
  }

  this.moveAction = function(){
  }

  this.buttonUpAction = function(){
  }

  this.buttonDownAction = function(){
  }

  this.clickAction = function(){
  }

  this.setAction = function(eventName, f){
    switch(eventName){
      case "move":
        this.moveAction = f;
        break;
      case "drag":
        this.dragAction = f;
        break;
      case "drag start":
        this.dragStartAction = f;
        break;
      case "drag end":
        this.dragEndAction = f;
        break;
      case "button up":
        this.buttonUpAction = f;
        break;
      case "click":
        this.clickAction = f;
        break;
      case "button down":
        this.buttonDownAction = f;
        break;
      
      default:
        break;
    }
  }

  element.addEventListener('mousemove', this.moveHandler, false);
  element.addEventListener('mousedown', this.buttonDownHandler, false);
  element.addEventListener('mouseup', this.buttonUpHandler, false);

  this.updateMouseStatus();
}

function Graph(options){
  this.objectType = "Graph";


  this.mainScene = null;
  this.mainSceneCamera = null;
  this.mainSceneCameraOrientation = null;

  this.debugArea = null;//area for debug messages


  var commandProcessor = function(){
      for (var i = 0; i < this.commandQueue.queue.length; i++){
        var currentCommand = this.commandQueue.queue[i];
        switch(currentCommand.commandString){
          case 'display':
            this.display();
            break;
          case 'set scene':
            break;
          case 'get scene':
            break;
          default:
        }
      }
    };
  Programming.addCommandQueueCapability(this, ['display'], commandProcessor);

  if (options == null){
    options = {};
  }

  this.options = options;
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
  
  //generating buttons should be separate from generating hotkeys, but this is something that may never be fully implemented
  this.generateButtons = function (_initializationObject){
    window.graph.hotkeyFunctionMap = []
    var canvasParent = window.graph.canvas.parentNode;
    var br = document.createElement('br');
    Programming.insertAfter(br, window.graph.canvas);
    var previouslyInsertedElement = br;
    for (var i = 0; i < _initializationObject.length; i++){
      var newButton = document.createElement("button");
      var _buttonID = _initializationObject[i][0];
      var _function = _initializationObject[i][1];
      var _label = _initializationObject[i][2];
      var _hotkey = _initializationObject[i][3];

      newButton.setAttribute("id", _buttonID);
      newButton.addEventListener("click", _function);


      var labelText = document.createTextNode(_label);
      if (_initializationObject[i][3] != null){
        window.graph.hotkeyFunctionMap[_hotkey] = _function
        labelText.nodeValue += " (" + _hotkey +")";
      }
      newButton.appendChild(labelText);
      newButton.setAttribute("style", "");

      Programming.insertAfter(newButton, previouslyInsertedElement);

      previouslyInsertedElement = newButton;



    }

  }


  function generatePoint(){
    var datapoints = []
    datapoints.push(new Vector(0,0,120))
    return datapoints
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
  function rotateCameraAroundFocusPoint(degrees, rotationAxis, focusPoint, camera){
    
    var radiansToRotate = degrees * Math.PI/180;
    var vectorToRotate = Vector.getVectorAB(focusPoint, camera.position);
    
    if (Vector.isNull(vectorToRotate)){
      //If the camera is already at the focus point, move the camera backwards, focus, then move towards the focus point
      camera.moveBackward(100);
      vectorToRotate = Vector.getVectorAB(focusPoint, camera.position);
      camera.position = Vector.add(focusPoint, Vector.rotate3dAroundOrigin(vectorToRotate, rotationAxis,radiansToRotate));
      camera.focus(focusPoint);
      camera.position = focusPoint;
    }else{
      camera.position = Vector.add(focusPoint, Vector.rotate3dAroundOrigin(vectorToRotate, rotationAxis,radiansToRotate));
      camera.focus(focusPoint);
    }
  }
  
  //This function does the following:
  //1)Makes sure the camera is focused on the focus point
  //2)Plane of rotation is defined by x axis of the camera and the focus point and the position of the camera
  //The y axis of the camera is perpendicular to this plane.
  //
  //rotates the camera's position
  function rotateCameraLeftAroundFocusPoint(){
    rotateCameraAroundFocusPoint(1, new Vector(0,1,0), window.graph.focusPoint, window.graph.camera);
  }

  function rotateCameraRightAroundFocusPoint(){
    rotateCameraAroundFocusPoint(-1, new Vector(0,1,0), window.graph.focusPoint, window.graph.camera);
  }

  function rotateCameraUpAroundFocusPoint(){
    rotateCameraAroundFocusPoint(1, new Vector(1,0,0), window.graph.focusPoint, window.graph.camera);
  }

  function rotateCameraDownAroundFocusPoint(){
    rotateCameraAroundFocusPoint(-1, new Vector(1,0,0), window.graph.focusPoint, window.graph.camera);
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
    panLeftHead()
    render()
  }

  function _panRight(){
    window.graph.camera.panRight();
  }
  
  function panRightHead(){
    Logic.binaryCondition(cameraInFocusMode, rotateCameraRightAroundFocusPoint, _panRight);
  }
  
  function panRight(){
    panRightHead()
    render()
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

  function rotateClockwise(){
    window.graph.camera.rotateClockwise(this.angleStep);
    window.renderer.renderScene();
  }
  
  function rotateCounterclockwise(){
    window.graph.camera.rotateCounterclockwise(this.angleStep);
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
    this.renderer.renderScene();
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
    window.graph.camera.focalLength = window.graph.camera.focalLength * 1.1;
    window.renderer.renderScene();
  }
  
  function decreaseFocalLength(){
    window.graph.camera.focalLength = window.graph.camera.focalLength / 1.1;
    window.renderer.renderScene();
  }

  function increaseMagnification(){
    window.graph.renderer.camera.magnification *= 2;
    window.graph.renderer.renderScene();
  }
  
  function decreaseMagnification(){
    window.graph.renderer.camera.magnification = window.graph.renderer.camera.magnification / 1.1;
    window.graph.renderer.renderScene();    
  }
  
  function generateExponentialPoints(){
    var datapoints = [];
    //x axis is the sum of factors
    //y axis is the base
    //z axis is base ^ (sum of factors/base)
    for (var x = 1; x < 20; x = x + 1){
      for (var z = 0; z < 20; z = z + 1){
        var y = Math.log(Math.pow(x, z/x));
        datapoints.push(new Vector(x,y,z));
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


    if (key=='p') window.graph.customDebugger.disableMessages = !window.graph.customDebugger.disableMessages;
    //0 key activates the debugging messages
//    if (key=='0'){
//    }
  }

  this.initialized = false;

  //displays a scene
  this.display = function(scene){
    //if init has not been performed, then perform it
    if (!this.initialized){
      this.initialize();
    }
    this.renderer.renderScene();
  }

  //distance moved by mouse is the angle to rotate in radians
  this.calculateDragRotationAngle = function(mouseDragDistance, focusPointDistance){
    return Math.atan(mouseDragDistance/focusPointDistance) * 180 / Math.PI * 2;
  }

  this.setupMouse = function(){
    this.mouse = new Mouse(this.canvas);

    var dragEndAction = function(){
      var zCrossDragging = Vector.crossProduct(new Vector(0,0,1), new Vector(this.mouse.draggingVector.x, -this.mouse.draggingVector.y, 0));
      var angleToRotate = this.calculateDragRotationAngle(Vector.magnitude(zCrossDragging), Vector.distance(this.focusPoint, this.camera.position));
      if (Vector.magnitude(zCrossDragging) == 0){ //When mouse is in same spot it started in, zCrossDragging becomes the 0 vector
        zCrossDragging = new Vector(1,0,0); //arbitrary in case of rotation by 0 degrees
      }
      var axisOfRotation = Vector.getUnitVector(zCrossDragging);
      rotateCameraAroundFocusPoint(angleToRotate, axisOfRotation, this.focusPoint, this.camera);

      this.renderer.renderScene();
    }.bind(this);


    var draggingAction = function(){
      var zCrossDragging = Vector.crossProduct(new Vector(0,0,1), new Vector(this.mouse.draggingVector.x, this.mouse.draggingVector.y, 0));
      var angleToRotate = this.calculateDragRotationAngle(Vector.magnitude(zCrossDragging), Vector.distance(this.focusPoint, this.camera.position));


      if (Vector.magnitude(zCrossDragging) == 0){ //When mouse is in same spot it started in, zCrossDragging becomes the 0 vector
        zCrossDragging = new Vector(1,0,0); //arbitrary in case of rotation by 0 degrees
      }
      var axisOfRotation = Vector.getUnitVector(zCrossDragging);
      rotateCameraAroundFocusPoint(angleToRotate, axisOfRotation, this.focusPoint, this.camera);

      this.renderer.renderScene();

    }.bind(this);

    this.mouse.setAction("drag end", dragEndAction);
    this.mouse.setAction('drag', draggingAction);

    this.mouse.updateBoundingClientRect(this.canvas);
  }

  this.setupCanvas = function(){
    this.canvasWrapper = document.createElement("div");
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(this.canvasWrapper);

    this.canvas = document.createElement('canvas');
    this.canvasWrapper.appendChild(this.canvas);

    //for testing
    this.canvas.style.border="thin solid red";

    this.canvas.height = 500;
    this.canvas.width = 500;
  }

  this.setupDebuggingSystem = function(){
    window.graph.debuggingEnabled = true;

    this.customDebugger = new Posts();
    window.graph.customDebugger = this.customDebugger;
    this.mouse.customDebugger = this.customDebugger;

    this.customDebugger.attach(this.canvasWrapper);

    window.customDebugger = this.customDebugger;
    this.mouse.updateMouseStatus();
  }

  this.setupRenderer = function(){
    this.context = this.canvas.getContext("2d");
    this.camera = new Camera(new Vector(0,0,0));

    //there are two available camera modes: "focus point" and "free camera"
    this.cameraMode = "free camera";


    var scene = new Scene();

    for (var i = 0; i < this.datapoints.length; i++){
      var colourString;
      if (this.height == 0){
        colourString = "#000000";
      }else{
        colourString = Colour.getNeutralString(Math.floor(((this.datapoints[i].getZ() - this.lowestDatapoint.getZ())/this.height)* Colour.maxGrayNumber));
      }
      
      var colourPoint = new ColourPoint
      (
        new Vector(this.datapoints[i].getX(), this.datapoints[i].getY(), this.datapoints[i].getZ()),
        colourString
      );
      scene.addColourPoint(colourPoint);
    }

    scene.addColourPoint(new ColourPoint(new Vector(this.centroid.getX(), this.centroid.getY(), this.centroid.getZ()), "#00ff00"))
    
    this.scene = scene;
    this.mainScene = scene;

    this.renderer = new Renderer(this.camera, this.scene, this.canvas, this.context);
  }

  this.setupDatapoints = function(){
    this.datapoints = generateExponentialPoints()
  }

  this.calculateAttributes = function(){
    this.highestDatapoint = getHighestDatapoint(this.datapoints);
    this.lowestDatapoint = getLowestDatapoint(this.datapoints);
    this.height = this.highestDatapoint.getZ() - this.lowestDatapoint.getZ();
    this.centroid = calculateCentroid(this.datapoints);
    this.focusPoint = this.centroid;

    //graphRadius is the distance from the centroid of the graph to the farthest extremity
    this.graphRadius = calculateGraphRadius(this.centroid, this.datapoints);
  }

  this.setupKeyboard = function(){
    document.onkeypress = getKeyPress;
  }

  this.setupCamera = function(){
    if (this.options.cameraMode == "free camera"){
      setCameraMode("free camera");
    }
    else if (this.options.cameraMode == "focus point"){
      setCameraMode("focus point");
    }

    if (this.debuggingEnabled){
      this.customDebugger.stickyMessage("Camera Mode: " + this.cameraMode, "camera mode");
    }

    //initial camera location for focus point
    if (this.cameraMode == "focus point"){
      this.camera.position = new Vector(0,0,2 * this.graphRadius);
      this.camera.focus(this.focusPoint);
    }

    if (this.debuggingEnabled){
      this.customDebugger.stickyMessage("centroid:" + this.centroid.getX() + ',' + this.centroid.getY() + ',' + this.centroid.getZ(), "centroid");
    }
  }


  this.setupConstants = function(){
    this.angleStep = 10;
  }

  this.initialize = function(){
    this.setupCanvas();
    this.setupMouse();
    this.setupDatapoints();
    this.calculateAttributes();
    this.setupRenderer();
    this.setupKeyboard();    
    this.setupCamera();
    this.setupConstants();
    this.setupDebuggingSystem();

    var initializationObject = 
    [  
 /*
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
      
      ["switchCameraMode", switchCameraMode, "Switch camera mode", "j"],*/
      ["increaseMagnification", increaseMagnification, "Increase Magnification", "+"],
      ["decreaseMagnification", decreaseMagnification, "Decrease Magnification", "-"]
    ];

    
    this.generateButtons(initializationObject);

    this.initialized = true;
  }

  function setCameraMode(cameraMode){
    window.graph.cameraMode = cameraMode;
    window.graph.customDebugger.stickyMessage("Camera Mode: " + window.graph.cameraMode, "camera mode");
  }

}
