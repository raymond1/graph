function AI(){
  this.search = function (terminalConditionReached, algorithm, state){
    if (terminalConditionReached(state)){
      return state;
    }
    else{
      this.search(terminalConditionReached, algorithm, algorithm(state));
    }
  }
}

var ai = new AI();

ai.search(){

}

ai.algorithm = function(){
  
}

a.condition = function(state){
  var vectorA = state.vector;
  var k = state.k;
  if (Vector.dotProduct(Vector.add(state.vector,Vector.scalarMultiply(k,state.vector))) == 0){
    return true;
  }
  else{
    return false;
  }
}

a.state = [vectorA,k];
a.search();