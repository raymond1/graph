function Programming(){
}

Programming.nothing = function(object){
  if (object == null||object == undefined) return true;
  else return false;
}


Programming.iterateListThroughRange = function(list,startIndex,endIndex, passedInFunction){
  for (var i = startIndex; i <= endIndex; i++){
    passedInFunction(list[i]);
  }
}

Programming.iterateThroughList = function(_array, _function){
  for (var i = 0; i < _array.length; i++){
    _function(_array[i]);
  }
}

Programming.getIndexThroughLinearSearch = function(stopCondition, inputArray){
  for (var i = 0; i < inputArray.length; i++){
    if (stopCondition(inputArray[i])){
      return i;
    }
  }
}

Programming.getArrayKeys = function(_array){
  var keys = [];
  for(var key in _array) {
    if(_array.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys;
}


//assumes _numericArray has at least on element
Programming.getIndexOfMax = function(_numericArray){
  var workingMax = _numericArray[0];
  var workingMaxIndex = 0;
  for (var i = 0; i < _numericArray.length; i++){
    if (_numericArray[i] > workingMax){
      workingMax = _numericArray[i];
      workingMaxIndex = i;
    }
  }
  return workingMaxIndex;
}

//JavaScript specific

//returns a new function that calls the old function before calling the new function
Programming.addFunctionToChain = function (newFunction, oldFunction){
  return function(){
    if (!Programming.nothing(oldFunction)){
      oldFunction();
    }
    newFunction();
  }
}



function Command(commandString){
  this.arguments = [];
  this.argument = this.arguments;
  this.commandString = commandString;
  this.addArgument = function(argument){
    this.arguments.push(argument);
  }
}

function CommandQueue(){
  this.queue = [];
  this.length = 0;
  this.add = function(command){
    this.queue.push(command);
    this.length++;
  }
}


//There is only one end user facing function: this.addCommandToQueue
//addCommandToQueue takes only certain strings as commands:
//Current commands:
//open
//generateOpenButton <--best tested

//this.addCommandToQueue
//this.addCommandToQueue('open') starts the visual engine
//this.addCommandToQueue('  --returns a reference to the command
//this.addCommandToQueue('generateOpenButton');
//this.addCommandToQueue('addArguments', command, array of arguments);

function VisualEngine(){

  this.commandQueue = new CommandQueue();
  //if commandString matches with a value from the api, then load it into the queue
  //once the window has finished loading, the commands will be called one by one
  this.addCommandToQueue = function (commandString){
    if (commandString == 'open' || commandString == 'generateOpenButton'){
      var newCommand = new Command(commandString);
      this.commandQueue.add(newCommand);
    }
    return newCommand;
  }


  //goes through the command queue and executes the commands contained within
  this.processCommandQueue = function(){
    for (var i = 0; i < this.commandQueue.queue.length; i++){
      var currentCommand = this.commandQueue.queue[i];
      switch(currentCommand.commandString){
        case 'open':
          break;
        case 'generateOpenButton':
          var idOfContainer = currentCommand.arguments[0];
          this.generateOpenButton(idOfContainer);
          break;
        default:
      }
    }
  }.bind(this);

  var boundProcessCommandQueue = function(){
    this.processCommandQueue();
  }.bind(this);

  var oldOnload = window.onload;

  window.onload = function(){
    if (oldOnload != null && oldOnload != undefined)
      oldOnload();

    boundProcessCommandQueue();
  }

  //opens up a new window
  //if object is null, then a new window is opened up
  //if an object has been passed in, then the Visual Engine will be created within it.
  this.containerObject = null;

  this.open = function(){
    var newWindow;
    if (Programming.nothing(this.containerObject)){
      newWindow = open("window.html", "asdf", "height=1000,width=1000,top=0,menubar=yes,toolbar=yes");
      if (newWindow == null){
      }
      else{
        newWindow.focus();
      }
    }
    else{
      //assume a valid container element has been passed in.
    }
  }

  //id is the containing element id of the element where the open button will be generated.
  this.generateOpenButton = function (id){
    var parentElement = document.getElementById(id);
    
    var onClick = function(){
      this.open();
    }
    var boundOnClick = onClick.bind(this);

    var parentElement2 = document.getElementById(id);
    var openButton = document.createElement('button');
    var openButtonText = document.createTextNode('Open Visual Engine');
    openButton.appendChild(openButtonText);
    
    if (openButton.addEventListener) {
      openButton.addEventListener("click", boundOnClick, false);
    } else {
      openButton.attachEvent('onclick', boundOnClick);
    }

    parentElement2.appendChild(openButton);
  }
}



