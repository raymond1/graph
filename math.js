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

MyMath.max = function(numberList){
  var maximum = numberList[0];
  for (var i = 0; i < numberList.length; i++){
    if (numberList[i] > maximum){
      maximum = numberList[i];
    }
  }
  return maximum;
}

MyMath.getMax = MyMath.max;