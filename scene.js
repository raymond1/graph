//a scene is composed of points, lines and surfaces

function Scene(){
  this.sceneObjects = [];
  //adds a single point to the scene
  this.addPoint = function(point){
    this.sceneObjects.push(point);
  }
  
  //adds multiple points to a scene
  this.addPoints = function(){
  }
}