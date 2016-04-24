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
