//add to the tail and take from the head
function FIFOQueue(){
  function QueueNode(data){
    this.data = data;
    this.next = null;
  }

  this.head = null;
  this.tail = null;


  //pass in the data you want to store in the queue
  //a node will be automatically created
  //element added to tail
  this.add = function (element){
    if (this.tail == null){
      this.tail = new QueueNode(element);
      this.head = this.tail;//assume that the only time tail is null is when head == tail
    }else{
      this.tail.next = new QueueNode(element);
      this.tail = this.tail.next;
    }
  }

  //element removed from head
  this.remove = function(){
    if (this.head == null){
      //do nothing
    }else{
      this.head = this.head.next;
    }
    if (this.head == null){
      this.tail = null
    }
  }
}
