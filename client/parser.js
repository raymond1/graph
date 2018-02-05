//Properties: id, children, type
//methods: get_valid_beginning_strings
function Node(type){
  this.type = type
  this.children = []
  this.id = Node.get_unique_id()

  this.convert_to_string = function(){
    var children_ids = []
    for (var i = 0; i < this.children.length; i++){
      children_ids.push(this.children[i].id)
    }


    var return_string = `[id:${this.id}|type:${this.type}|children:${children_ids.join(',')}|]\n`

    for (var i = 0; i < this.children.length; i++){
      var child_as_string = this.children[i].convert_to_string()
      return_string += child_as_string
    }
    return return_string
    //[id 2312323, type asfdsf, children ids: none/ 321213,3432234]
    //[id 321213
    //|apples,oranges|
  }
}

Node.get_unique_id = Programming.getUniqueIDMaker()


function Parser(){
  //Returns true if it starts with an OR
  this.string_starts_with_OR = function(input_string){
    var location_of_first_left_bracket = input_string.indexOf('[')
    if (location_of_first_left_bracket < 0) return false

    var left_of_first_left_bracket = input_string.substring(0,location_of_first_left_bracket).trim()
    if (left_of_first_left_bracket== '' || left_of_first_left_bracket == 'OR'){
      if (this.get_matching_right_square_bracket(input_string,location_of_first_left_bracket) > -1){
        return true
      }
    }

    return false
  }

  this.string_starts_with_SEQUENCE = function(input_string){
    return this.string_starts_with_X_with_brackets(input_string, 'SEQUENCE')
  }

  this.string_starts_with_WS_ALLOW_BOTH = function(input_string){
    return this.string_starts_with_X_with_brackets(input_string, 'WS_ALLOW_BOTH')
  }

  //Returns true if input_string starts with a fixed string X, followed by optional empty space and then [ and then a matching right square bracket ]
  this.string_starts_with_X_with_brackets = function(input_string, X){
    var location_of_first_left_bracket = input_string.indexOf('[')
    if (location_of_first_left_bracket < 0) return false

    var left_of_first_left_bracket = input_string.substring(0,location_of_first_left_bracket).trim()
    if (left_of_first_left_bracket == X){
      if (this.get_matching_right_square_bracket(input_string,location_of_first_left_bracket) > -1){
        return true
      }
    }

    return false
  }

  this.string_starts_with_RULE_NAME = function(input_string){
    if (this.is_valid_RULE_NAME(input_string.charAt(0))) return true

    return false
  }

  this.get_first_top_level_right_square_bracket = function(input_string){
    var first_left_square_bracket = input_string.indexOf('[')
    var matching_right_bracket_location = this.get_matching_right_square_bracket(input_string, first_left_square_bracket)

    return matching_right_bracket_location
  }

  //given an input string containing a right square bracket(indicated by its location in input_string as offset)
  //Is the string following offset one that contains whitespace and then a comma?
  this.is_followed_by_optional_whitespace_and_then_a_comma = function(input_string, offset){
    var first_comma_location = input_string.indexOf(',', offset)
    if (first_comma_location < 0){
      return false
    }

    var string_from_right_square_bracket_to_first_comma_location = input_string.substring(offset+1, first_comma_location)
    if (string_from_right_square_bracket_to_first_comma_location == '' || !Strings.contains_non_whitespace_character(string_from_right_square_bracket_to_first_comma_location)){
      return true
    }
    return false
  }

  this.string_starts_with_QUOTED_STRING = function(input_string){
    if (Strings.count_occurrences(input_string, '\'') >= 2){
      return true
    }

    return false
  }

  this.get_first_construct_type = function(input_string){
    if (this.string_starts_with_OR(input_string)) return 'or'
    else if (this.string_starts_with_SEQUENCE(input_string)) return 'sequence'
    else if (this.string_starts_with_WS_ALLOW_BOTH(input_string)) return 'ws allow both'
    else if (this.string_starts_with_RULE_NAME(input_string)) return 'rule name'
    else if (this.string_starts_with_QUOTED_STRING(input_string)) return 'quoted string'
    else return null
  }

  //RULE_NAME1,RULE_NAME2, OR[...], SEQUENCE[], WS_ALLOW_BOTH[...], [...]
  //PATTERN
  //PATTERN, PATTERN_LIST
  this.grammarize_PATTERN_LIST = function(input_string){
Debugger.debugLog('this.grammarize_PATTERN_LIST input_string is:' + input_string)
    var trimmed_input_string = input_string.trim()
    var single_pattern = this.grammarize_PATTERN(trimmed_input_string)
    if (single_pattern != null){
Debugger.debugLog('this.grammarize_PATTERN_LIST returns valid node')
      var new_node = new Node('pattern list')
      new_node.children.push(single_pattern)
      return new_node
    }

    var construct_type = this.get_first_construct_type(trimmed_input_string)
    if (construct_type == 'or'||construct_type == 'sequence'||construct_type == 'ws allow both'){
      var first_top_level_right_square_bracket = this.get_first_top_level_right_square_bracket(trimmed_input_string)

      var first_pattern_string = trimmed_input_string.substring(0, first_top_level_right_square_bracket + 1)

      var first_pattern
      if (construct_type == 'or'){
        first_pattern = this.grammarize_OR(first_pattern_string)
      }else if (construct_type == 'sequence'){
        first_pattern = this.grammarize_SEQUENCE(first_pattern_string)
      }else if (construct_type == 'ws allow both'){
        first_pattern = this.grammarize_WS_ALLOW_BOTH(first_pattern_string)
      }

      if (first_pattern == null){
        return null
      }

      var location_of_comma_after_first_pattern = trimmed_input_string.indexOf(',', first_top_level_right_square_bracket)
      if (location_of_comma_after_first_pattern < 0){
Debugger.debugLog('this.grammarize_PATTERN_LIST returns null')
        return null
      }
      var string_after_first_pattern = trimmed_input_string.substring(location_of_comma_after_first_pattern + 1, trimmed_input_string.length)

      var subsequent_pattern_list = this.grammarize_PATTERN_LIST(string_after_first_pattern.trim())
      if (subsequent_pattern_list == null){
Debugger.debugLog('this.grammarize_PATTERN_LIST returns null')
        return null
      }

      var new_node = new Node('pattern list')
      new_node.children.push(first_pattern)
      new_node.children.push(subsequent_pattern_list)
Debugger.debugLog('this.grammarize_PATTERN_LIST returns valid node')
      return new_node
    }else if (construct_type == 'rule name'){
      var location_of_first_comma = trimmed_input_string.indexOf(',')
      if (location_of_first_comma < 0){
Debugger.debugLog('this.grammarize_PATTERN_LIST returns null')
        return null
      }

      var trimmed_string_from_beginning_to_first_comma = trimmed_input_string.substring(0,location_of_first_comma).trim()

      var first_pattern = this.grammarize_RULE_NAME(trimmed_string_from_beginning_to_first_comma)
      if (first_pattern == null){
Debugger.debugLog('this.grammarize_PATTERN_LIST returns null')
        return null
      }

      var subsequent_pattern_list = this.grammarize_PATTERN_LIST(trimmed_input_string.substring(location_of_first_comma + 1, trimmed_input_string.length))
      if (subsequent_pattern_list == null){
Debugger.debugLog('this.grammarize_PATTERN_LIST returns null')
        return null
      }

      var new_node = new Node('pattern list')
      new_node.children.push(first_pattern)
      new_node.children.push(subsequent_pattern_list)
Debugger.debugLog('this.grammarize_PATTERN_LIST returns valid node')
      return new_node
    }
    else if (construct_type == 'quoted string'){
      var location_of_first_quote = 0
      var location_of_second_quote = trimmed_input_string.indexOf('\'',1)
      var quoted_string_node = this.grammarize_QUOTED_STRING(trimmed_input_string.substring(0,location_of_second_quote + 1))
      if (quoted_string_node == null) return null

      var first_comma_after_second_quote = trimmed_input_string.indexOf(',',location_of_second_quote)
      if (first_comma_after_second_quote < 0) return null

      var subsequent_pattern_list = this.grammarize_PATTERN_LIST(trimmed_input_string.substring(first_comma_after_second_quote + 1, trimmed_input_string.length))

      if (subsequent_pattern_list == null){
        return null
      }

      var new_node = new Node('pattern list')
      new_node.children.push(quoted_string_node)
      new_node.children.push(subsequent_pattern_list)
      return new_node
    }
    else{
      return null
    }

    return null
  }

  this.grammarize_SEQUENCE = function(input_string){
console.log('this.grammarize_SEQUENCE input_string is:' + input_string)
    var trimmed_string = input_string.trim()
    if (trimmed_string.length < 'SEQUENCE[]'.length) return null

    var first_few_characters_of_trimmed_string = trimmed_string.substring(0,8)
    if (first_few_characters_of_trimmed_string !== 'SEQUENCE')
    {
      return null
    }

    var location_of_first_left_bracket = trimmed_string.indexOf('[')
    if (location_of_first_left_bracket < 0) return null

    var location_of_last_right_bracket = this.get_matching_right_square_bracket(trimmed_string,location_of_first_left_bracket)
    if (location_of_last_right_bracket < 0) return null
    if (location_of_last_right_bracket != trimmed_string.length - 1) return null
    
    var string_in_between_square_brackets = trimmed_string.substring(location_of_first_left_bracket + 1, location_of_last_right_bracket)

    var pattern = this.grammarize_PATTERN_LIST(string_in_between_square_brackets)
    if (pattern != null){
      var new_node = new Node('sequence')
      new_node.children.push(pattern)
      return new_node
    }

    return null
  }

  this.grammarize_OR = function(input_string){
    //An OR construct is either
    //A) The word OR followed by [], or
    //B)Just the [] by itself

    var trimmed_input_string = input_string.trim()

    if (trimmed_input_string.length < 3){ //minimum string needs to be []
      return null
    }

    var location_of_first_left_bracket = trimmed_input_string.indexOf('[')
    if (location_of_first_left_bracket < 0) return null

    var location_of_matching_right_bracket = this.get_matching_right_square_bracket(trimmed_input_string, location_of_first_left_bracket)
    if (location_of_matching_right_bracket < 0) return null
    if (location_of_matching_right_bracket != trimmed_input_string.length - 1) return null

    var string_before_first_left_bracket = trimmed_input_string.substring(0,location_of_first_left_bracket).trim()
    if (string_before_first_left_bracket != 'OR' && string_before_first_left_bracket != '') return null

    var string_in_between_two_square_brackets = trimmed_input_string.substring(location_of_first_left_bracket + 1, location_of_matching_right_bracket)

    var pattern_list = this.grammarize_PATTERN_LIST(string_in_between_two_square_brackets)
    if (pattern_list != null){
      var return_node = new Node('or construct')
      return_node.children.push = pattern_list
      return return_node
    }

    return null
  }

  this.is_valid_RULE_NAME = function(input_string){
    if (Strings.is_alphabetical(input_string)) return true
    return false
  }

  this.grammarize_RULE_NAME = function(input_string){
    var string_node = this.grammarize_ALPHABETICAL_STRING(input_string)
    if (string_node != null){
      var new_node = new Node('rule name')
      new_node.children = string_node
      return new_node
    }
    return null
  }


  this.grammarize_ALPHABETICAL_STRING = function(input_string){
    if (Strings.is_alphabetical(input_string)){
      var new_node = new Node('string')
      new_node.value = input_string
      return new_node
    }
    return null
  }

  //For now, 'STRING' refers to alphabetic string only
  this.grammarize_QUOTED_STRING = function(input_string){
    //If all letters are in the range 'A-Za-z', return the string as a node.
    if (input_string.length < 2){
      return null
    }
    if (input_string.charAt(0) != '\'') return null
    if (input_string.charAt(input_string.length -1) != '\'') return null

    var middle_string = input_string.substring(input_string, 1, input_string.length -1)
    var new_node = new Node('quoted string')
    new_node.value = middle_string
    return new_node
  }

  //WS_ALLOW_BOTH[PATTERN]
  this.grammarize_WS_ALLOW_BOTH = function(input_string){
    var trimmed_input_string = input_string.trim()
    var location_of_first_left_square_bracket = trimmed_input_string.indexOf('[')
    if (location_of_first_left_square_bracket < 0) return null

    var string_before_first_left_square_bracket = trimmed_input_string.substring(0, location_of_first_left_square_bracket)
    if (string_before_first_left_square_bracket.trim() != 'WS_ALLOW_BOTH') return null

    var location_of_matching_right_square_bracket = this.get_matching_right_square_bracket(trimmed_input_string, location_of_first_left_square_bracket)
    if (location_of_matching_right_square_bracket < 0){
      return null
    }

    var string_between_two_square_brackets = trimmed_input_string.substring(location_of_first_left_square_bracket + 1, location_of_matching_right_square_bracket)

    var inner_pattern = this.grammarize_PATTERN(string_between_two_square_brackets)
    if (inner_pattern != null){
      var new_node = new Node('ws allow both')
      new_node.children.push(inner_pattern)
      return new_node
    }

    return null
  }

  this.grammarize_PATTERN = function(input_string){
    var trimmed_input_string = input_string.trim()
    var quoted_string = this.grammarize_QUOTED_STRING(trimmed_input_string)
    if (quoted_string != null){
      var new_node = new Node('pattern')
      new_node.children.push(quoted_string)
      return new_node
    }

    var rule_name = this.grammarize_RULE_NAME(trimmed_input_string)
    if (rule_name != null){
      var new_node = new Node('pattern')
      new_node.children.push(rule_name)
      return new_node
    }

    var or_construct = this.grammarize_OR(trimmed_input_string)
    if (or_construct != null){
      var new_node = new Node('pattern')
      new_node.children.push(or_construct)
      return new_node
    }

    var sequence_construct = this.grammarize_SEQUENCE(trimmed_input_string)
    if (sequence_construct != null){
      var new_node = new Node('pattern')
      new_node.children.push(sequence_construct)
      return new_node
    }

    var ws_allow_both = this.grammarize_WS_ALLOW_BOTH(trimmed_input_string)
    if (ws_allow_both != null){
      var new_node = new Node('pattern')
      new_node.children.push(ws_allow_both)
      return new_node
    }
    return null
  }

  //A valid RULE_NAME is purely alphabetical, or underscore
  //A valid RULE_NAME must have at least one character in it
  this.grammarize_RULE_NAME = function(input_string){
    if (input_string.length < 1) return null

    if (Strings.contains_only(input_string, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789')){
      return new Node('rule name')
    }
    return null
  }


  //RULE = SEQUENCE[
  //WS_ALLOW_BOTH[RULE_NAME],
  //'=',
  //WS_ALLOW_BOTH[RULE_NAME]
  //]
  //If input_string is a valid rule, return a rule node
  //If not valid, return null
  this.grammarize_RULE = function(input_string){
    var index_of_equals_sign = input_string.indexOf('=') 
    if (index_of_equals_sign < 0) return null

    var left_of_equals = input_string.substring(0, index_of_equals_sign)
    var right_of_equals = input_string.substring(index_of_equals_sign + 1, input_string.length)

    if (left_of_equals.length < 1) return null
    if (right_of_equals.length < 1) return null

    var name_node = this.grammarize_RULE_NAME(left_of_equals.trim())
    var pattern_node = this.grammarize_PATTERN(right_of_equals.trim())

    if (name_node == null || pattern_node == null) return null

    var return_node = new Node('rule')
    return_node.children = [name_node, pattern_node]
    return return_node
  }

  //location_of_left_bracket is the bracket you want to match in input_string
  this.get_matching_right_square_bracket = function(input_string, location_of_left_bracket){
    //[dfgfgdsfasdfa[][][[]]]

    var number_of_unmatched_left_square_brackets = 0
    for (var i = location_of_left_bracket; i < input_string.length; i++){
      if (input_string.charAt(i) == '['){
        number_of_unmatched_left_square_brackets++
      }

      if (input_string.charAt(i) == ']'){
        number_of_unmatched_left_square_brackets--
      }

      if (number_of_unmatched_left_square_brackets == 0) return i
    }
    return -1
  }

  //NAME1=PATTERN1
  //NAME2=PATTERN2
  //NAME3=PATTERN3
  //etc.

  //If input_string is a valid rule list, return a rule list node, and its corresponding children
  //If not valid, return null
  this.grammarize_RULE_LIST = function(input_string){
Debugger.debugLog('this.grammarize_RULE_LIST input_string is:' + input_string)
    //First, deal with the case there is only one rule
    var single_rule = this.grammarize_RULE(input_string)

    if (single_rule != null){
      var new_node = new Node('rule list')
      new_node.children.push(single_rule)
Debugger.debugLog('this.grammarize_RULE_LIST returns a valid node')
      return new_node
    }

    //The case when there is a rule followed by a list
    //1)Trim whitespace
    //2)Check if there are at least two equal signs
    //3)Find the first equal sign
    //4)Check if the string to the left of the first equal sign is a valid name
    //5)Find the first left square bracket
    //6)Find the matching right bracket
    //7)Process everything from the name to the right bracket as one RULE
    //8)Process everything to the right of the right bracket as another RULE_LIST

    var trimmed_input_string = input_string.trim()
    if (Strings.count_occurrences(trimmed_input_string, '=') < 2){
Debugger.debugLog('this.grammarize_RULE_LIST returns a null')
      return null
    }

    var location_of_first_equals_sign = trimmed_input_string.indexOf('=')
    var left_of_first_equals_sign = trimmed_input_string.substring(0, location_of_first_equals_sign)
    var trimmed_left_of_first_equals_sign = left_of_first_equals_sign.trim()

    var rule_name = this.grammarize_RULE_NAME(trimmed_left_of_first_equals_sign)
    if (rule_name == null){
Debugger.debugLog('this.grammarize_RULE_LIST returns null')
      return null
    }

    var location_of_first_left_square_bracket = trimmed_input_string.indexOf('[')
    var location_of_matching_right_square_bracket = this.get_matching_right_square_bracket(trimmed_input_string, location_of_first_left_square_bracket)
    if (location_of_matching_right_square_bracket == -1){
Debugger.debugLog('this.grammarize_RULE_LIST returns null')
      return null
    }

    var first_rule_string = trimmed_input_string.substring(0, location_of_matching_right_square_bracket + 1)
    var first_rule = this.grammarize_RULE(first_rule_string)
    if (first_rule == null){
Debugger.debugLog('this.grammarize_RULE_LIST returns null')
      return null
    }

    var subsequent_rule_list_string = trimmed_input_string.substring(location_of_matching_right_square_bracket + 1, trimmed_input_string.length)
    var subsequent_rule_list = this.grammarize_RULE_LIST(subsequent_rule_list_string)

    if (subsequent_rule_list == null){
Debugger.debugLog('this.grammarize_RULE_LIST returns null')
      return null
    }

    var return_node = new Node('rule list')
    return_node.children.push(first_rule)
    return_node.children.push(subsequent_rule_list)
Debugger.debugLog('this.grammarize_RULE_LIST returns a valid node')
    return return_node
  }

  //Takes in a string representation of a grammar, and converts it to an in-memory representation of the grammar in tree form
  this.grammarize = function(input_string){
Debugger.debugLog('this.grammarize input_string is:' + input_string)
    var return_node = this.grammarize_RULE_LIST(input_string)
    if (return_node == null){
Debugger.debugLog('this.grammarize returns null')
      console.log('Grammar is empty or there was an error in your grammar.')
console.log(Debugger.debugLogMessages)
    }
Debugger.debugLog('this.grammarize returns not null')
    return return_node
  }
/*
  //1)Takes the input grammar and generates rules from them
  //2)Now that the rules have been loaded into memory, takes in a string and returns an abstract syntax tree
  this.parse = function (input_string){
    //Based off of the grammar, get a list of constructs
    this.grammarize(this.input_grammar)
    return this.parse_construct(input_string, 'TOP_LEVEL_CONSTRUCT')
  }
*/
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
WS_ALLOW_BOTH = (built-in)
COMMA = (built-in)

*/
