function Vector(){
  this.elements = [];
  for (var i = 0; i < arguments.length; i++){
    this.elements.push(arguments[i]);
  }
  this.getX = function(){
    return this.elements[0];
  }
  
  this.getY = function(){
    return this.elements[1];
  }

  this.getZ = function(){
    return this.elements[2];
  }

  this.setX = function(value){
    this.elements[0] = value;
  }
  
  this.setY = function(value){
    this.elements[1] = value;
  }

  this.setZ = function(value){
    this.elements[2] = value;
  }

  this.push = function(element){
    this.elements.push(element);
  }

  this.contents = function(){
    var returnString = "(";
    for (var i in this.elements){
      returnString += this.elements[i] + ",";
    }
    returnString = returnString.substring(0, returnString.length - 1) + ")";
    return returnString;
  }
  
  //if two vectors are the same, then this function returns true.
  this.sameAs = function(vector){
    return Vector.equal(this, vector);
  }
  //alias
  this.content = this.contents;


  this.length = function(){
    return this.elements.length;
  }
  
  
  this.getElement = function(i){
    return this.elements[i];
  }
}



Vector.equal = function(A,B){
  if (A.length() != B.length()) return false;
    
  for (var i in A.elements){
    if (A.getElement(i) != B.getElement(i)) return false;
  }
    
  return true;
}

Vector.add = function (vector1, vector2){
  var newVector = new Vector();
  for (var i = 0; i < vector1.length(); i++){
    newVector.push(vector1.getElement(i) + vector2.getElement(i));
  }

  return newVector;
}

Vector.dotProduct = function(a,b){
  var maxLength = a.length();
  if (b.length() > maxLength) maxLength = b.length();
  
  var sum = 0;
  for (var i = 0; i < maxLength; i++){
    sum += b.getElement(i) * a.getElement(i);
  }
  return sum;
}

//Takes in a vector a, and returns a vector b with the same dimensions as a, but with a different scale such that the magnitude of b is 1
Vector.getUnitVector = function(a){
  var b = new Vector();
  var _magnitude = Vector.magnitude(a);
  for (var i = 0; i < a.length(); i++){
    b.push(a.getElement(i)/_magnitude);
  }
  
  return b;
}


//calculates the projection of vector 1 on vector 2
Vector.projection = function(vector1, vector2){
  var _magnitude = Vector.dotProduct(vector1,vector2) / Vector.magnitude(vector2);
  var direction = Vector.getUnitVector(vector2);
  
  var returnVector = new Vector();
  for (var i = 0; i < vector2.length(); i++){
    returnVector.push(_magnitude * direction.getElement(i));
  }
  
  return returnVector;
}

Vector.magnitude = function(_vector){
  var sum = 0;
  for (var i = 0; i < _vector.length(); i++){
    sum += MyMath.square(_vector.getElement(i));
  }
  var returnValue = Math.sqrt(sum);
  return returnValue;
}

//angle is in radians
Vector.rotate2d = function(vector, angle){
  var newX = vector.getX() * Math.cos(angle) - vector.getY() * Math.sin(angle);
  var newY = vector.getX() * Math.sin(angle) + vector.getY() * Math.cos(angle);
  var returnVector = new Vector(newX, newY);
  return returnVector;
}

Vector.createCopy = function(vector){
  var vectorToReturn = new Vector();
  for (var i = 0; i < vector.length(); i++){
    vectorToReturn.push(vector.getElement[i]);
  }
  
  return vectorToReturn;
}


//let A and B be vectors
//assume they have the same size
//return the vector B - A
Vector.subtractFirstFromSecond = function(A,B){
  if (A.length() != B.length()){
    //error
  }
  
  var result = new Vector();
      
  for (var i = 0; i < A.length(); i++){
    result.push(B.getElement(i) - A.getElement(i));
  }
  return result;
}

//returns the vector AB that goes from the tip of vector A to the tip of vector B.
Vector.getVectorAB = Vector.subtractFirstFromSecond;

Vector.subtractSecondFromFirst = function(A,B){
  if (A.length() != B.length()){
    //error
  }
  
  var result = new Vector();
      
  for (var i = 0; i < A.length(); i++){
    result.push(A.getElement(i) - B.getElement(i));
  }
  return result;
}

Vector.subtract = Vector.subtractSecondFromFirst;

//returns a vector that is perpendicular to the one that is passed in.
Vector.getArbitraryPerpendicularVector = function (vector){
  //go through all of the dimensions of the input vector
  //Two cases:
  //1)If there is only one nonzero direction in the input vector
  //2)If there is more than one nonzero direction in the input vector
  
  //rule: not all elements of the perpendicular vector can be 0
  //the dotproduct of the two vectors must be 0
  var numberOfNonZeroElements = Vector.getNumberOfNonZeroElements(vector);
  var newVector = new Vector;
  if (numberOfNonZeroElements == 1){
    //if you match up all of the elements from the input with the elements in the output,
    //(a,b,c,0,e,0,g) --input vector
    //(t,u,v,w,x,y,z) --output vector
    
    //a perpendicular output vector would be setting all the 0 elements to 1 and the nonzero elements to 0
    for (var i in vector.elements){
      if (vector.elements[i] == 0){
        newVector.push(1);
      }
      else{
        newVector.push(0);
      }
    }
  }
  else if (numberOfNonZeroElements > 1){
    var firstNonZeroElementFound = false;
    var secondNonZeroElementFound = false;
    for (var i in vector.elements){
      if (vector.elements[i] == 0) newVector.push(1);
      else{
        if (firstNonZeroElementFound == false){
          newVector.push((1.0/vector.elements[i]));
          firstNonZeroElementFound = true;
        }
        else{
          if (secondNonZeroElementFound == false){
            newVector.push((-1.0/vector.elements[i]));
            secondNonZeroElementFound = true;
          }
          else{
            newVector.push(0);
          }
        }
      }
    }
  }
  return newVector;
}

Vector.getNegativeVector = function(vector){
}

Vector.getNumberOfNonZeroElements = function (vector){
  var count = 0;
  for (var i in vector.elements){
    if (vector.elements[i] != 0) count += 1;
  }
  return count;
}

Vector.crossProduct = function (vector1,vector2){
  var newVector = new Vector;
  var a = vector1.getX();
  var b = vector1.getY();
  var c = vector1.getZ();
  var d = vector2.getX();
  var e = vector2.getY();
  var f = vector2.getZ();
  
  newVector.push(b * f - c * e);
  newVector.push(c * d - a * f);
  newVector.push(a * e - b * d);
  return newVector;
}

Vector.getNegativeVector = function (vector){
  var newVector = new Vector;
  for (var i = 0; i < vector.elements.length; i++){
    newVector.push(-vector.getElement(i));
  }
  return newVector;
}


//vector is a point in 3-space that needs to be rotated
//normal is the axis of rotation centred on the origin
//angle is the angle, in radians that the point will be rotated

//C is the name of the normal vector of the axis of rotation
//A is the name of an arbitrary vector generated to be perpendicular to C
//B is C cross A
  
//D is the X axis unit vector
//E is the Y axis unit vector
//F is the Z axis unit vector
Vector.rotate3dAroundOrigin = function(vector, normal, angle){
  //1) Create 2 arbitrary vectors perpendicular to the normal that is passed in, and also perpendicular to each other.
  //Normal cross A = B
  var unnormalizedA;
  unnormalizedA = Vector.getArbitraryPerpendicularVector(normal); //arbitrary vector in original coordinate system--corresponds to x
  
  var unnormalizedB = Vector.crossProduct(normal,unnormalizedA); //corresponds to y
  var unnormalizedC = normal; //normal vector in original coordinate system
  //2) Turn the normal and the two arbitrary vectors all into unit vectors. This is your new coordinate system in terms of the old coordinate system
  var A = Vector.getUnitVector(unnormalizedA);
  var B = Vector.getUnitVector(unnormalizedB);
  var C = Vector.getUnitVector(unnormalizedC);
  
  A = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(C, A);
  B = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(A, B);
  C = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(B, C);
  A = Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2(C, A);

  //3) Find the vector to be rotated in terms of the new coordinate system.
  var rotationCoordinateSystem = new CoordinateSystem;
  rotationCoordinateSystem.addAxis(A);
  rotationCoordinateSystem.addAxis(B);
  rotationCoordinateSystem.addAxis(C);
  
  var vectorInRotationCoordinateSystem  = rotationCoordinateSystem.getVector(vector);
  //4) Keeping the component of the vector to be rotated(called A from here on) in the direction of the normal the same, calculate the new components in the direction of the two arbitrary vectors after rotation.
  var _2dVector = new Vector(vectorInRotationCoordinateSystem.getX(), vectorInRotationCoordinateSystem.getY());
  var rotated_2dVector = Vector.rotate2d(_2dVector, angle);
  
  var rotatedVectorInRotationSpace = new Vector(rotated_2dVector.getX(), rotated_2dVector.getY(), vectorInRotationCoordinateSystem.getZ());


  //5) Find the rotated vector in terms of the original coordinate system.  
  var D = new Vector(1,0,0); //x axis in original coordinate system
  var E = new Vector(0,1,0); //y axis in original coordinate system
  var F = new Vector(0,0,1); //z axis in original coordinate system

  var G = rotationCoordinateSystem.getVector(D);
  var H = rotationCoordinateSystem.getVector(E);
  var I = rotationCoordinateSystem.getVector(F);

  var normalCoordinateSystemInTermsOfRotationCoordinateSystem = new CoordinateSystem;
  normalCoordinateSystemInTermsOfRotationCoordinateSystem.addAxis(G);
  normalCoordinateSystemInTermsOfRotationCoordinateSystem.addAxis(H);
  normalCoordinateSystemInTermsOfRotationCoordinateSystem.addAxis(I);

  var vectorToReturn = normalCoordinateSystemInTermsOfRotationCoordinateSystem.getVector(rotatedVectorInRotationSpace);
  
  return vectorToReturn;
}

Vector.rotate3d = Vector.rotate3dAroundOrigin;

Vector.getComponent = function (A,B){
  var magnitude = Vector.magnitude(Vector.projection(A,B));
  if (Vector.inOppositeDirections(A,B)){
    return -magnitude;
  }
  else{
    return magnitude;
  }
}


Vector.inSameDirections = function (A,B){
  if (Vector.dotProduct(A,B) > 0){
    return true;
  }
  else return false;
}

Vector.sameDirection = Vector.inSameDirections;

Vector.inOppositeDirections = function (A,B){
  if (Vector.dotProduct(A,B) < 0){
    return true;
  }
  else return false;
}

Vector.perpendicular = function (A,B){
  if (Vector.dotProduct(A,B) == 0){
    return true;
  }
  
  return false;
}

//this value returns a unit vector that is close to vector2, and is on the same plane as vector1,vector2 plane
Vector.makeUnitVectorPerpendicularToVector1AndCloseToVector2 = function(vector1, vector2){
  var vectorToReturn;
  if(Vector.inSameDirections(vector1,vector2)){
    //find a k for which vector1.(vector2 -k* vector1) = 0
    //k = (vector1.vector2)/(vector1.vector1)
    var k = Vector.dotProduct(vector1,vector2)/Vector.dotProduct(vector1,vector1);
    vectorToReturn = Vector.add(vector2,Vector.scalarMultiply(-k,vector1));
  }
  else{
    //find a k for which vector1.(vector2 + k * vector1) = 0/vector
    var k = -Vector.dotProduct(vector1,vector2)/Vector.dotProduct(vector1,vector1);
    vectorToReturn = Vector.add(vector2,Vector.scalarMultiply(k,vector1));
  }
  return Vector.getUnitVector(vectorToReturn);
}


Vector.scalarMultiply = function(scalar, vector){
  var newVector = new Vector;
  for (var i = 0; i < vector.elements.length; i++){
    newVector.push(vector.elements[i] * scalar);
  }
  return newVector;
}

Vector.copy = function(vector){
  var newVector = new Vector();
  for (var i = 0; i < vector.elements.length; i++){
    newVector.push(vector.elements[i]);
  }
  return newVector;
}

Vector.angleBetween = function(vector1,vector2){
  return Math.acos(Vector.dotProduct(vector1,vector2)/(Vector.magnitude(vector1)*Vector.magnitude(vector2)));
}

//assumes vector1 and vector2 have the same length
Vector.distance = function(vector1,vector2){
  var difference = Vector.subtractFirstFromSecond(vector1,vector2);
  var magnitude = Vector.magnitude(difference);
  
  return magnitude;
}

//returns the furthest point from the reference point
Vector.getFurthestPoint = function(referencePoint, datapoints){
  //default datapoint to return is the 0th datapoint
  var datapointToReturn = datapoints[0];

  for (var i = 0; i < datapoints.length; i++){
    var distanceFromReferencePointToDatapointToReturn = Vector.distance(datapointToReturn, referencePoint);
    if (Vector.distance(referencePoint, datapoints[i]) > distanceFromReferencePointToDatapointToReturn){
      datapointToReturn = datapoints[i];
    }
  }
  
  return datapointToReturn;
}

//returns true if A and B are collinear
Vector.areCollinear = function(A,B){
  //Turn them both into unit vectors. If they are the same, or if they are flips of one another, then the two vectors are collinear
  var unitA = Vector.getUnitVector(A);
  var unitB = Vector.getUnitVector(B);
  
  if (Vector.equal(unitA,unitB)||Vector.equal(unitA, Vector.getNegativeVector(B))){
    return true;
  }
  return false;
}