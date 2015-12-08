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

  //id is the containing element id of the element where the open button will be generated.
  this.generateOpenButton = function (id){

    var parentElement = document.getElementById(id);
    var visualEngine = this;
    var generateOpenButton2 = function(){
      var onClick = function(){
        this.open();
      }
      var boundOnClick = onClick.bind(visualEngine);

      var parentElement2 = document.getElementById(id);
      var openButton = document.createElement('button');
      var openButtonText = document.createTextNode('Open Visual Engine');
      openButton.appendChild(openButtonText);
    
      if (openButton.addEventListener) {
        openButton.addEventListener("click", boundOnClick, false);
      } else {
        openButton.attachEvent('onclick', boundOnClick);
      }

      parentElement2.appendChild(openButton);
    }

    //if no parent element has been detected, it may be because the script is placed in the head, and the element it is supposed to be attached to doesn't exist yet
    //In this case, the visual engine waits for the rest of the code to finish loading before loading itself. As it does so, care is taken to not override any functions which a user may have put into
    //the onload function.
    if (parentElement == null|| parentElement == undefined){
      var oldOnload = window.onload;
      window.onload = function(){
        var innerOldOnLoad = oldOnload;
        if (!nothing(innerOldOnLoad)){
          innerOldOnLoad();
        }
        generateOpenButton2();
      }
    }
    else{
      generateOpenButton2();
    }
  }
}



