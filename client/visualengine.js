
//There is only one end user facing function: this.addCommandToQueue
//addCommandToQueue takes only certain strings as commands:
//Current commands:
//open
//generateOpenButton <--best tested

//this.addCommandToQueue
//this.addCommandToQueue('open') starts the visual engine
//this.addCommandToQueue('generateOpenButton');
//this.addCommandToQueue('addArguments', command, array of arguments);


function VisualEngine(){
  this.objectType = "Visual Engine";

  var commandList = ['open', 'generateOpenButton'];
  var commandProcessor = function(){
    for (var i = 0; i < this.commandQueue.queue.length; i++){
      var currentCommand = this.commandQueue.queue[i];
      switch(currentCommand.commandString){
        case 'open':
          break;
        case 'generateOpenButton':
          var idOfContainer = currentCommand.arguments[0];
          this.generateOpenButton(idOfContainer);
          break;
        default:
          break;
      }
    }
  };

  Programming.addCommandQueueCapability(this, commandList, commandProcessor);


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

  //id is the containing element id of the element where the open button will be generated.
  this.generateOpenButton = function (id){
    var parentElement = document.getElementById(id);
    
    var onClick = function(){
      this.open();
    }
    var boundOnClick = onClick.bind(this);

    var openButton = document.createElement('button');
    var openButtonText = document.createTextNode('Open Visual Engine');
    openButton.appendChild(openButtonText);
    
    if (openButton.addEventListener) {
      openButton.addEventListener("click", boundOnClick, false);
    } else {
      openButton.attachEvent('onclick', boundOnClick);
    }

    parentElement.appendChild(openButton);
  }
}



