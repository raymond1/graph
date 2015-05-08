//camera always looks into the direction pointed to by this.zAxis
function Camera(_vector, orientation){
  if (_vector == null){
    _vector = new Vector(0,0,0);
  }
  this.position = new Vector(_vector.getX(), _vector.getY(), _vector.getZ());

  this.focalLength = 1000;
  
  if (orientation == null){
    this.yAxis = new Vector(0,1,0);
    this.xAxis = new Vector(1,0,0);
  }else{
    this.yAxis = orientation.axes[0];
    this.yAxis = orientation.axes[1];
  }


  this.panRight = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    var newXAxis = Vector.rotate3d(this.xAxis,this.yAxis, angle);
    newXAxis = Vector.getUnitVector(newXAxis);
    newXAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(this.yAxis, newXAxis);
    this.xAxis = newXAxis;
  }

  this.panLeft = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    var newXAxis = Vector.rotate3d(this.xAxis,this.yAxis, -angle);
    newXAxis = Vector.getUnitVector(newXAxis);
    newXAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(this.yAxis, newXAxis);
    this.xAxis = newXAxis;
  }
  
  this.panUp = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    var newYAxis = Vector.rotate3d(this.yAxis,this.xAxis, angle);
    newYAxis = Vector.getUnitVector(newYAxis);
    newYAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(this.xAxis, newYAxis);
    this.yAxis = newYAxis;
  }
  
  this.panDown = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    var newYAxis = Vector.rotate3d(this.yAxis,this.xAxis, -angle);
    newYAxis = Vector.getUnitVector(newYAxis);
    newYAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(this.xAxis, newYAxis);
    this.yAxis = newYAxis;
  }
  
  this.rotateClockwise = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    
    var zAxis = Vector.crossProduct(this.xAxis,this.yAxis);
    var newXAxis = Vector.copy(this.xAxis);
    newXAxis = Vector.rotate3d(newXAxis,zAxis, angle);
    var newYAxis = Vector.copy(this.yAxis);
    newYAxis = Vector.rotate3d(newYAxis,zAxis, angle);

    newXAxis = Vector.getUnitVector(newXAxis);
    newYAxis = Vector.getUnitVector(newYAxis);

    newXAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(zAxis, newXAxis);
    newYAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(zAxis, newYAxis);
    //newXAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(newYAxis, newXAxis);
    this.xAxis = newXAxis;
    this.yAxis = newYAxis;
  }

  this.rotateCounterclockwise = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    
    var zAxis = Vector.crossProduct(this.xAxis,this.yAxis);
    var newXAxis = Vector.rotate3d(this.xAxis,zAxis, -angle);
    var newYAxis = Vector.rotate3d(this.yAxis,zAxis, -angle);

    newXAxis = Vector.getUnitVector(newXAxis);
    newYAxis = Vector.getUnitVector(newYAxis);
    newXAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(zAxis, newXAxis);
    newYAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(zAxis, newYAxis);
    //newXAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(newYAxis, newXAxis);
    this.xAxis = newXAxis;
    this.yAxis = newYAxis;
  }
  
  this.moveForward = function(distance){
    if (distance == null) distance = 1;
    var zDirection = Vector.getUnitVector(Vector.crossProduct(this.xAxis,this.yAxis));
    this.position = Vector.add(this.position, Vector.scalarMultiply(distance,zDirection));
  }

  this.moveBackward = function(distance){
    if (distance == null) distance = 1;
    var zDirection = Vector.crossProduct(this.xAxis,this.yAxis);
    this.position = Vector.subtractFirstFromSecond(Vector.scalarMultiply(distance,zDirection), this.position);
  }

  this.moveLeft = function(distance){
    if (distance == null) distance = 1;
    this.position = Vector.subtractFirstFromSecond(Vector.scalarMultiply(distance,this.xAxis), this.position);
  }

  this.moveRight = function(distance){
    if (distance == null) distance = 1;
    this.position = Vector.subtractFirstFromSecond(Vector.scalarMultiply(-distance,this.xAxis), this.position);
  }

  this.moveUp = function(distance){
    if (distance == null) distance = 1;
    this.position = Vector.subtractFirstFromSecond(Vector.scalarMultiply(-distance,this.yAxis), this.position);
  }

  this.moveDown = function(distance){
    if (distance == null) distance = 1;
    this.position = Vector.subtractFirstFromSecond(Vector.scalarMultiply(distance,this.yAxis), this.position);
  }

}