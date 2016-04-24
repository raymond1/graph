//camera always looks into the direction pointed to by this.zAxis
//
//camera.position: Vector(x,y,z)
//camera.focalLength: number

//yes... this is now a 3d camera instead of an n-dimensional camera
function Camera(positionVector, orientation){
  if (positionVector == null){
    positionVector = new Vector(0,0,0);
  }
  this.position = new Vector(positionVector.getX(), positionVector.getY(), positionVector.getZ());

  this.focalLength = 1000;
  this.magnification = 1;
  this.orientation = new Orientation(new Vector(1,0,0), new Vector(0,1,0));
  if (orientation != null){
    this.orientation.xAxis = orientation.xAxis;
    this.orientation.yAxis = orientation.yAxis;
  }

  this.getZAxis = function(){
    return Vector.crossProduct(this.orientation.xAxis,this.orientation.yAxis);
  }
  
  this.panRight = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    var newXAxis = Vector.rotate3dAroundOrigin(this.orientation.xAxis,this.orientation.yAxis, angle);
    newXAxis = Vector.getUnitVector(newXAxis);
    newXAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(this.orientation.yAxis, newXAxis);
    this.orientation.xAxis = newXAxis;
  }

  this.panLeft = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    var newXAxis = Vector.rotate3dAroundOrigin(this.orientation.xAxis,this.orientation.yAxis, -angle);
    newXAxis = Vector.getUnitVector(newXAxis);
    newXAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(this.orientation.yAxis, newXAxis);
    this.orientation.xAxis = newXAxis;
  }
  
  this.panUp = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    var newYAxis = Vector.rotate3dAroundOrigin(this.orientation.yAxis,this.orientation.xAxis, angle);
    newYAxis = Vector.getUnitVector(newYAxis);
    newYAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(this.orientation.xAxis, newYAxis);
    this.orientation.yAxis = newYAxis;
  }
  
  this.panDown = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    var newYAxis = Vector.rotate3dAroundOrigin(this.orientation.yAxis,this.orientation.xAxis, -angle);
    newYAxis = Vector.getUnitVector(newYAxis);
    newYAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(this.orientation.xAxis, newYAxis);
    this.orientation.yAxis = newYAxis;
  }
  
  //by default, rotate one degree
  this.rotateClockwise = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    
    var zAxis = Vector.crossProduct(this.orientation.xAxis,this.orientation.yAxis);
    var newXAxis = Vector.copy(this.orientation.xAxis);
    newXAxis = Vector.rotate3dAroundOrigin(newXAxis,zAxis, angle);
    var newYAxis = Vector.copy(this.orientation.yAxis);
    newYAxis = Vector.rotate3dAroundOrigin(newYAxis,zAxis, angle);

    newXAxis = Vector.getUnitVector(newXAxis);
    newYAxis = Vector.getUnitVector(newYAxis);

    newXAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(zAxis, newXAxis);
    newYAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(zAxis, newYAxis);

    this.orientation.xAxis = newXAxis;
    this.orientation.yAxis = newYAxis;
  }

  this.rotateCounterclockwise = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    
    var zAxis = Vector.crossProduct(this.orientation.xAxis,this.orientation.yAxis);
    var newXAxis = Vector.rotate3dAroundOrigin(this.orientation.xAxis,zAxis, -angle);
    var newYAxis = Vector.rotate3dAroundOrigin(this.orientation.yAxis,zAxis, -angle);

    newXAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(zAxis, newXAxis);
    newYAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(zAxis, newYAxis);

    this.orientation.xAxis = newXAxis;
    this.orientation.yAxis = newYAxis;
  }
  
  this.moveForward = function(distance){
    if (distance == null) distance = 1;
    var zDirection = Vector.getUnitVector(Vector.crossProduct(this.orientation.xAxis,this.orientation.yAxis));
    this.position = Vector.add(this.position, Vector.scalarMultiply(distance,zDirection));
  }

  this.moveBackward = function(distance){
    if (distance == null) distance = 1;
    var zDirection = Vector.crossProduct(this.orientation.xAxis,this.orientation.yAxis);
    this.position = Vector.subtractFirstFromSecond(Vector.scalarMultiply(distance,zDirection), this.position);
  }

  this.moveLeft = function(distance){
    if (distance == null) distance = 1;
    this.position = Vector.subtractFirstFromSecond(Vector.scalarMultiply(distance,this.orientation.xAxis), this.position);
  }

  this.moveRight = function(distance){
    if (distance == null) distance = 1;
    this.position = Vector.subtractFirstFromSecond(Vector.scalarMultiply(-distance,this.orientation.xAxis), this.position);
  }

  this.moveUp = function(distance){
    if (distance == null) distance = 1;
    this.position = Vector.subtractFirstFromSecond(Vector.scalarMultiply(-distance,this.orientation.yAxis), this.position);
  }

  this.moveDown = function(distance){
    if (distance == null) distance = 1;
    this.position = Vector.subtractFirstFromSecond(Vector.scalarMultiply(distance,this.orientation.yAxis), this.position);
  }

  //rotates the camera so that it focuses on a particular point
  this.focus = function (point){
    //if the camera is located at the focus point, then it is already focused                                                                                                                                                                                                                                                                                                  
    if (Vector.distance(point, this.position) == 0){
      return;
    }
    
    //the direction of the theoretical z axis the camera should point in
    var targetZAxis = Vector.getVectorAB(this.position,point);
    var currentZAxis = Vector.crossProduct(this.orientation.xAxis,this.orientation.yAxis);

    var unitTargetZAxis = Vector.getUnitVector(targetZAxis);
    var unitCurrentZAxis = Vector.getUnitVector(currentZAxis);
    
    //need to rotate the current Z axis vector so that it aligns with the target Z axis vector
    //the axis of rotation is the current axis vector cross producted with the target Z axis unit vector
    //There is an ambiguous case when the two vectors are collinear.

    //case 1:
    //when collinear and same direction, done
    if (Vector.areCollinear(unitCurrentZAxis, unitTargetZAxis)){
      if (Vector.sameDirection(unitCurrentZAxis, unitTargetZAxis)){
        return;
      }
      else{
        //case 2:
        //when collinear and opposite directions, flip the orientation of the camera
        this.orientation.yAxis = Vector.getNegativeVector(this.orientation.yAxis);
        this.orientation.xAxis = Vector.getNegativeVector(this.orientation.xAxis);
        return;
      }
    }
    
    //case 3: otherwise, the vectors are not collinear    
    var dotProduct = Vector.dotProduct(unitTargetZAxis,unitCurrentZAxis);
    if (dotProduct > 1) dotProduct = 1;
    if (dotProduct < -1) dotProduct = -1;
    
    var angleToRotate = Math.acos(dotProduct);
    var targetZAxisCrossCurrentZAxis = Vector.crossProduct(targetZAxis,currentZAxis);
    var rotationAxis = Vector.getUnitVector(targetZAxisCrossCurrentZAxis);

    //Rotate the camera's x and y axes
    this.orientation.yAxis = Vector.rotate3d(this.orientation.yAxis, rotationAxis, -angleToRotate);
    this.orientation.xAxis = Vector.rotate3d(this.orientation.xAxis, rotationAxis, -angleToRotate);
  }
  
  this.moveTo = function(point){
    this.position = Vector.copy(point);
  }
}
