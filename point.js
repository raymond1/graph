function Point(x,y,z,colour){
  this.x = x;
  this.y = y;
  this.z = z;
  this.colour = colour;
  this.objectType = "Point";
  this.toString = function(){
    var stringToReturn = "";
    stringToReturn = stringToReturn + "(x,y,z): (" + this.x + "," + this.y + "," + this.z  + ") colour:" + this.colour;
    return stringToReturn;
  }
}

