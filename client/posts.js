function Posts(attachmentPoint){
  this.areas = [];

  if (!(attachmentPoint == null || attachmentPoint == undefined)){
    this.attachmentPoint = attachmentPoint;
  } else{
    this.attachmentPoint = null;
  }

  this.disableMessages = false;
  this.attachmentPoint = attachmentPoint;
  
  function getUniqueIDMaker(){
    var usedIDs = [];
    function innerFunction(){
      var randomString = "";

      function inArray(value,array){
        for (var i = 0; i < array.length; i++){
          if (array[i] == value) return true;
        }
        return false;
      }
      
      while (inArray(randomString,usedIDs)){
        var randomNumber = Math.floor(Math.random()*2);
        randomString = randomString + randomNumber;
      }
      usedIDs.push(randomString);
      return randomString;
    }
    return innerFunction;
  }
  this.getUniqueID = getUniqueIDMaker();
  
  //_ is a protected area name
  //value is the value you want printed in the sticky area
  //areaName is the name of the sticky area
  //this function will clobber whatever else is in the area
  this.stickyMessage = function(value, areaName){
    if (this.disableMessages) return;
    if (areaName == null){
      areaName = "_";
    }
    
    if (this.areas[areaName] == null){
      this.generateArea(areaName);
    }
    this.areas[areaName].innerHTML = value + "<br><br>\n";
  }
  
  this.attach = function(element){
    this.attachmentPoint = element;
  }
  
  function createArea(){
  }

  //area is a string which is the name of the debug area to which the message will be appended
  //message is a string message
  this.message = function (message, area){
    //create an area to write messages if none exist
    if (this.areas.length == 0){
      this.generateArea();
    }
    if (this.areas[area] == null){
      this.generateArea(area);
    }

    if (!this.disableMessages){
      if (area == null|| area == undefined){
        this.areas[""].innerHTML += "<br><br>\n\n" + message;
      }
      else{
        this.areas[area].innerHTML += "<br><br>\n\n" + message;
      }
    }
  }

  //areaName is optional
  this.generateArea = function (areaName){
    if (areaName == null || areaName == undefined){
      areaName = "";
    }

    //area with that name already exists
    if (this.areas[areaName] != null){
      return;
    }
    
    var area = document.createElement('div');
    var uniqueNumber = this.getUniqueID();
    area.setAttribute('id','debug' + uniqueNumber);
    
    this.attachmentPoint.parentNode.insertBefore(area, this.attachmentPoint.nextSibling);
    
    area.setAttribute('style', 'color: #000000; background: #ffffff; float: left; display: block; clear: both;');
    
    
    this.areas[areaName] = area;
  }

  function Area(name){
    this.keyValuePairs = [];
  }
  
}

