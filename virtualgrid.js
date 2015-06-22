//need to decide what the virtualgrid is made up of. Is it a set of colour points, or a set of points?

//An x,y grid, where each x,y coordinate corresponds to a set of pixels with those x,y values.
//For example: (2,3,5), (2,3,8) will both be in coordinate (2,3) in the virtual grid.
function VirtualGrid(){
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
/*
    var columnKeys = Programming.getArrayKeys(this.objects);
    for (var i = 0; i < columnKeys.length; i++){
      var rowKeys = Programming.getArrayKeys(this.objects[columnKeys[i]]);
      for (j = 0; j < rowKeys.length; j++){
        for (var k = 0; k < this.objects[columnKeys[i]][rowKeys[j]].length; k++){
          passedInFunction(this.objects[columnKeys[i]][rowKeys[j]][k]);
        }
      }
    }
*/
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




