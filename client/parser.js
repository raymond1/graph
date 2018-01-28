function ConstructTable(construct_table){
  this.construct_table = construct_table

  this.get_construct_information_from_construct_name = function(construct_name){
    for (var i = 0; i < this.construct_table.length; i++){
      if (this.construct_table[i]['construct'] == construct_name){
        return this.construct_table[i]
      }
    }
  }

  this.get_allowed_children = function(construct_name){
    for (var i = 0; i < this.construct_table.length; i++){
      if (this.construct_table[i]['construct'] == construct_name){
        return this.construct_table[i]['allowed children']
      }
    }
    return []
  }

  this.get_beginning_string_from_construct_name = function(construct_name){
    for (var i = 0; i < this.construct_table.length; i++){
      if (this.construct_table[i]['construct'] == construct_name){
        return {'found': true, 'beginning string': this.construct_table[i]['beginning string']}
      }
    }
    return {'found': false}
  }

  //given a construct name, returns whether or not children are allowed for that construct
  this.get_children_allowed = function(construct_name){
    for (var i = 0; i < this.construct_table.length; i++){
      if (this.construct_table[i]['construct'] == construct_name){
        return this.construct_table[i]['may have children']
      }
    }
  }

  this.get_construct_information_from_beginning_string = function(beginning_string){
    for (var i = 0; i < this.construct_table.length; i++){
      if (this.construct_table[i]['beginning string'] == beginning_string){
        return this.construct_table[i]
      }
    }
  }
}

//Properties: id, children, type
//methods: get_valid_beginning_strings
function Node(type){
  this.type = type
  this.children = []
}

function Parser(input_grammar){
  this.input_grammar = input_grammar

  //Takes in a list of strings(array_of_needles), matches them one by one with the string haystack starting at offset index
  //Finds the longest match, or returns 'match found' as false if no match was found
  this.get_longest_matching_string_at_index = function(array_of_needles, haystack, index){
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

  //Goes through the list of needles, and searches for their position in haystack.
  //Returns the earliest needle position, if any
  //If found, returns found as true, and the location
  //If none found, returns found as false, and the location is -1
  //{'found': true/false, 'location': location found}
  this.find_earliest_matching_string_index = function(haystack, list_of_needles){
  
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

  //returns A) Whether or not a valid construct was found
  //B)If a valid contsruct was found, its name, location, including beginning and end
  //{'found': true/false, 'construct name': 'asdfdsf', 'location': {'beginning': a, 'end': b}}
  //beginning and end locations are relative to the string passed in
  this.process_first_construct = function(input_string, parent_node, construct_table){
    //list all valid beginning strings of parent_node
    var valid_beginning_strings = parent_node.get_valid_beginning_strings()
    
    //find earliest match
    var info = this.find_earliest_matching_string_index(input_string, valid_beginning_strings)
    if (info['found'] == false){
      return {'found': false}
    }
  
    var earliest_matching_beginning_string_index = info['location']
  
    //make sure that if there was more than one match, that the longer match is used
    info = this.get_longest_matching_string_at_index(valid_beginning_strings, input_string, earliest_matching_beginning_string_index)
    var beginning_string = info['longest match']
  
    //ensure that the matching string was preceded by whitespace
    if (!Strings.index_preceded_by_whitespace(input_string, earliest_matching_beginning_string_index)){
      return {'found': false}
    }
  
    //If execution reaches here, then there is a valid beginning string
    //Is there a valid end string?
    //Start from the index after where the valid beginning string is found, and determine if a valid end string exists
    var info = construct_table.get_construct_information_from_beginning_string(beginning_string)
    var construct_name = info['construct']

    info = construct_table.get_construct_information_from_construct_name(construct_name)
    var end_string = info['end string']
  
    var one_after_index_of_last_character_of_beginning_string = earliest_matching_beginning_string_index + beginning_string.length
    var contents_after_beginning_string = input_string.substring(one_after_index_of_last_character_of_beginning_string)
    var end_string_location_relative_to_contents_after_beginning_string = contents_after_beginning_string.indexOf(end_string)
  
    var end_string_location = end_string_location_relative_to_contents_after_beginning_string + earliest_matching_beginning_string_index + info['beginning string'].length
    if (end_string_location_relative_to_contents_after_beginning_string > -1){
      //valid end string detected
      return {'found': true, 'construct name': construct_name, 'location': {'beginning': earliest_matching_beginning_string_index, 'end': end_string_location + end_string.length}}
    }
    else{
      return {'found': false}
    }
  }


  //given a string, reads the first token, interprets it as a construct and parses it
  //returns {'valid construct parsed': false} or
  //{'valid construct parsed': true, 'index to continue parsing'}
  this.parse_one_construct_if_available = function(input_string, parent_node, construct_table){

    //construct_information contains information about the single construct which was parsed
    var construct_information = this.process_first_construct(input_string, parent_node, construct_table)
    if (construct_information['found'] == false){
      //Do nothing. Parent node remains unchanged
      return {'valid construct parsed': false}
    }else{
      //Create a new node named A
      //If A can have children, then continue parsing the children of A
      //Add A to the parent node

      var construct_name = construct_information['construct name']
console.log('Construct detected:' + construct_name)
      var info = construct_table.get_construct_information_from_construct_name(construct_name)
      var new_node = new Node(construct_table, construct_name, this.get_unique_id())
      if (construct_table.get_children_allowed(construct_name)){
        var beginning_string = info['beginning string']
        var string_between_the_beginning_and_end_strings = input_string.substring(construct_information['location']['beginning'] + beginning_string.length, construct_information['location']['end'] - info['end string'].length)
        this.recursive_parse(string_between_the_beginning_and_end_strings, new_node, construct_table)
      }
      parent_node.children.push(new_node)
      return {'valid construct parsed': true, 'index to continue parsing': construct_information['location']['end'] + 1}
    }
  }

  this.recursive_parse = function (input_string, parent_node){
    var info = this.parse_one_construct_if_available(input_string, parent_node, construct_table)

    //if there was no valid construct, then parsing is done
    if (info['valid construct parsed'] == false) return

    //if there was a valid construct, go to the end of the construct and continue parsing
    this.recursive_parse(input_string.substring(info['index to continue parsing']), parent_node, construct_table)
  }



  this.get_unique_id = Programming.getUniqueIDMaker()
  //parses a string representing a scene, and generates a structure in memory representing the abstract meaning

  this.find_root_construct = function(){
    for (var i = 0; i < this.construct_table.length; i++){
      if (this.construct_table[i]['root'] == true){
        return this.construct_table[i]
      }
    }
  }

  //parses many or 0 constructs
  //What counts as 0 constructs?
  //Returns the parsed constructs, and the remaining string which is unparsed...
  this.parse_0_or_more = function(input_string, construct_type){
    //If there are 0 constructs
  }

  //construct is a row in the construct table
  //{'construct': 'root', 'pattern type': 'composed of', pattern: {'set scene': '0 or more'}, 'may have children': true, 'allowed children': ['set scene'], 'root': true},
  this.parse_composed_of_pattern(input_string, construct){
    var parsed_results = []
    var pattern_keys = Object.keys(construct['pattern'])

    //Each set of requirements needs to be met for the pattern to succeed
    for (var i = 0; i < pattern_keys.length; i++){
      parsed_results[i] = parse_type
    }

    //parse as A, parse as B, parse as C, parse as D.
  }

  this.parse_start_and_finish_pattern(input_string, construt){
  }

  this.parse_3_tuple_pattern(input_string, construct){
  }

  //Takes in a construct row(see window.html), and returns an abstract syntax tree
  this.parse_construct = function(input_string, construct){
    if (construct['pattern type'] == 'composed of'){
      return this.parse_composed_of_pattern(input_string, construct)
    }else if(construct['pattern type'] == 'start and finish'){
      return this.parse_start_and_finish_pattern(input_string, construct)
    }
    else if (construct['pattern type'] == '3-tuple'){
      return this.parse_3_tuple_pattern(input_string, construct)
    }else{
      return null
    }
  }

  //parse the top level construct
  this.parse_top_level_construct = function(input_string){
    var root_construct = this.find_root_construct()
    return this.parse_construct(input_string, root_construct)
  }

  this.grammarize_sequence = function(sequence){
    //
  }

  this.grammarize_PATTERN_NAME = function(){
  }

  //argument 0 is the input grammar
  //argument 1 is a string that will be matched against the input grammar

  //A PATTERN is a comma-separated list of unquoted strings(PATTERN NAME), quoted strings(STRING), a SEQUENCE, an OR
  //Examples:
  //['_CONSTRUCT_', '_CONSTRUCT, CONSTRUCT_LIST' passed in]
  this.grammarize_PATTERN = function(){
    var grammar_string = arguments[0]
    var match_string = arguments[1]

    var QUOTED_STRING_node = grammarize_QUOTED_STRING(grammar_string)
    if (QUOTED_STRING_node != null){
      return QUOTED_STRING_node
    }

    var PATTERN_NAME_node = grammarize_PATTERN_NAME(grammar_string)
    if (PATTERN_NAME_node != null){
      return PATTERN_NAME_node
    }

    var SEQUENCE_node = grammarize_SEQUENCE(grammar_string)
    if (SEQUENCE_node != null){
      return SEQUENCE_node
    }

    var OR_node = grammarize_OR(grammar_string)
    if (OR_node != null){
      return OR_node
    }

    return null
  }

  //argument 0 is a string containing a grammar
  //Subsequent arguments are what rules are used to interpret the grammar string
  //Returns null if the grammar specification does not match any of the pattern arguments passed in
  //Returns a set of nodes if there is a match
  this.grammarize_OR = function(){
    var grammar_string arguments[0]
    var return_nodes = null
    for (var i = 1; i < arguments.length; i++){
      //each argument is a comma-separated list of patterns
      //a PATTERN is
      //UNQUOTED_STRING
      //QUOTED STRING
      return_nodes = this.grammarize_PATTERN(grammar_string, arguments[i])//for each string not in quotes, treat as a construct
      if (return_nodes != null){
        return return_nodes
      }
    }
    return null
  }

  //Assuming grammar is a construct list, break it down into different grammars
  this.grammarize_CONSTRUCT_LIST = function(grammar_specification){
    child_nodes = grammarize_OR(
      grammar_specification, '_CONSTRUCT_', 
      '_CONSTRUCT_,\',\'CONSTRUCT_LIST')
    )

    if (child_nodes == null){
      return null
    }

    var return_node = new Node('construct list')
    return_node.child_nodes.append(child_nodes)
  }

  //Takes in a string representation of a grammar, and converts it to an in-memory representation of the grammar in tree form
  this.grammarize = function(grammar){
    return this.grammarize_CONSTRUCT_LIST(grammar)
  }

  //1)Takes the input grammar and generates rules from them
  //2)Now that the rules have been loaded into memory, takes in a string and returns an abstract syntax tree
  this.parse = function (input_string){
    //Based off of the grammar, get a list of constructs
    this.grammarize(this.input_grammar)
    return this.parse_construct(input_string, 'TOP_LEVEL_CONSTRUCT')
  }
}

/*

//Types of parsing allowed by this parser:
//1)Is one of [pattern 1, pattern 2, pattern 3....]  //This is the OR pattern
//1.1)pattern 1 can be another pattern, or a single character
//Example Is one of [a,b,c,d,e,f...]
//2)multiple consecutive hits of a pattern
//SEQUENCE [pattern 1, pattern 2, pattern 3]  //This is the order pattern
//3)And [pattern 1, pattern 2]...//An interesting thought, is AND optional? Is it possible to have just OR or AND, plus order, but not both at the same time?
//4)Complement(not)NOT [pattern 1]

//5)WHITESPACE BUFFER [pattern 1] //Ensures that [
//6)ONE-OR-MORE[pattern 1] //Accepts more than a single pattern 1

//7)TEXT_EMPTY = WHITESPACE ONLY = [


//5)Length???Length [binary/Decimal] Probably not..., but what exactly is a length?...

//fits

//Extract
//'whitespace' = ONE OF [' ', '	', '
']

//
//'begin scene literal' = SEQUENCE ['b','e','g','i','n',' ','s','c','e','n','e', PATTERN 'asdabasdf']
//'end set scene literal' = SEQUENCE['e','n','d',' ', PATTERN 'set scene literal']
//'set scene' = SEQUENCE [PATTERN 'begin scene literal', PATTERN 'scene contents', PATTERN 'end scene literal']

//'scene contents' = [PATTERN 'points']
//'points' = MULTIPLE [PATTERN 'point']
//'point' = [PATTERN ']
//'whitespace separated items' = [PATTERN '



//OPTIONAL WS
//begin scene
//scene contents
//end scene
//Mandatory WS
//begin scene
//scene contents
//end scene
//OPTIONAL WS

//begin scene
//  begin point
//    0,3,4
//  end point
//end scene


//TOP LEVEL CONSTRUCT CAN BE
//[WS
//OR
//WS SCENE
//WS SCENE WS
//SCENE WS]
//OR
//[SCENE LIST]
//[WS SCENE LIST]
//[SCENE LIST WS]


//ALL ARE CONSIDERED WS_PROTECTED_SCENE

//SCENE LIST CAN BE
//WESCENE

//SCENE LIST =
//WS_PROTECTED(SCENE)
//OR LEFT_WS_PROTECTED(SCENE) MULTIPLE [WS SCENE]
//OR 


TOP LEVEL CONSTRUCT = OR[
SCENE_LIST,
SEQUENCE[WS SCENE_LIST],
SEQUENCE[SCENE_LIST WS],
WS
]

SCENE_LIST = OR[
SCENE,
SEQUENCE [SCENE, WS, SCENE_LIST]
]

SCENE = SEQUENCE['begin scene',WS,POINTS_LIST,WS,'end scene']

POINTS_LIST = OR[
POINT,
'point',
WS,POINTS_LIST]

POINT = SEQUENCE[NUMBER,',',NUMBER,',',NUMBER]

NUMBER = OR
[
_NUMBER,
_NUMBER NUMBER
]

_NUMBER = OR['0','1','2','3','4','5','6','7','8','9']


PATTERN EMPTY = (built-in)
WS = (built-in)

------------------------------
Grammar for the parser is:

CONSTRUCT_LIST = OR[
CONSTRUCT,
SEQUENCE[CONSTRUCT,',',CONSTRUCT_LIST]
]

CONSTRUCT = OR[
OR_CONSTRUCT,
SEQUENCE_CONSTRUCT,
CONSTRUCT_NAME,
STRING
]

OR_CONSTRUCT = [
  SEQUENCE['OR', '[', CONSTRUCT_LIST, ']']
]

SEQUENCE_CONSTRUCT = SEQUENCE[
  'SEQUENCE', '[', CONSTRUCT_LIST, ']'
]

STRING = OR[
STRING_CHARACTER,STRING
STRING_CHARACTER
]

LETTER = OR[
  'A', 'B', 'C', 'D', 'E', 'F', 'G'...
]

PATTERN = OR[
  QUOTED_STRING

  UNQUOTED_STRING

  SINGULAR_PATTERN, PATTERN
]

SINGULAR_PATTERN = OR[
  QUOTED_STRING
  UNQUOTED_STRING
]
*/
