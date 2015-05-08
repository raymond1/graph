function Renderer(camera, scene, canvas, context){
  this.camera = camera;
  this.scene = scene;
  this.canvas = canvas;
  this.context = context;
  
  this.renderPoint = function(colourPoint){
    //Let a point that needs to be plotted be called P.
    //Let the position of the camera be called C
    //The position of P relative to C is called CP

    var cameraCoordinateSystem = new CoordinateSystem();
    cameraCoordinateSystem.axes.push(this.camera.xAxis);
    cameraCoordinateSystem.axes.push(this.camera.yAxis);
    var cameraZAxis = Vector.crossProduct(Vector.getUnitVector(this.camera.xAxis),Vector.getUnitVector(this.camera.yAxis));
    cameraCoordinateSystem.axes.push(cameraZAxis);

    //P
    var colourPointVector = new Vector(colourPoint.x, colourPoint.y, colourPoint.z);
    var colourPointVectorInCameraCoordinateSystem = cameraCoordinateSystem.getVector(colourPointVector);
    

    var CP = Vector.subtractFirstFromSecond(this.camera.position, colourPointVector);
    analyzer.stickyMessage("Camera position:" + this.camera.position.contents(), "camera position");
    var CPInCameraCoordinateSystem = cameraCoordinateSystem.getVector(CP);
    
    //Now calculate perspective.
    //x/(visible x) = (d + f)/f, where f = focal length, depth = distance from camera to point's z
    var distance = Vector.magnitude(CPInCameraCoordinateSystem);
    var depth = CPInCameraCoordinateSystem.getZ();
    var visibleX = CPInCameraCoordinateSystem.getX() * this.camera.focalLength / (depth + this.camera.focalLength);
    var visibleY = CPInCameraCoordinateSystem.getY() * this.camera.focalLength / (depth + this.camera.focalLength);
    
    //Now, determine if the point is visible or not. If it is visible(in front of or at the camera) display it if it is within the context viewport.
    var pointToDisplay = new Point(visibleX,visibleY,depth,colourPoint.colour);
    if (depth >= 0){
      if (this.withinViewPort(pointToDisplay)){
        //translate the point so that 0,0 is in the middle of the screen
        pointToDisplay.x = pointToDisplay.x + this.canvas.width/2;
        pointToDisplay.y = pointToDisplay.y + this.canvas.height/2;
        
        //then, transform the point to match the computer axes
        //var temp = pointToDisplay.x;
        //pointToDisplay.x = pointToDisplay.y;
        //pointToDisplay.y = temp;
        
        //analyzer.debugMessage("pointToDisplay:" + pointToDisplay.toString());
        this.drawPixel(pointToDisplay,colourPoint.colour);
      }
    }
  }
  
  this.withinViewPort = function(point){
    var withinViewPort = false;
    if (point.x >= -this.canvas.width/2 && point.x <= this.canvas.width/2){
      if (point.y >= -this.canvas.height/2 && point.x <= this.canvas.height/2){
        return true;
      }
    }    
    return withinViewPort;
  }
  
  this.renderScene = function(){
    this.clear();
    for (var i = 0; i < this.scene.sceneObjects.length; i++){
      if (this.scene.sceneObjects[i].objectType == "Point"){
        this.renderPoint(this.scene.sceneObjects[i]);
      }
    }    
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
  
  this.drawPixel = function(point, colour){
    this.context.beginPath();
    this.context.moveTo(point.x,point.y);
    this.context.fillStyle = colour;
    this.context.fillRect(point.x, point.y, 1, 1 );
    this.context.stroke();
  }
    
  this.clear = function(){
    this.context.fillStyle = "#ff0000";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

}