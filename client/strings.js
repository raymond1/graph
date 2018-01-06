//For string functions
function Strings(){}


Strings.whitespace_characters = ' \n\t'

Strings.is_whitespace = function(character){
  if (Strings.whitespace_characters.indexOf(character) >= 0){
    return true
  }
  return false
}

//Returns true if the string contains a non-whitespace character
//returns false otherwise
Strings.contains_non_whitespace_character = function(input_string){
  for (var i = 0; i < input_string.length; i++){
    if (Strings.whitespace_characters.indexOf(input_string.charAt(i)) == -1){
      //if a non-whitespace character was found
      return true
    }
  }
  return false
}

//returns true if there are no characters preceding index in input_string, or if every character before index is a whitespace character
Strings.index_preceded_by_whitespace = function(input_string, index){
  for (var i = 0; i < index; i++){
console.log('input_string:' + input_string + 'character:|' + input_string.charAt(i) + "|")
    if (!Strings.is_whitespace(input_string.charAt(i))){
      return false
    }
  }

  return true
}

//Returns {'error': true/false, 'longest string': string}
//Assume that there is at least one string
Strings.get_longest_string = function(array_of_strings){
  if (array_of_strings.length == 0){
    return {'error': true}
  }

  var longest_string = array_of_strings[0]
  for (var i = 0; i < array_of_strings.length; i++){
    if (array_of_strings[i].length > longest_string.length){
      longest_string = array_of_strings[i]
    }
  }

  return {'error': false, 'longest string': longest_string}
}


