function Programming(){
}

//returns true if the string haystack contains the string needle
Programming.contains = function (haystack, needle){
  if (haystack.search(needle) > -1){
    return true;
  }
  return false;
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

Programming.getMin = function(numeric_array){
  var minimum_value; 
  for (var i = 0; i < numeric_array.length; i++){
    if (typeof minimum_value == 'undefined'){
      minimum_value = numeric_array[i]
    }
    else{
      if (minimum_value > numeric_array[i]){
        minimum_value = numeric_array[i]
      }
    }
    
  }
  return minimum_value;
}

Programming.getMax = function(numeric_array){
  var maximum_value
  for (var i = 0; i < numeric_array.length; i++){
    if (typeof maximum_value == 'undefined'){
      maximum_value = numeric_array[i];
    }
    else{
      if (numeric_array[i] > maximum_value){
        maximum_value = numeric_array[i]
      }
    }
  }
  return maximum_value
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
      try{
        this.commands[this.commandQueue[i]].action()
      }
      catch (e){
        console.log('unable to activate action for command ' + this.commandQueue[i])
      }
    }
  }.bind(object)

  object.addCommandToQueue = function(commandString){
    this.commandQueue.push(commandString)
  }.bind(object)
}

Programming.getUniqueIDMaker = function (){
  var usedIDs = [];
  function innerFunction(){
    var randomString = "";

    function inArray(value,array){
      for (var i = 0; i < array.length; i++){
        if (array[i] == value) return true;
      }
      return false;
    }
      
    while (inArray(randomString,usedIDs)||randomString == ''){
      var randomNumber = Math.floor(Math.random()*2);
      randomString = randomString + randomNumber;
    }
    usedIDs.push(randomString);
    return randomString;
  }
  return innerFunction;
}





function Command(commandString, action){
  this.commandString = commandString
  this.action = action
}


function RangeString(range_string){
}


//Assume range string is in the correct format
//Example range strings:
//""
//"2"
//"2-3"
//"0-1,3-4"
//Returns an array with the selected range indices showing 1, and the non-selected range indices showing 0
//For example, "0-1,3-4" would return the following array:
//[1,1,0,1,1]
//Indices 0-1 would be set to 1, as would indices 3-4. Index 2 would be 0 because it was not set to 1 anywhere else
RangeString.flatten = function(range_string){
  if (range_string == '') return []

  var ranges = range_string.split(',')

  var InternalFlattenedArray = function(){
    length: 0
    internal_array: []
    function activate_index(index){
      if (index > length - 1){
        var temp_array = []
        for (var i = 0; i < length; i++){
          temp_array[i] = internal_array[i];
        }

        //increase length
        for (var i = 0; i < index; i++){
          internal_array[i] = 0
        }

        for (var i = 0; i < temp_array.length; i++){
          internal_array[i] = temp_array[i]
        }
        internal_array[index] = 1
      }
    }
  }

  var internal_flattened_array = new InternalFlattenedArray()
  //a single type range is something like 2, 6, 8
  //a double type range is something like 1-9, 2-7
  for (var i = 0; i < ranges.length; i++){
    if (range_is_single(ranges[i])){
      //what is the number?
      activate_index(new Number(ranges[i]))
    }
    else { //assume range must be in double form
      var limits = range[i].split('-')
      for (var j = limits[0]; j <= limits[1]; j++){
        InternalFlattenedArray.activate_index(j)
      }
    }
  }
  //get everything from first beginning to first comma
  //Number of ranges = number of commas + 1, unless the first range is the null set
}

//[0,1,2,3,4,5]
//For each comma-separated line, find the indices filled in
//flatten the result
//Return first free index
//assume the input range string is in a correct format?
//no overlapping ranges, no ranges that are singles, correct comma-ization
//All consecutive ranges have been connected together
//If there are no free indexes, -1 is returned
RangeString.range_string_get_first_available_index = function(range_string){
  var available_index = -1
  //flatten the range string into an array

  flattened_range_array = flatten(range_string)
  //check if 0 is available
  first_available_index = get_first_available_index(flattened_range_array)
  return first_available_index
}
