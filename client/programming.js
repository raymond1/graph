function Programming(){
}

//returns true if test is between lowerBound and upperBound
Programming.between = function(test, lowerBound,upperBound){
  if (test >= lowerBound && test <= upperBound) return true;
  return false;
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

Programming.getIndexOfMin = function(_numericArray){
  var workingMin = _numericArray[0];
  var workingMinIndex = 0;
  for (var i = 0; i < _numericArray.length; i++){
    if (_numericArray[i] < workingMin){
      workingMin = _numericArray[i];
      workingMinIndex = i;
    }
  }
  return workingMinIndex;
}

Programming.insertAfter = function(elementToInsert, targetLocation){
  var parentElement = targetLocation.parentNode;
  parentElement.insertBefore(elementToInsert, targetLocation.nextSibling);
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

Programming.stringInList = function (string, list){
  for (var i = 0; i < list.length; i++){
    if (string == list[i]) return true;
  }
  return false;
}

//Running this on an object will give it the ability to process commands in a queue.
Programming.addCommandQueueCapability = function(object, commands) {
  object.commands = []
  for (var i = 0; i < commands.length; i++){
    object.commands[commands[i].commandString] = commands[i] //commands is an array of Command objects. A command object maps a string command to an action(function)
  }
  object.commandQueue = []  //commandQueue
  object.processCommandQueue = function(){
    var i
    for (i = 0; i < this.commandQueue.length; i++){
      this.commands[this.commandQueue[i]].action() 
    }
  }.bind(object)

  object.addCommandToQueue = function(commandString){
    this.commandQueue.push(commandString)
  }.bind(object)
}

function Command(commandString, action){
  this.commandString = commandString
  this.action = action
}

