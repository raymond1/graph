function MyMath(){
}

MyMath.min = function(a,b){
  if (a <= b){
    return a;
  }

  return b;
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

//numberList is an array
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


//comparison function is a function that takes two arguments, a and b, and returns 1 if a > b, 0 if a = b, -1 if a < b.
MyMath.genericMax = function(numberList, comparisonFunction){
  var maximum = numberList[0];
  for (var i = 0; i < numberList.length; i++){
    if (comparisonFunction(numberList[i],maximum) > 0){
      maximum = numberList[i];
    }
  }
  return maximum;
}

//Range is an integer range from lowerBound to upperBound, including lowerBound and upperBound
Range = function(lowerBound,upperBound){
  this.lower = lowerBound;
  this.upper = upperBound;
  this.size = function(){
    return upperBound - lowerBound + 1;
  }
}

