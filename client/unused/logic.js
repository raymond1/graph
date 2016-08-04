function Logic(){

}

//if condition is true, then run function A, otherwise, run function B
Logic.binaryCondition = function(condition,functionA,functionB){
  if (condition()){
    functionA();
  }
  else{
    functionB();
  }
}

//Does A, then B
Logic.doAThenB = function(functionA,functionB){
  functionA();
  functionB();
}

