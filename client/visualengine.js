function nothing(object){
  if (object == null||object == undefined) return true;
  else return false;
}

function VisualEngine(){

  //opens up a new window
  //if object is null, then a new window is opened up
  //if an object has been passed in, then the Visual Engine will be created within it.

  this.containerObject = null;


  this.open = function(){
    var newWindow;
    if (nothing(this.containerObject)){
      newWindow = open("window.html", "asdf", "height=1000,width=1000,top=0,menubar=yes,toolbar=yes");
      if (newWindow == null){
      }
      else{
        newWindow.focus();
      }
    }
    else{
      //assume a valid container element has been passed in.
    }
  } 
}



