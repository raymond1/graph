function Renderer(camera, scene, canvas, context){
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
    cameraCoordinateSystem.axes.push(this.camera.xAxis);
    cameraCoordinateSystem.axes.push(this.camera.yAxis);
    var cameraZAxis = Vector.crossProduct(Vector.getUnitVector(this.camera.xAxis),Vector.getUnitVector(this.camera.yAxis));
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

  //when a colour point is prerendered, it is put into a 3d space
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
  
  this.renderScene = function(){
    this.clear();

    
    
    //render all of the colour points onto the virtual grid
    for (var i = 0; i < this.scene.sceneObjects.length; i++){
      if (this.scene.sceneObjects[i].objectType == "colour point"){
        this.prerenderColourPoint(this.scene.sceneObjects[i]);
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
    
    posts.stickyMessage("camera position:" + this.camera.position.getX() + ',' + this.camera.position.getY() + ',' + this.camera.position.getZ());
  }

  this.discardColourPointsOutsideViewport = function(){
    var listOfColourPointsToDiscard = this.virtualGrid.applyFilter("discard", this.withinViewport);

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
    cameraCoordinateSystem.axes.push(this.xAxis);
    cameraCoordinateSystem.axes.push(this.yAxis);
    cameraCoordinateSystem.axes.push(Vector.crossProduct(this.xAxis,this.yAxis));

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
