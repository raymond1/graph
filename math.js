function MyMath(){
}

MyMath.square = function (a){
  return a * a;
}

MyMath.getRandomBit = function(){
  var randomBit=Math.floor(Math.random()*2);
}


//computer stuff
MyMath.convertDecimalNumberToHexadecimalString = function(decimalNumber){
  return decimalNumber.toString(16);
}