//For string functions
function Strings(){}

//Takes in a list of strings(array_of_needles), matches them one by one with the string haystack starting at offset index
//Finds the longest match, or returns 'match found' as false if no match was found
Strings.get_longest_matching_string_at_index = function(array_of_needles, haystack, index){
  var matched_needles = []
  var j = 0
  for (var i = 0; i < array_of_needles.length; i++){
    if (haystack.indexOf(array_of_needles[i] == index)){
      matched_needles[j] = array_of_needles[i]
      j++
    }
  }
  if (j == 0){
    //no matches
    return {'match found': false}
  }

  var longest_match = Strings.get_longest_string(matched_needles)['longest string']

  return {'match found': true, 'longest match': longest_match}
}

Strings.is_alphabetical = function(input_string){
  if (Strings.contains_only(input_string, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')){
    return true
  }
  return false
}

//Goes through the list of needles, and searches for their position in haystack.
//Returns the earliest needle position, if any
//If found, returns found as true, and the location
//If none found, returns found as false, and the location is -1
//{'found': true/false, 'location': location found}
Strings.find_earliest_matching_string_index = function(haystack, list_of_needles){

  //assumes there is at least one needle
  var found_index = -1
  var matching_string = list_of_needles[0]
  var found = false
  var number_of_matches = 0;

  var matches = []
  for (var i = 0; i < list_of_needles.length; i++){
    var index_of_needle = haystack.indexOf(list_of_needles[i])

    if (found == false){
      if (index_of_needle > 0){
        found = true
        found_index = index_of_needle
      }
    }
    else{
      if (index_of_needle < found_index){
        found_index = index_of_needle
      }
    }
  }

  return {'found': found, 'location': found_index}
}


Strings.whitespace_characters = ' \n\t'

Strings.is_whitespace = function(input_string){
  for (var i = 0; i < input_string.length; i++){
    if (!(Strings.whitespace_characters.indexOf(input_string.charAt(i)) >= 0)){
      return false
    }
  }
  return true
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

//Returns true if input_string consists only of characters from the allowed_characters string
Strings.contains_only = function(input_string, allowed_characters){
  for (var i = 0; i < input_string.length; i++){
    if (allowed_characters.indexOf(input_string.charAt(i)) < 0){
      return false
    }
  }
  return true
}

//Counts the number of occurrences of character in input_string
Strings.count_occurrences = function(input_string, character){
  var count = 0

  for (var i = 0; i < input_string.length; i++){
    var current_character = input_string.charAt(i)
    if (current_character == character) count++
  }

  return count
}

//Returns the longest substring starting at index 0 of input_string whose characters belong to character_list
//For example, if input_string is 'test', and character list is 'et', then the string 'te' is returned because
//the first two letters of test are found within the character list
Strings.swallow = function(input_string, character_list){
  let i = 0;
  let returnString = ''
  for (i = 1; i < input_string.length + 1; i++){
    let tempString = input_string.substring(0, i)
    if (Strings.contains_only(tempString, character_list)){
      returnString = tempString
    }
  }
  return returnString
}