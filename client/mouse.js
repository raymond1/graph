/*
The coordinate system is shown below:
(0,0)---------------------(500,0)
|                            |
|                            |
|                            |
(0,500)-------------------(500,500)
*/

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
*/
      this.customDebugger.stickyMessage("this.position.xy:" + this.position.x + "," + this.position.y, "Mouse Coordinates");
      this.customDebugger.stickyMessage("this.boundingClientRect.xy:" + this.boundingClientRect.x + "," + this.boundingClientRect.y, "this.boundingClientRect.xy");
      this.customDebugger.stickyMessage("this.dragState: " + this.dragState, "this.dragState");
      this.customDebugger.stickyMessage("start to finish vector for dragging: " + this.draggingVector.x + "," + this.draggingVector.y, "dragging vector");
/*
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

