let uniqueIdMaker = Programming.getUniqueIDMaker()
class Node{
  constructor(parser){
    this.idCreator = uniqueIdMaker
    this.parser = parser
    this.attributes = []
    this.setAttribute('id', this.idCreator())
  }


  //If attribute exists, overwrite it
  //If attribute does not exist, create it
  setAttribute(attributeName, value = null){
    if (this.attributes.indexOf(attributeName) > -1){
      
    }else{
      this.attributes.push(attributeName)
    }

    this[attributeName] = value
  }


  getChildren(){
    let children = []
    for (let i = 0; i < this.attributes.length; i++){
      if (typeof this[attributes[i]] == 'object'){
        children.push(this[attributes[i]])
      }else if (typeof this[attributes[i]] == 'array'){
        for (let j = 0; j < this[attributes[i]].length; j++){
          children.push(this[attributes[i]][j])
        }
      }
    }
    return children
  }

  //adds in more debugging capability
  match(string){
    this.parser.matchRecorder.push(this.id)
    if (this.parser.matchRecorder.length == 15){
      debugger
    }
  }

  saveReturnValue(object){
    object.id = this.id
    this.parser.matchRecorder.push(object)
    return object
  }
}

class RuleList extends Node{
  constructor(parser, rulesArray){
    super(parser)
    this.setAttribute('rules', rulesArray)
    this.setAttribute('friendly node name', 'rule list')
  }
  
  //produces rule nodes as long as they are found
  match(string){
    super.match(string)
    let matchedRules = []
    let ruleMatched = false
    let tempString = string
    do{
      ruleMatched = false
      let matchInformation = null
      let matchingRule = null
      for (let i = 0; i < this.rules.length; i++){
        matchInformation = this.rules[i].match(tempString)
        if (matchInformation.matchFound){
          ruleMatched = true
          matchingRule = this.rules[i]
          break
        }
      }
      if (ruleMatched){
        tempString = tempString.substring(matchInformation.matchLength)
        let newNode = new Node()
        newNode.setAttribute('name', matchingRule.name)

        //Also need to change the string
        //string = string.substring...
        matchedRules.push(newNode)
      }else{
        return this.saveReturnValue({matchFound: false})
      }
      /*
      return {matchFound: true, matchLength: matchInformation.matchLength}
  
      continue = false*/
    }while(ruleMatched)

    return this.saveReturnValue({matchFound: true, matchedRules})
  }
}

class Rule extends Node{
  constructor(parser, pattern, name){
    super(parser)
    this.setAttribute('friendly node name', 'rule')
    this.setAttribute('pattern', pattern)
    this.setAttribute('name', name)
  }

  match(string){
    super.match(string)
    let matchInfo = this.pattern.match(string)
    if (matchInfo.matchFound){
      return this.saveReturnValue({matchFound:true, matchLength: matchInfo.matchLength})
    }
    return this.saveReturnValue({matchFound: false})
  }
}

//When matching a rule name, it has to match with an entry in the rule table...
//So... I need a rule table first...
class RuleName extends Node{
  constructor(parser, name){
    super(parser)
    this.setAttribute('value', name)
    this.setAttribute('friendly node name', 'rule name')
  }

  match(string){
    super.match(string)

    let rule = this.parser.getRule(this.value)
    if (rule == null){
      return this.saveReturnValue({matchFound: false})
    }
    else{
      return this.saveReturnValue(rule.match(string))
    }
  }
}

class Sequence extends Node{
  constructor(parser,patternList){
    super(parser)
    this.setAttribute('pattern list', patternList)
    this.setAttribute('friendly node name', 'sequence')
  }

  match(string){
    super.match(string)

    return this.saveReturnValue(this['pattern list'].match(string))
  }
}

//WS_ALLOW_BOTH must take a parameter
//Assumes you are not going to use WS_ALLOW_BOTH on a whitespace character
class WSAllowBoth extends Node{
  constructor(parser,innerPattern){
    super(parser)
    this.setAttribute('inner pattern', innerPattern)
    this.setAttribute('friendly node name', 'ws allow both')
  }

  match(string){
    super.match(string)

    let numberOfLeadingWhitespaceCharacters = 0
    let numberOfTrailingWhitespaceCharacters = 0.

    let i = 0
    for (i = 0; Strings.is_whitespace(string.charAt(i)); i++){
    }
    numberOfLeadingWhitespaceCharacters = i

    let remainderString = string.substring(i)
    let innerPatternMatchInfo = this['inner pattern'].match(remainderString)
    if (innerPatternMatchInfo.matchFound){
      let afterInnerPattern = remainderString.substring(innerPatternMatchInfo.matchLength)
      for (i = 0; Strings.is_whitespace(afterInnerPattern.charAt(i)); i++){
      }
      numberOfTrailingWhitespaceCharacters = i
      return this.saveReturnValue({matchFound: true, matchLength: numberOfLeadingWhitespaceCharacters + innerPatternMatchInfo.matchLength + numberOfTrailingWhitespaceCharacters})
    }else{
      return this.saveReturnValue({matchFound: false})
    }
    //is it just the pattern with no white space at the front?
    //is there whitespace in the front?
    //If yes, is it followed by the pattern?
    //If yes, is it followed by whitespace?
  }
}

class Or extends Node{
  //patternList is an array
  constructor(parser,patternList){
    super(parser)
    this.setAttribute('pattern list', patternList)
    this.setAttribute('friendly node name', 'or')
  }

  match(string){
    super.match(string)

    return this.saveReturnValue(this['pattern list'].match(string))
  }
}

//A Quoted string is a ' followed by a string followed by a '
//Currently, there is no such thing as an empty string ''. You must have something in between.
class QuotedString extends Node{
  constructor(parser,string){
    super(parser)
    this.setAttribute('string', string)
    this.setAttribute('friendly node name', 'quoted string')
  }

  match(string){
    super.match(string)

    let quotedString = '\'' + this['string'] + '\''
    
    if (string.substring(0, quotedString.length) == quotedString){
      return this.saveReturnValue({matchFound: true, matchLength: quotedString.length})
    }else{
      return this.saveReturnValue({matchFound: false})
    }
  }
}

//Consecutive a-zA-Z characters
class AlphabeticalString extends Node{
  constructor(parser,string){
    super(parser)
    this.setAttribute('string', string)
    this.setAttribute('friendly node name', 'alphabetical string')
  }

  match(string){
    super.match(string)

    let alphabeticalString = this['string']
    
    if (string.substring(0, alphabeticalString.length) == alphabeticalString){
      return this.saveReturnValue({matchFound: true, matchLength: alphabeticalString.length})
    }else{
      return this.saveReturnValue({matchFound: false})
    }
  }
}

class Pattern extends Node{
  constructor(parser,innerPattern){
    super(parser)
    this.setAttribute('friendly node name', 'pattern')
    this.setAttribute('inner pattern', innerPattern)//is it a 'quoted string', an 'or', a 'sequence', a 'rule name', or a 'ws allow both'?
  }

  match(string){
    super.match(string)

    let matchInfo = this['inner pattern'].match(string)
    return this.saveReturnValue(matchInfo)
  }
}

//patterns is an array of patterns
//patternListType is either 'or' or 'sequence'
class PatternList extends Node{
  constructor(parser,patterns, patternListType){
    super(parser)
    this.setAttribute('patterns', patterns)
    this.setAttribute('pattern list type', patternListType)
    this.setAttribute('friendly node name', 'pattern list')
  }

  match(string){
    super.match(string)

    if (this['pattern list type'] == 'or'){
      for (let i = 0; i < this['patterns'].length; i++){
        let matchInfo = this['patterns'][i].match(string)

        if (matchInfo.matchFound){
          return this.saveReturnValue(matchInfo)
        }
      }
    }else if (this['pattern list type'] == 'sequence'){
      let patterns = this['patterns']
      let tempString = string
      let matchInfoArray = []
  
      for (let i = 0; i < patterns.length; i++){
        let matchInfo = patterns[i].match(tempString)

        matchInfoArray.push(matchInfo) 
        if (!matchInfo.matchFound){
          return this.saveReturnValue({matchFound: false})
        }else{
          tempString = tempString.substring(matchInfo.length)
        }
      }
  
      let totalMatchLength = 0
      for (let i = 0; i < matchInfoArray.length; i++){
        totalMatchLength += matchInfoArray[i].matchLength
      }
      return this.saveReturnValue({matchFound: true, matchLength: totalMatchLength})

    }

    return this.saveReturnValue({matchFound: false})
  }
}

class Multiple extends Node{
  constructor(parser,pattern){
    super(parser)
    this.setAttribute('pattern', pattern)
    this.setAttribute('friendly node name', 'multiple')
  }

  match(string){
    super.match(string)

    let totalMatchLength = 0
    let matchInfo = this.pattern.match(string)
    while(matchInfo.matchFound){
      totalMatchLength = totalMatchLength + matchInfo.matchLength
      string = string.substring(matchInfo.matchLength)
      matchInfo = this.pattern.match(string)
    }

    if (totalMatchLength == 0){
      return this.saveReturnValue({matchFound: false})
    }
    return this.saveReturnValue({matchFound: true, matchLength: totalMatchLength})
  }
}
//Usage: let parser = new Parser(grammar_string)
//parser.parse(input_string)
//In other words, the grammar that the parser needs to parse is passed into the constructor during the creation on the Parser object
//Then, the parse function is run, taking in an input_string representing a small set of data given in the language specified by the language loaded by the Parser object during its construction
class Parser{

  constructor(grammarString){
    this.runningGrammar = this.grammarize(grammarString)
    this.rules = this.getRules(this.runningGrammar)
    this.matchRecorder = [] //collects the names of the classes whose match functions were run
  }

  //Returns true if it starts with an OR
  string_starts_with_OR(input_string){
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

  string_starts_with_SEQUENCE(input_string){
    return this.string_starts_with_X_with_brackets(input_string, 'SEQUENCE')
  }

  string_starts_with_WS_ALLOW_BOTH(input_string){
    return this.string_starts_with_X_with_brackets(input_string, 'WS_ALLOW_BOTH')
  }

  //Returns true if input_string starts with a fixed string X, followed by optional empty space and then [ and then a matching right square bracket ]
  string_starts_with_X_with_brackets(input_string, X){
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

  string_starts_with_RULE_NAME(input_string){
    if (Parser.is_valid_RULE_NAME(input_string.charAt(0))) return true

    return false
  }

  get_first_top_level_right_square_bracket(input_string){
    var first_left_square_bracket = input_string.indexOf('[')
    var matching_right_bracket_location = this.get_matching_right_square_bracket(input_string, first_left_square_bracket)

    return matching_right_bracket_location
  }

  //given an input string containing a right square bracket(indicated by its location in input_string as offset)
  //Is the string following offset one that contains whitespace and then a comma?
  is_followed_by_optional_whitespace_and_then_a_comma(input_string, offset){
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

  string_starts_with_QUOTED_STRING(input_string){
    if (Strings.count_occurrences(input_string, '\'') >= 2){
      return true
    }

    return false
  }

  get_first_construct_type(input_string){
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
  //There are actually two types of pattern lists: or and sequence.
  //This is because it is necessary to know the context of a pattern list in order to know how to interpret it properly later on
  grammarize_PATTERN_LIST(input_string, pattern_list_type){
    var trimmed_input_string = input_string.trim()
    var single_pattern = this.grammarize_PATTERN(trimmed_input_string)
    if (single_pattern != null){
      var new_node = new PatternList(this, [single_pattern], pattern_list_type)
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
        return null
      }
      var string_after_first_pattern = trimmed_input_string.substring(location_of_comma_after_first_pattern + 1, trimmed_input_string.length)

      var subsequent_pattern_list = this.grammarize_PATTERN_LIST(string_after_first_pattern.trim(), pattern_list_type)
      if (subsequent_pattern_list == null){
        return null
      }

      var new_node = new PatternList(this, [first_pattern].concat(subsequent_pattern_list), pattern_list_type)
      return new_node
    }else if (construct_type == 'rule name'){
      var location_of_first_comma = trimmed_input_string.indexOf(',')
      if (location_of_first_comma < 0){
        return null
      }

      var trimmed_string_from_beginning_to_first_comma = trimmed_input_string.substring(0,location_of_first_comma).trim()

      var first_pattern = this.grammarize_RULE_NAME(trimmed_string_from_beginning_to_first_comma)
      if (first_pattern == null){
        return null
      }

      var subsequent_pattern_list = this.grammarize_PATTERN_LIST(trimmed_input_string.substring(location_of_first_comma + 1, trimmed_input_string.length), pattern_list_type)
      if (subsequent_pattern_list == null){
        return null
      }

      var new_node = new PatternList(this, [first_pattern].concat(subsequent_pattern_list), pattern_list_type)
      return new_node
    }
    else if (construct_type == 'quoted string'){
      var location_of_second_quote = trimmed_input_string.indexOf('\'',1)
      var quoted_string_node = this.grammarize_QUOTED_STRING(trimmed_input_string.substring(0,location_of_second_quote + 1))
      if (quoted_string_node == null) return null

      var first_comma_after_second_quote = trimmed_input_string.indexOf(',',location_of_second_quote)
      if (first_comma_after_second_quote < 0) return null

      var subsequent_pattern_list = this.grammarize_PATTERN_LIST(trimmed_input_string.substring(first_comma_after_second_quote + 1, trimmed_input_string.length), pattern_list_type)

      if (subsequent_pattern_list == null){
        return null
      }

      var new_node = new PatternList(this,[quoted_string_node].concat(subsequent_pattern_list), pattern_list_type)
      return new_node
    }
    return null
  }

  grammarize_SEQUENCE(input_string){
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

    var patternList = this.grammarize_PATTERN_LIST(string_in_between_square_brackets, 'sequence')
    if (patternList != null){
      var new_node = new Sequence(this,patternList)
      return new_node
    }

    return null
  }

  grammarize_OR(input_string){
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

    var pattern_list = this.grammarize_PATTERN_LIST(string_in_between_two_square_brackets, 'or')
    if (pattern_list != null){
      var return_node = new Or(this,pattern_list)
      return return_node
    }

    return null
  }

  //A valid RULE_NAME is purely alphabetical, or underscore
  //A valid RULE_NAME must have at least one character in it
  grammarize_RULE_NAME(input_string){
    if (input_string.length < 1) return null

    if (Strings.contains_only(input_string, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789')){
      let returnNode = new RuleName(this,input_string)
      return returnNode
    }
    return null
  }


  grammarize_ALPHABETICAL_STRING (input_string){
    if (Strings.is_alphabetical(input_string)){
      var new_node = new AlphabeticalString(this, input_string)
      return new_node
    }
    return null
  }


  grammarize_QUOTED_STRING(input_string){
    //If all characters are in the range 'A-Za-z0-9', return the string as a node.
    if (input_string.length < 2){
      return null
    }
    if (input_string.charAt(0) != '\'') return null
    if (input_string.charAt(input_string.length -1) != '\'') return null
    if (Strings.count_occurrences(input_string, '\'') > 2) return null

    var middle_string = input_string.substring(1, input_string.length -1)
    
    var new_node = new QuotedString(this, middle_string)
    return new_node
  }

  //WS_ALLOW_BOTH[PATTERN]
  grammarize_WS_ALLOW_BOTH(input_string){
    var trimmed_input_string = input_string.trim()
    var location_of_first_left_square_bracket = trimmed_input_string.indexOf('[')
    if (location_of_first_left_square_bracket < 0) return null

    var string_before_first_left_square_bracket = trimmed_input_string.substring(0, location_of_first_left_square_bracket)
    if (string_before_first_left_square_bracket.trim() != 'WS_ALLOW_BOTH') return null

    var location_of_matching_right_square_bracket = this.get_matching_right_square_bracket(trimmed_input_string, location_of_first_left_square_bracket)
    if (location_of_matching_right_square_bracket < 0){
      return null
    }

    if (location_of_matching_right_square_bracket + 1 != trimmed_input_string.length) return null
    var string_between_two_square_brackets = trimmed_input_string.substring(location_of_first_left_square_bracket + 1, location_of_matching_right_square_bracket)

    var inner_pattern = this.grammarize_PATTERN(string_between_two_square_brackets)
    if (inner_pattern != null){
      var new_node = new WSAllowBoth(this,inner_pattern)
      return new_node
    }

    return null
  }

  grammarize_MULTIPLE(input_string){
    var trimmed_string = input_string.trim()
 
    var first_few_characters_of_trimmed_string = trimmed_string.substring(0,'MULTIPLE'.length)
    if (first_few_characters_of_trimmed_string !== 'MULTIPLE')
    {
      return null
    }

    var location_of_first_left_bracket = trimmed_string.indexOf('[')
    if (location_of_first_left_bracket < 0) return null

    var location_of_last_right_bracket = this.get_matching_right_square_bracket(trimmed_string,location_of_first_left_bracket)
    if (location_of_last_right_bracket < 0) return null
    if (location_of_last_right_bracket != trimmed_string.length - 1) return null
    
    var string_in_between_square_brackets = trimmed_string.substring(location_of_first_left_bracket + 1, location_of_last_right_bracket)

    var pattern = this.grammarize_PATTERN(string_in_between_square_brackets)
    if (pattern != null){
      var new_node = new Multiple(this,pattern)
      return new_node
    }

    return null
  }



  grammarize_PATTERN(input_string){
    var trimmed_input_string = input_string.trim()
    var quoted_string = this.grammarize_QUOTED_STRING(trimmed_input_string)
    if (quoted_string != null){
      return new Pattern(this,quoted_string, 'quoted string')
    }

    var rule_name = this.grammarize_RULE_NAME(trimmed_input_string)
    if (rule_name != null){
      return new Pattern(this,rule_name, 'rule name')
    }

    var or_construct = this.grammarize_OR(trimmed_input_string)
    if (or_construct != null){
      return new Pattern(this,or_construct, 'or')
    }

    var sequence_construct = this.grammarize_SEQUENCE(trimmed_input_string)
    if (sequence_construct != null){
      return new Pattern(this,sequence_construct, 'sequence')
    }

    var ws_allow_both = this.grammarize_WS_ALLOW_BOTH(trimmed_input_string)
    if (ws_allow_both != null){
      return new Pattern(this,ws_allow_both, 'ws allow both')
    }

    var multiple = this.grammarize_MULTIPLE(trimmed_input_string)
    if (multiple != null){
      return new Pattern(this,multiple, 'multiple')
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
  grammarize_RULE(input_string){
    if (!input_string) return null

    var index_of_equals_sign = input_string.indexOf('=') 
    if (index_of_equals_sign < 0) return null

    var left_of_equals = input_string.substring(0, index_of_equals_sign)
    var right_of_equals = input_string.substring(index_of_equals_sign + 1, input_string.length)

    if (left_of_equals.length < 1) return null
    if (right_of_equals.length < 1) return null

    var name_node = this.grammarize_RULE_NAME(left_of_equals.trim())
    var pattern_node = this.grammarize_PATTERN(right_of_equals.trim())

    if (name_node == null || pattern_node == null) return null

    var return_node = new Rule(this,pattern_node, name_node.value)

    return return_node
  }

  //location_of_left_bracket is the bracket you want to match in input_string
  get_matching_right_square_bracket(input_string, location_of_left_bracket){
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

  getNextString(string){
    let i = 0;
    let returnString = ''
    for (i = 1; i < string.length; i++){
      let tempString = string.substring(0, i)
      if (Strings.contains_only(tempString, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789')){
        returnString = tempString
      }
    }
    return returnString
  }

  getNextRuleString(string){
    let location_of_first_equals_sign = string.indexOf('=')
    if (location_of_first_equals_sign < 1){
      return null
    }

    let left_of_first_equals_sign = string.substring(0, location_of_first_equals_sign)
    let trimmed_left_of_first_equals_sign = left_of_first_equals_sign.trim()

    let rule_name = this.grammarize_RULE_NAME(trimmed_left_of_first_equals_sign)
    if (rule_name == null){
      return null
    }

    let location_of_first_left_square_bracket = string.indexOf('[')
    if (location_of_first_left_square_bracket >= 0){ //if first left square bracket was found
      let location_of_matching_right_square_bracket = this.get_matching_right_square_bracket(string, location_of_first_left_square_bracket)
      if (location_of_matching_right_square_bracket == -1){
        return null
      }
  
      let next_rule_string = string.substring(0, location_of_matching_right_square_bracket + 1)
      return next_rule_string
    }else{
      let leadingSpaces = Strings.swallow(string.substring(location_of_first_equals_sign + 1), ' ')
      let ruleName = Strings.swallow(string.substring(location_of_first_equals_sign + 1 + leadingSpaces.length), Parser.RULE_NAME_characters)
      if (ruleName.length > 0){
        return string.substring(0, location_of_first_equals_sign + leadingSpaces.length + ruleName.length + 1)
      }
    }
  }

  //If inputString is a valid rule list, return a rule list node, and its corresponding children
  //If not valid, return null
  grammarize_RULE_LIST(inputString){
    if (inputString.length < 1) return null

    let rules = []
    let remainingString = inputString
    
    while(remainingString.length > 0){
      let singleRuleString = this.getNextRuleString(remainingString)
      let singleRule = this.grammarize_RULE(singleRuleString)
      if (singleRule){
        rules.push(singleRule)
        remainingString = remainingString.substring(singleRuleString.length).trim()
      }else{
        return null //no valid rule list
      }
    }
/*
    var subsequent_rule_list_string = trimmed_input_string.substring(location_of_matching_right_square_bracket + 1, trimmed_input_string.length)
    var subsequent_rule_list = this.grammarize_RULE_LIST(subsequent_rule_list_string)

    if (subsequent_rule_list == null){
      return null
    }
    let concatenatedRules = [first_rule].concat(subsequent_rule_list)
*/
    var return_node = new RuleList(this,rules)
    return return_node
  }

  //Takes in a string representation of a grammar, and returns a root node of an in-memory representation of the grammar in tree form
  grammarize(input_string){
    var return_node = this.grammarize_RULE_LIST(input_string)

    if (return_node == null){
      console.log('Grammar is empty or there was an error in your grammar.')
    }
    return return_node
  }

  //Gets all nodes of type rule that are descendants of the current node
  getRules(grammarNode){
    let rules = []
    if (grammarNode['friendly node name'] == 'rule'){
      rules.push(grammarNode)
      return rules
    }else if (grammarNode['friendly node name'] == 'rule list'){
      if (grammarNode.rules.length > 0){
        for (let i = 0; i < grammarNode.rules.length; i++){
          let childRules = this.getRules(grammarNode.rules[i])
          rules = rules.concat(childRules)
        }
      }
      return rules
    }else{
      //This is an error
      throw "Error getting rules."
    }
  }

  //Returns the rule with the rule name ruleName
  getRule(ruleName){
    /*
    //There is a special case when ruleName == 'RULE_NAME'
    if (ruleName == 'RULE_NAME'){
      return new Or(this, new PatternList(this,this.rules))
    }
*/
    for (let i = 0; i < this.rules.length; i++){
      if (this.rules[i].name == ruleName){
        return this.rules[i]
      }
    }
    return null
  }

  //Below here lies the code for parsing using the running grammar
  
  //takes in a string and returns an abstract syntax tree, according to previously loaded grammar
  //Assumes there is only one top-level construct
  parse(inputString){
    let matchInformation = this.runningGrammar.match(inputString)
    return matchInformation
  }
}

Parser.RULE_NAME_characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'
//A valid rule name consists of letters, numbers and underscores
Parser.is_valid_RULE_NAME = function(input_string){
  if (Strings.contains_only(input_string, Parser.RULE_NAME_characters)) return true
  return false
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
