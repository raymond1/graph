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
    this.setAttribute('friendly node type name', 'rule list')
  }
  
  //produces rule nodes as long as they are found
  match(string){
    super.match(string)
    let matchedRules = []
    let ruleMatched = false
    let tempString = string
    let returnValue = {matchFound: false}
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

        break
      }
    }while(ruleMatched&&tempString != '')
    this.saveReturnValue(returnValue)
    return returnValue
  }
}

class Rule extends Node{
  constructor(parser, pattern, name){
    super(parser)
    this.setAttribute('friendly node type name', 'rule')
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
    this.setAttribute('friendly node type name', 'rule name')
  }

  match(string){
    super.match(string)

    let rule = this.parser.getRule(this.value)
    let returnValue = {matchFound: false}
    if (rule != null){
      returnValue = rule.match(string)
    }
    this.saveReturnValue(returnValue)
    return returnValue
  }
}

class Sequence extends Node{
  constructor(parser,patterns){
    super(parser)
    this.setAttribute('patterns', patterns)
    this.setAttribute('friendly node type name', 'sequence')
  }

  match(string){
    super.match(string)
    let tempString = string
    let totalMatchLength = 0
    let returnInfo = {matchFound: false}
    for (let i = 0; i < this['patterns'].length; i++){
      let matchInfo = this['patterns'][i].match(tempString)
      if (!matchInfo.matchFound){

        break;
      }else{
        totalMatchLength = totalMatchLength + matchInfo.matchLength
        tempString = tempString.substring(matchInfo.matchLength)
      }
    }
    if (totalMatchLength > 0){
      returnInfo = {matchFound:true, matchLength: totalMatchLength}
    }
    this.saveReturnValue(returnInfo)
    return returnInfo
  }
}

class Or extends Node{
  //patternList is an array
  constructor(parser,patterns){
    super(parser)
    this.setAttribute('patterns', patterns)
    this.setAttribute('friendly node type name', 'or')
  }

  match(string){
    super.match(string)
    let returnInfo = {matchFound: false}
    for (let i = 0; i < this.patterns.length; i++){
      let matchInfo = this['patterns'][i].match(string)
      if (matchInfo.matchFound){
        returnInfo = matchInfo
        break
      }
    }
    this.saveReturnValue(returnInfo)
    return returnInfo
  }
}


//WS_ALLOW_BOTH must take a parameter
//Assumes you are not going to use WS_ALLOW_BOTH on a whitespace character
class WSAllowBoth extends Node{
  constructor(parser,innerPattern){
    super(parser)
    this.setAttribute('inner pattern', innerPattern)
    this.setAttribute('friendly node type name', 'ws allow both')
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


//A Quoted string is a ' followed by a string followed by a '
//Currently, there is no such thing as an empty string ''. You must have something in between.
class QuotedString extends Node{
  constructor(parser,string){
    super(parser)
    this.setAttribute('string', string)
    this.setAttribute('friendly node type name', 'quoted string')
  }

  match(string){
    super.match(string)

    let quotedString = this['string']
    
    let returnValue = {matchFound: false}
    if (string.substring(0, quotedString.length) == quotedString){
      returnValue = {matchFound: true, matchLength: quotedString.length, string: this['string']}
    }
    returnValue = this.saveReturnValue(returnValue)
    return returnValue
  }
}

//Consecutive a-zA-Z characters
class AlphabeticalString extends Node{
  constructor(parser,string){
    super(parser)
    this.setAttribute('string', string)
    this.setAttribute('friendly node type name', 'alphabetical string')
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

//untested
class CharacterClass extends Node{
  constructor(parser,quotedString){
    super(parser)
    this.setAttribute('friendly node type name', 'character class')
    this.setAttribute('string', quotedString.string)//is it a 'quoted string', an 'or', a 'sequence', a 'rule name', or a 'ws allow both'?
  }

  match(string){
    super.match(string)
    let matchingString = ''
    for (let i = 1; i < string.length; i++){
      let headString = string.substring(0,i)
      if (Strings.contains_only(headString,this['quoted string'])){
        matchingString = headString
      }else{
        break
      }
    }

    let returnInfo = {matchFound: false}
    if (matchingString.length > 0){
      returnInfo = {matchFound:true, matchLength: matchingString.length}
    }
    this.saveReturnValue(returnInfo)
    return returnInfo
  }

}

class Pattern extends Node{
  constructor(parser,innerPattern){
    super(parser)
    this.setAttribute('friendly node type name', 'pattern')
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
    this.setAttribute('friendly node type name', 'pattern list')
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
    this.setAttribute('friendly node type name', 'multiple')
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
    this.validStringCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_= '
    this.validRuleNameCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'
    this.runningGrammar = this.grammarize(grammarString)
    this.rules = this.getRules(this.runningGrammar)
    this.matchRecorder = [] //collects the names of the classes whose match functions were run
  }

  //If string starts with a fixed string X, followed by optional empty space and then [ and then a matching right square bracket ] then return the string
  //Otherwise, return the empty string
  headMatchXWithBrackets(string, X){
    var location_of_first_left_bracket = string.indexOf('[')
    if (location_of_first_left_bracket < 0) return ''

    var left_of_first_left_bracket = string.substring(0,location_of_first_left_bracket).trim()
    if (left_of_first_left_bracket == X){
      let indexOfRightMatchingSquareBracket = this.get_matching_right_square_bracket(string,location_of_first_left_bracket)

      if (indexOfRightMatchingSquareBracket > -1){
        return string.substring(0,indexOfRightMatchingSquareBracket+1)
      }
    }

    return false
  }

  //Returns the or construct portion of a string if found, or the empty string if not found
  //The string must be at the beginning of the string
  headMatchOr(string){
    let matchWithOrKeyword = this.headMatchXWithBrackets(string, 'OR')
    if (matchWithOrKeyword){
      return matchWithOrKeyword
    }

    let matchWithNoBrackets = this.headMatchXWithBrackets(string, '')
    if (matchWithNoBrackets){
      return matchWithNoBrackets
    }
    return ''
  }

  headMatchSequence(string){
    return this.headMatchXWithBrackets(string, 'SEQUENCE')
  }

  headMatchWSAllowBoth(string){
    return this.headMatchXWithBrackets(string, 'WS_ALLOW_BOTH')
  }


  headMatchRuleName(string){
    let ruleNameCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'
    let length = 0
    //A valid rule name consists of letters, numbers and underscores
    for (let i = 0; i < string.length;i++){
      if (Strings.contains_only(string.substring(i,i+1), ruleNameCharacters)){
        length = length + 1
      }
      else{
        break
      }
    }
    return string.substring(0,length)
  }

  headMatchQuotedString(input_string){
    if (input_string.length < 1){
      return ''
    }

    if (input_string.charAt(0) != '\''){
      return ''
    }

    let stringAfterFirstQuote = input_string.substring(1)
    let stringCharacters = Strings.swallow(stringAfterFirstQuote, this.validStringCharacters)
    if (stringCharacters.length < 1){
      return ''
    }
    
    if (stringAfterFirstQuote.length < 1 + stringCharacters.length){
      //not long enough string for there to have a second quote
      return ''
    }

    let secondQuote = stringAfterFirstQuote.charAt(stringCharacters.length)
    if (secondQuote !== '\''){
      return ''
    }
    return input_string.substring(0, 1 + stringCharacters.length + 1)

  }

  //matches a rule(not just a rule name, the entire rulename = pattern)
  headMatchRule(string){
    let location_of_first_equals_sign = string.indexOf('=')
    if (location_of_first_equals_sign < 1){
      return ''
    }

    let left_of_first_equals_sign = string.substring(0, location_of_first_equals_sign)
    let trimmed_left_of_first_equals_sign = left_of_first_equals_sign.trim()

    let rule_name = this.grammarize_RULE_NAME(trimmed_left_of_first_equals_sign)
    if (rule_name == null){
      return ''
    }

    let location_of_first_left_square_bracket = string.indexOf('[')
    if (location_of_first_left_square_bracket >= 0){ //if first left square bracket was found
      let location_of_matching_right_square_bracket = this.get_matching_right_square_bracket(string, location_of_first_left_square_bracket)
      if (location_of_matching_right_square_bracket == -1){
        return ''
      }
  
      let next_rule_string = string.substring(0, location_of_matching_right_square_bracket + 1)
      return next_rule_string
    }else{
      let leadingWhitespace = Strings.swallow(string.substring(location_of_first_equals_sign + 1), Strings.whitespace_characters)
      let ruleName = Strings.swallow(string.substring(location_of_first_equals_sign + 1 + leadingWhitespace.length), this.validRuleNameCharacters)
      if (ruleName.length > 0){
        return string.substring(0, location_of_first_equals_sign + leadingWhitespace.length + ruleName.length + 1)
      }
    }
  }

  headMatchMultiple(string){
    return this.headMatchXWithBrackets(string, 'MULTIPLE')
  }

  //checks if string matches the pattern CHARACTER_CLASS[] and returns the matching string
  headMatchCharacterClass(string){
    return this.headMatchXWithBrackets(string, 'CHARACTER_CLASS')
  }

  //If the string starts with one of the pattern strings for or, sequence, quoted string, ws allow both or rule name,
  //return the string containing up to the first pattern string
  //Returns '' if no valid next pattern string is found
  headMatchPattern(string){
    let patternString = this.headMatchOr(string)
    if (patternString){
      return patternString
    }

    patternString = this.headMatchSequence(string)
    if (patternString){
      return patternString
    }

    patternString = this.headMatchQuotedString(string)
    if (patternString){
      return patternString
    }

    patternString = this.headMatchWSAllowBoth(string)
    if (patternString){
      return patternString
    }

    patternString = this.headMatchRuleName(string)
    if (patternString){
      return patternString
    }

    return ''
  }

  //A pattern list is a set of comma-separated patterns
  //RULE_NAME1,RULE_NAME2, OR[...], SEQUENCE[], WS_ALLOW_BOTH[...], [...]
  //PATTERN
  //PATTERN, PATTERN_LIST
  //There are actually two types of pattern lists: or and sequence.
  //This is because it is necessary to know the context of a pattern list in order to know how to interpret it properly later on

  grammarize_PATTERN_LIST(string){
    let patterns = []
    let tempString = string.trim()
    while(tempString != ''){
      let nextPatternString = this.headMatchPattern(tempString)
      if (nextPatternString == ''){
        return null
      }
      else{
        let singlePattern = this.grammarize_PATTERN(nextPatternString)
        if (singlePattern){
          patterns.push(singlePattern)
        }
        tempString = tempString.substring(nextPatternString.length)
        tempString = tempString.trim()

        //Skip a comma with leading whitespace if necessary
        if (tempString.charAt(0) == ','){
          tempString = tempString.substring(1).trim()
        }
      }
    }

    if (patterns.length > 0){
      return patterns
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

    let patterns = this.grammarize_PATTERN_LIST(string_in_between_square_brackets.trim())
    if (patterns != null){
      let new_node = new Sequence(this,patterns)
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

    var pattern_list = this.grammarize_PATTERN_LIST(string_in_between_two_square_brackets)
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

  grammarize_CHARACTER_CLASS(input_string){
    var trimmed_string = input_string.trim()
 
    var first_few_characters_of_trimmed_string = trimmed_string.substring(0,'CHARACTER_CLASS'.length)
    if (first_few_characters_of_trimmed_string !== 'CHARACTER_CLASS')
    {
      return null
    }

    var location_of_first_left_bracket = trimmed_string.indexOf('[')
    if (location_of_first_left_bracket < 0) return null

    var location_of_last_right_bracket = this.get_matching_right_square_bracket(trimmed_string,location_of_first_left_bracket)
    if (location_of_last_right_bracket < 0) return null
    if (location_of_last_right_bracket != trimmed_string.length - 1) return null
    
    var string_in_between_square_brackets = trimmed_string.substring(location_of_first_left_bracket + 1, location_of_last_right_bracket)

    var quotedString = this.grammarize_QUOTED_STRING(string_in_between_square_brackets)
    if (quotedString != null){
      var new_node = new CharacterClass(this,quotedString)
      return new_node
    }

    return null   
  }

  grammarize_PATTERN(input_string){
    var trimmed_input_string = input_string.trim()
    if (this.headMatchQuotedString(trimmed_input_string)){
      var quoted_string = this.grammarize_QUOTED_STRING(trimmed_input_string)
      if (quoted_string != null){
        return quoted_string
      }  
    }else if (this.headMatchOr(trimmed_input_string)){
      var or_construct = this.grammarize_OR(trimmed_input_string)
      if (or_construct != null){
        return or_construct
      }  
    }else if (this.headMatchSequence(trimmed_input_string)){
      var sequence_construct = this.grammarize_SEQUENCE(trimmed_input_string)
      if (sequence_construct != null){
        return sequence_construct
      }  
    }else if (this.headMatchWSAllowBoth(trimmed_input_string)){
      var ws_allow_both = this.grammarize_WS_ALLOW_BOTH(trimmed_input_string)
      if (ws_allow_both != null){
        return ws_allow_both
      }  
    }else if (this.headMatchMultiple(trimmed_input_string)){
      var multiple = this.grammarize_MULTIPLE(trimmed_input_string)
      if (multiple != null){
        return multiple
      }  
    }else if (this.headMatchCharacterClass(trimmed_input_string)){
      let characterClass = this.grammarize_CHARACTER_CLASS(trimmed_input_string)
      if (characterClass){
        return characterClass
      }
    }
    else if (this.headMatchRuleName(trimmed_input_string)){
      var rule_name = this.grammarize_RULE_NAME(trimmed_input_string)
      if (rule_name != null){
        return rule_name
      }  
    }

    return null
  }


  //RULE = SEQUENCE[\n WS_ALLOW_BOTH[RULE_NAME],\n '=',\n WS_ALLOW_BOTH[PATTERN]\n]
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

  //If inputString is a valid rule list, return a rule list node, and its corresponding children
  //If not valid, return null
  grammarize_RULE_LIST(inputString){
    if (inputString.length < 1) return null

    let rules = []
    let remainingString = inputString
    
    while(remainingString.length > 0){
      let singleRuleString = this.headMatchRule(remainingString)
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
      console.log('Grammar is empty or there was an error in your grammar. Or, there is an error in this parser.')
    }
    return return_node
  }

  //Gets all nodes of type rule that are descendants of the current node
  getRules(grammarNode){
    let rules = []
    if (grammarNode['friendly node type name'] == 'rule'){
      rules.push(grammarNode)
      return rules
    }else if (grammarNode['friendly node type name'] == 'rule list'){
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
