function Programming(){
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

//stopCondition is the only required parameter
//Programming.iterateUntil = function(getIndexThroughLinearSearch,stopCondition, functionToPerform, input, output){
//}


//Same thing as a function, but with different syntax
//Programming.procedure(thingToDo, input,output){
//}


Programming.getIndexThroughLinearSearch = function(stopCondition, inputArray){
try{
  for (var i = 0; i < inputArray.length; i++){
    if (stopCondition(inputArray[i])){
      return i;
    }
  }
}
catch(err){
debugger;
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
