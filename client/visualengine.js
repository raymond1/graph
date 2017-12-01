function VisualEngine(){
  this.objectType = "Visual Engine";

  if (typeof Programming == 'undefined'){
    throw new Error("Missing programming.js")
  }

  //opens up a new window
  //if object is null, then a new window is opened up
  //if an object has been passed in, then the Visual Engine will be created within it.
  this.containerObject = null;

  this.open = function(){
    var newWindow;
    if (Programming.nothing(this.containerObject)){
      newWindow = open("window.html", "Visual Engine", "height=1000,width=1000,top=0,menubar=yes,toolbar=yes,scrollbars=1");
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



