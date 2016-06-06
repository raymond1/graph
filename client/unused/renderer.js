function Orientation(xAxisVector, yAxisVector){
  this.xAxis = xAxisVector;
  this.yAxis = yAxisVector;
}


//a scene is composed of points, lines and surfaces

function Scene(){
  this.sceneObjects = [];
  //adds a single colour point to the scene
  this.addColourPoint = function(colourPoint){
    this.sceneObjects.push(colourPoint);
  }
  
  //adds multiple colour points to a scene
  this.addMultipleColourPoints = function(colourPoints){
    for (var i = 0; i < colourPoints.length; i++){
      this.sceneObjects.push(colourPoints[i]);
    }
  }
  
  this.addLine = function(line){
    this.sceneObjects.push(line);
  }
  
  this.addTriangle = function(triangle){
    this.sceneObjects.push(triangle);
  }
}

function Colour(){
}

//takes in a number from 0 to 255, and returns the corresponding gray colour
Colour.getNeutralString = function (grayNumber){
  var singleChannelString = grayNumber.toString(16) + "";
  if (singleChannelString.length < 2){
    singleChannelString = "0" + singleChannelString;
  }
  
  return "#" + singleChannelString + singleChannelString + singleChannelString;
}

Colour.maxColour = 255;
Colour.maxGrayNumber = 255;
Colour.numberOfGrays = 256;


function ColourPoint(vector,colour){
  this.objectType = "colour point";
  this.vector = vector;
  this.colour = colour;
}

function Line(pointA,pointB, colour){
  this.objectType = 'line';
  this.pointA = pointA;
  this.pointB = pointB;
  this.colour = colour;
}

function WebGLRenderer(camera, scene, canvas, context){
  this.objectType='Renderer';
  this.camera = camera;
  this.scene = scene;
  this.canvas = canvas;
  this.context = context;

  this.calculateVectorInCameraCoordinateSystem = function(vector){
    //Let a point that needs to be plotted be called P.
    //Let the position of the camera be called C
    //The position of P relative to C is called CP
    //CP in the coordinate system of the camera is called CPPrime

    //set up camera coordinate system
    var cameraCoordinateSystem = new CoordinateSystem();
    cameraCoordinateSystem.axes.push(this.camera.orientation.xAxis);
    cameraCoordinateSystem.axes.push(this.camera.orientation.yAxis);
    var cameraZAxis = Vector.crossProduct(Vector.getUnitVector(this.camera.orientation.xAxis),Vector.getUnitVector(this.camera.orientation.yAxis));
    cameraCoordinateSystem.axes.push(cameraZAxis);

    //calculate CP
    var CP = Vector.subtractFirstFromSecond(this.camera.position, vector);

    //get CP in camera's coordinate system
    var CPPrime = cameraCoordinateSystem.getVector(CP);

    return CPPrime;
  }

  this.calculatePointInCameraCoordinateSystem = this.calculateVectorInCameraCoordinateSystem;

  //A is the 3d vector that is passed in
  this.calculatePerspective = function (A){
    var depth = A.getZ();
    var X = A.getX() * this.camera.focalLength / (depth + this.camera.focalLength);
    var Y = A.getY() * this.camera.focalLength / (depth + this.camera.focalLength);

    return new Vector(X,Y,depth);
  }
  
  //Takes in a vector and rounds its coordinates to the closest integer
  this.calculateClosestPoint = function(A){
    return new Vector(Math.round(A.getX()), Math.round(A.getY()), Math.round(A.getZ()));
  }

  this.calculateMagnification = function(A){
    return Vector.scalarMultiply(this.camera.magnification, A);
  }
  
  this.withinViewport = function(colourPoint){
    var x = colourPoint.vector.getX();
    var y = colourPoint.vector.getY();

    if (x >= -this.canvas.width/2 && x <= this.canvas.width/2){
      if (y >= -this.canvas.height/2 && y <= this.canvas.height/2){
        return true;
      }
    }    
    return false;
  }

  //When a colour point is prerendered, it is put into a 3d space
  //This function calculates 3d transformations so that things are viewed from the camera's perspective
  this.prerenderColourPoint = function(colourPoint){
    //A is colourPoint from the camera's point of view, without perspective
    var A = this.calculateVectorInCameraCoordinateSystem(colourPoint.vector);

    //Let B be the coordinates of A, with perspective calculated using the camera's focal length
    var B = this.calculatePerspective(A);

    //Let C be the coordinates of B, with magnification calculated using the camera's magnification.
    var C = this.calculateMagnification(B);
    
    //approximate the 3d coordinates of the points to be rendered to the closest integer coordinates
    var D = this.calculateClosestPoint(C);
    
    //put C into an x,y grid
    var newColourPoint = new ColourPoint(D, colourPoint.colour);
    this.virtualGrid.insert(D.getX(),D.getY(), newColourPoint);
  }

  //uses prerenderColourPoint to process spatial transformations
  this.prerenderLine = function(line){
    var start = line.pointA;
    var end = line.pointB;

    var deltaX = end.getX() - start.getX();
    var deltaY = end.getY() - start.getY();
    var deltaZ = end.getZ() - start.getZ();

    var calculateNumberOfSteps = function(line){
      var returnValue = 0;
//opportunity for AI... Need alternative to variable names for accessing data
      var absoluteValueOfDeltaX = Math.abs(line.pointB.getX() - line.pointA.getX());
      var absoluteValueOfDeltaY = Math.abs(line.pointB.getY() - line.pointA.getY());


      var absoluteValueOfDeltaZ = Math.abs(line.pointB.getZ() - line.pointA.getZ());

      if (absoluteValueOfDeltaX >= absoluteValueOfDeltaY){
        returnValue = absoluteValueOfDeltaX;
      }else{
        returnValue = absoluteValueOfDeltaY;
      }

      if (absoluteValueOfDeltaZ >= returnValue){
        returnValue = absoluteValueOfDeltaZ;
      }else{
        
      }
      return returnValue;
    }

    //plot the first point, which is the start point
    var newColourPoint = new ColourPoint(new Vector(start.getX(), start.getY(), start.getZ()),line.colour);
    this.prerenderColourPoint(newColourPoint);

    var numberOfSteps = calculateNumberOfSteps(line);
    var denominator = numberOfSteps.toPrecision(5);
    var incrementVector = new Vector(deltaX/denominator,deltaY/denominator,deltaZ/denominator);

    for (var i = 1; i < numberOfSteps; i++){
      var newVector = new Vector(line.pointA.getX(), line.pointA.getY(), line.pointA.getZ());
      var newIncrementVector = Vector.scalarMultiply(i, incrementVector);
      var vectorToAdd = Vector.add(newVector, newIncrementVector);
      var colourPointToAdd = new ColourPoint(vectorToAdd,line.colour);
      this.prerenderColourPoint(colourPointToAdd);
    }
  }
  
  this.renderScene = function(){
    this.clear();

    //render all of the colour points onto the virtual grid
    for (var i = 0; i < this.scene.sceneObjects.length; i++){
      switch(this.scene.sceneObjects[i].objectType){
        case 'colour point':
          this.prerenderColourPoint(this.scene.sceneObjects[i]);
          break;
        case 'line':
          this.prerenderLine(this.scene.sceneObjects[i]);
          break;
        default:
          break;
      }
    }
    //discard all colour points that are behind the camera
    this.discardAllColourPointsBehindCamera();
    //go through all of the points in the virtual grid, and leave behind only those which should be displayed
    this.discardOccludedColourPoints();
    //discard colour points not within the viewport
    this.discardColourPointsOutsideViewport();

    //draw all of the remaining points.
    var renderer = this;

    var translateAndDrawPixel = function (colourPoint){
      colourPoint.vector.setX(colourPoint.vector.getX() + canvas.width/2);
      colourPoint.vector.setY(colourPoint.vector.getY() + canvas.height/2);
      renderer.drawPixel(colourPoint);
    }

    this.virtualGrid.iterate(translateAndDrawPixel);
    
    window.customDebugger.stickyMessage("camera position:" + this.camera.position.getX() + ',' + this.camera.position.getY() + ',' + this.camera.position.getZ(), 'camera position');
    window.customDebugger.stickyMessage('camera orientation: x axis:' + this.camera.orientation.xAxis.getX() + ',' + this.camera.orientation.xAxis.getY() + ',' + this.camera.orientation.xAxis.getZ() + '| y axis:' + this.camera.orientation.yAxis.getX() + ',' + this.camera.orientation.yAxis.getY() + ',' + this.camera.orientation.yAxis.getZ(), 'camera orientation');
  }

  this.discardColourPointsOutsideViewport = function(){
    var listOfColourPointsToDiscard = this.virtualGrid.applyFilter("discard", this.withinViewport.bind(this));

    var _virtualGrid = this.virtualGrid;
    var _discardFunction = function discardFunction(colourPoint){
        _virtualGrid.discard(colourPoint);
    }

    Programming.iterateThroughList(listOfColourPointsToDiscard, _discardFunction);
  }

  this.getDiscardingFunction = function(){
    var virtualGrid = this.virtualGrid;
    ///
  }


  //var discardingFunction = this.getDiscardingFunction();
  this.getDiscardFunction = function (){
    var virtualGrid = this.virtualGrid;
    var functionToReturn = function(colourPoint){
      virtualGrid.discard(colourPoint);
    }
    
    return functionToReturn;
  }
  
  this.discardAllColourPointsBehindCamera = function(){
    var listOfColourPointsToDiscard = this.virtualGrid.applyFilter("keep", this.getAllColourPointsBehindCamera);
    var discardFunction = this.getDiscardFunction();

    Programming.iterateThroughList(listOfColourPointsToDiscard, discardFunction); 
  }

  //if vector is behind the camera(z value less than 0), then this function returns true
  this.getAllColourPointsBehindCamera = function(colourPoint){
    var returnValue = (colourPoint.vector.getZ() <= 0);
    return returnValue;
  }

  //would be cool to show something without perspective
  //returns the abstract coordinates of a set of datapoints from the camera's point of view
  //There is no perspective in this view
  this.getModelView = function(datapoints, camera){
    var model_points = [];
    
    //Let a point that needs to be plotted be called P.
    //Let the position of the camera be called C
    //The position of P relative to C is called CP

    var cameraCoordinateSystem = new CoordinateSystem();
    cameraCoordinateSystem.axes.push(this.orientation.xAxis);
    cameraCoordinateSystem.axes.push(this.orientation.yAxis);
    cameraCoordinateSystem.axes.push(Vector.crossProduct(this.orientation.xAxis,this.orientation.yAxis));

    //var projectionOfCPOnCameraXYPlane;
    for (var i = 0; i < datapoints.length; i++){
      var CP = Vector.subtractFirstFromSecond(this.position, datapoints[i]);
      
      var projectedVector = cameraCoordinateSystem.getVector(CP);
      model_points.push(projectedVector);
    }
    return model_points;
  }
  
  this.drawPixel = function(colourPoint){
    this.context.fillStyle = colourPoint.colour;
    this.context.fillRect(colourPoint.vector.getX(), colourPoint.vector.getY(), 1, 1);
  }

  
  this.clear = function(){
    this.context.fillStyle = "#ff0000";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.virtualGrid = new VirtualGrid();
  }

  //for every grid point, get rid of the colour points that do not have the highest possible z values
  //if there is more than one point which has the highest possible z value, then keep only one of them
  this.discardOccludedColourPoints = function(){
    //convert the list of colour points into a list of integers
    function convertColourPointListIntoDepthList(colourPointList){
      var depthList = [];
      for (var i = 0; i < colourPointList.length; i++){
        depthList[i] = colourPointList[i].vector.getZ();
      }
      return depthList;
    }

    var discardOccludedColourPointsHelper = function(gridPoints){
      var depthList = convertColourPointListIntoDepthList(gridPoints);
      var indexToKeep = Programming.getIndexOfMax(depthList);
      gridPoints = [gridPoints[indexToKeep]];
    }

    this.virtualGrid.iterateOverGrid(discardOccludedColourPointsHelper);    
  }
}
