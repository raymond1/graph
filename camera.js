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
    var newXAxis = Vector.rotate3dAroundOrigin(this.xAxis,this.yAxis, angle);
    newXAxis = Vector.getUnitVector(newXAxis);
    newXAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(this.yAxis, newXAxis);
    this.xAxis = newXAxis;
  }

  this.panLeft = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    var newXAxis = Vector.rotate3dAroundOrigin(this.xAxis,this.yAxis, -angle);
    newXAxis = Vector.getUnitVector(newXAxis);
    newXAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(this.yAxis, newXAxis);
    this.xAxis = newXAxis;
  }
  
  this.panUp = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    var newYAxis = Vector.rotate3dAroundOrigin(this.yAxis,this.xAxis, angle);
    newYAxis = Vector.getUnitVector(newYAxis);
    newYAxis = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(this.xAxis, newYAxis);
    this.yAxis = newYAxis;
  }
  
  this.panDown = function(angle){
    if (angle == null){
      angle = 1 * Math.PI/ 180;
    }
    var newYAxis = Vector.rotate3dAroundOrigin(this.yAxis,this.xAxis, -angle);
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
    newXAxis = Vector.rotate3dAroundOrigin(newXAxis,zAxis, angle);
    var newYAxis = Vector.copy(this.yAxis);
    newYAxis = Vector.rotate3dAroundOrigin(newYAxis,zAxis, angle);

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
    var newXAxis = Vector.rotate3dAroundOrigin(this.xAxis,zAxis, -angle);
    var newYAxis = Vector.rotate3dAroundOrigin(this.yAxis,zAxis, -angle);

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

  //rotates the camera so that it focuses on a particular point
  this.focus = function (point){
    //if the camera is located at the focus point, then the camera is already focused and nothing needs to be done.
    if (Vector.distance(point, this.position) == 0){
      return;
    }
    
    //the direction of the theoretical z axis the camera should point in
    var targetZAxis = Vector.getVectorAB(this.position,point);
    
    var currentZAxis = Vector.crossProduct(this.xAxis,this.yAxis);

    
    //need to rotate the current Z axis vector so that it aligns with the target Z axis vector
    //the axis of rotation is the current axis vector cross producted with the target Z axis unit vector
    //There is an ambiguous case when the two vectors are collinear.

    //case 1:
    //when collinear and same direction, done
    if (Vector.areCollinear(currentZAxis,targetZAxis)){
      if (Vector.sameDirection(currentZAxis, targetZAxis)){
        return;
      }
      else{
        //case 2:
        //when collinear and opposite directions, use camera y axis as axis of rotation
        Vector.rotate3d(currentZAxis, this.yAxis,Math.PI);
        return;
      }
    }
    
    //case 3: otherwise, the vectors are not collinear
    var angleToRotate = Math.acos(Vector.dotProduct(targetZAxis,currentZAxis)/(Vector.magnitude(targetZAxis)* Vector.magnitude(currentZAxis)));
    var targetZAxisCrossCurrentZAxis = Vector.crossProduct(targetZAxis,currentZAxis);
    var rotationAxis = Vector.getUnitVector(targetZAxisCrossCurrentZAxis);
    //rotate the camera position clockwise to the focus point
    Vector.rotate3d(this.position, rotationAxis, -angleToRotate);
    //also rotate the camera's x and y axes
    this.yAxis = Vector.rotate3d(this.yAxis, rotationAxis, -angleToRotate);
    this.xAxis = Vector.rotate3d(this.xAxis, rotationAxis, -angleToRotate);
  }
}