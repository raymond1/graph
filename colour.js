function Colour(){
}

//takes in a number from 0 to 255, and returns the corresponding gray colour
Colour.getNeutralString = function (grayNumber){
  var singleChannelString = grayNumber.toString(16) + "";
  if (singleChannelString.length < 2){
    singleChannelString = "0" + singleChannelString;
  }
  
  return "#" + singleChannelString + singleChannelString + singleChannelString;
}

Colour.maxColour = 255;
Colour.maxGrayNumber = 255;
Colour.numberOfGrays = 256;
