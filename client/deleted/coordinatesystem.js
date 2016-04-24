function CoordinateSystem(){
  this.axes = [];
  this.addAxis = function(axis){
    this.axes.push(axis);
  }
  
  this.push = this.addAxis;
  this.getVector = function(inputVector){
    var newVector = new Vector;
    for (var i = 0; i < this.axes.length; i++){
      newVector.push(Vector.getComponent(inputVector, this.axes[i]));
    }
    return newVector;
  }
  
  this.toString = function(){
    var stringToReturn = "";
    for (var i = 0; i < this.axes.length; i++){
      stringToReturn += this.axes[i].contents() + "<br>\n";
    }
    return stringToReturn;
  }
}
