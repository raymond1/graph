function Ordinates(){
  this.elements = [];
  for (var i = 0; i < arguments.length; i++){
    this.elements.push(arguments[i]);
  }
}

Ordinates.prototype.length = function(){
  return this.elements.length;
};

Ordinates.prototype.getX = function(){
  return this.elements[0];
};

Ordinates.prototype.getY = function(){
  return this.elements[1];
};

Ordinates.prototype.getZ = function(){
  return this.elements[2];
};


Ordinates.prototype.setX = function(value){
  this.elements[0] = value;
};

Ordinates.prototype.setY = function(value){
  this.elements[1] = value;
};

Ordinates.prototype.setZ = function(value){
  this.elements[2] = value;
};

Ordinates.prototype.push = function(element){
  this.elements.push(element);
}

Ordinates.prototype.contents = function(){
  var returnString = "(";
  for (var i in this.elements){
    returnString += this.elements[i] + ",";
  }
  returnString = returnString.substring(0, returnString.length - 1) + ")";
  return returnString;
}

Ordinates.prototype.content = Ordinates.prototype.contents;

Ordinates.prototype.getElement = function(i){
  return this.elements[i];
}
