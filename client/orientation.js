function Orientation(xAxisVector, yAxisVector){
  this.xAxis = new Vector(xAxisVector.getX(), xAxisVector.getY(), xAxisVector.getZ())
  this.yAxis = new Vector(yAxisVector.getX(), yAxisVector.getY(), yAxisVector.getZ())
}

