/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * Based on work of Fred Lin (gasolin@gmail.com) for Blocklyduino.
 *
 * @fileoverview Helper functions for generating Nucleo language (C++).
 */
'use strict';

goog.provide('Blockly.Nucleo');

goog.require('Blockly.Generator');
goog.require('Blockly.StaticTyping');



/**
 * Nucleo code generator.
 * @type {!Blockly.Generator}
 */
Blockly.Nucleo = new Blockly.Generator('Nucleo');
Blockly.Nucleo.StaticTyping = new Blockly.StaticTyping();

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * Nucleo specific keywords defined in: http://nucleo.cc/en/Reference/HomePage
 * @private
 */
Blockly.Nucleo.addReservedWords(
    'Blockly,' +  // In case JS is evaled in the current window.
    'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,' +
    'define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,integer,' +
    'constants,floating,point,void,boolean,char,unsigned,byte,int,word,long,' +
    'float,double,string,string,array,static,volatile,const,sizeof,pinMode,DigitalOut,' +
    'digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,' +
    'noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,' +
    'min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,' +
    'lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,' +
    'detachInterrupt,interrupts,noInterrupts');

/** Order of operation ENUMs. */
Blockly.Nucleo.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.Nucleo.ORDER_UNARY_POSTFIX = 1;  // expr++ expr-- () [] .
Blockly.Nucleo.ORDER_UNARY_PREFIX = 2;   // -expr !expr ~expr ++expr --expr
Blockly.Nucleo.ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly.Nucleo.ORDER_ADDITIVE = 4;       // + -
Blockly.Nucleo.ORDER_SHIFT = 5;          // << >>
Blockly.Nucleo.ORDER_RELATIONAL = 6;     // >= > <= <
Blockly.Nucleo.ORDER_EQUALITY = 7;       // == != === !==
Blockly.Nucleo.ORDER_BITWISE_AND = 8;    // &
Blockly.Nucleo.ORDER_BITWISE_XOR = 9;    // ^
Blockly.Nucleo.ORDER_BITWISE_OR = 10;    // |
Blockly.Nucleo.ORDER_LOGICAL_AND = 11;   // &&
Blockly.Nucleo.ORDER_LOGICAL_OR = 12;    // ||
Blockly.Nucleo.ORDER_CONDITIONAL = 13;   // expr ? expr : expr
Blockly.Nucleo.ORDER_ASSIGNMENT = 14;    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.Nucleo.ORDER_NONE = 99;          // (...)

/**
 * A list of types tasks that the pins can be assigned. Used to track usage and
 * warn if the same pin has been assigned to more than one task.
 */
Blockly.Nucleo.PinTypes = {
  INPUT: 'INPUT',
  OUTPUT: 'OUTPUT',
  PWM: 'PWM',
  SERVO: 'SERVO',
  STEPPER: 'STEPPER',
  SERIAL: 'SERIAL',
  I2C: 'I2C/TWI',
  SPI: 'SPI'
};

/**
 * Nucleo generator short name for
 * Blockly.Generator.prototype.FUNCTION_NAME_PLACEHOLDER_
 * @type {!string}
 */
Blockly.Nucleo.DEF_FUNC_NAME = Blockly.Nucleo.FUNCTION_NAME_PLACEHOLDER_;

/**
 * Initialises the database of global definitions, the setup function, function
 * names, and variable names.
 * @param {Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Nucleo.init = function(workspace) {
  // Create a dictionary of definitions to be printed at the top of the nuclBlockly
  Blockly.Nucleo.includes_ = Object.create(null);
  // Create a dictionary of global definitions to be printed after variables
  Blockly.Nucleo.definitions_ = Object.create(null);
  // Create a dictionary of variables
  Blockly.Nucleo.variables_ = Object.create(null);
  // Create a dictionary of functions from the code generator
  Blockly.Nucleo.codeFunctions_ = Object.create(null);
  // Create a dictionary of functions created by the user
  Blockly.Nucleo.userFunctions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions)
  Blockly.Nucleo.functionNames_ = Object.create(null);
  // Create a dictionary of setups to be printed in the setup() function
  Blockly.Nucleo.setups_ = Object.create(null);
  // Create a dictionary of pins to check if their use conflicts
  Blockly.Nucleo.pins_ = Object.create(null);

  if (!Blockly.Nucleo.variableDB_) {
    Blockly.Nucleo.variableDB_ =
        new Blockly.Names(Blockly.Nucleo.RESERVED_WORDS_);
  } else {
    Blockly.Nucleo.variableDB_.reset();
  }

  // Iterate through to capture all blocks types and set the function arguments
  var varsWithTypes = Blockly.Nucleo.StaticTyping.collectVarsWithTypes(workspace);
  Blockly.Nucleo.StaticTyping.setProcedureArgs(workspace, varsWithTypes);

  // Set variable declarations with their Nucleo type in the defines dictionary
  for (var varName in varsWithTypes) {
    Blockly.Nucleo.addVariable(varName,
        Blockly.Nucleo.getNucleoType_(varsWithTypes[varName]) +' ' +
        Blockly.Nucleo.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE) + ';');
  }
};

/**
 * Prepare all generated code to be placed in the nuclBlockly specific locations.
 * @param {string} code Generated main program (loop function) code.
 * @return {string} Completed nuclBlockly code.
 */
Blockly.Nucleo.finish = function(code) {
  // Convert the includes, definitions, and functions dictionaries into lists
  var includes = [], definitions = [], variables = [], functions = [];
  for (var name in Blockly.Nucleo.includes_) {
    includes.push(Blockly.Nucleo.includes_[name]);
  }
  if (includes.length) {
    includes.push('\n');
  }
  for (var name in Blockly.Nucleo.variables_) {
    variables.push(Blockly.Nucleo.variables_[name]);
  }
  if (variables.length) {
    variables.push('\n');
  }
  /*
  for (var name in Blockly.Nucleo.definitions_) {
    definitions.push(Blockly.Nucleo.definitions_[name]);
  }
  */
  if (definitions.length) {
    definitions.push('\n');
  }
  for (var name in Blockly.Nucleo.codeFunctions_) {
    functions.push(Blockly.Nucleo.codeFunctions_[name]);
  }
  for (var name in Blockly.Nucleo.userFunctions_) {
    functions.push(Blockly.Nucleo.userFunctions_[name]);
  }
  if (functions.length) {
    functions.push('\n');
  }

  // userSetupCode added at the end of the setup function without leading spaces
  var setups = [''], userSetupCode= '';
  if (Blockly.Nucleo.setups_['userSetupCode'] !== undefined) {
    userSetupCode = '\n' + Blockly.Nucleo.setups_['userSetupCode'];
    delete Blockly.Nucleo.setups_['userSetupCode'];
  }
  for (var name in Blockly.Nucleo.setups_) {
    setups.push(Blockly.Nucleo.setups_[name]);
  }
  if (userSetupCode) {
    setups.push(userSetupCode);
  }

  // Clean up temporary data
  delete Blockly.Nucleo.includes_;
  delete Blockly.Nucleo.definitions_;
  delete Blockly.Nucleo.codeFunctions_;
  delete Blockly.Nucleo.userFunctions_;
  delete Blockly.Nucleo.functionNames_;
  delete Blockly.Nucleo.setups_;
  delete Blockly.Nucleo.pins_;
  Blockly.Nucleo.variableDB_.reset();

  var allDefs = includes.join('\n') + variables.join('\n') +
      definitions.join('\n') + functions.join('\n\n');
	  
  //var setup = '#include "mbed.h" ' + setups.join('\n  ') + '\n\n\n';
  //var setup = setups.join('\n  ') + '\n\n\n';
  var setup = setups.join('\n  ')+ '\n\n';
  
  var loop = 'int main() {\n  ' + code.replace(/\n/g, '\n  ') + '\n}';
  //var loop = code.replace(/\n/g, '\n  ');
  
  return allDefs + setup + loop;
};

/**
 * Adds a string of "include" code to be added to the nuclBlockly.
 * Once a include is added it will not get overwritten with new code.
 * @param {!string} includeTag Identifier for this include code.
 * @param {!string} code Code to be included at the very top of the nuclBlockly.
 */
Blockly.Nucleo.addInclude = function(includeTag, code) {
  if (Blockly.Nucleo.includes_[includeTag] === undefined) {
    Blockly.Nucleo.includes_[includeTag] = code;
  }
};

/**
 * Adds a string of code to be declared globally to the nuclBlockly.
 * Once it is added it will not get overwritten with new code.
 * @param {!string} declarationTag Identifier for this declaration code.
 * @param {!string} code Code to be added below the includes.
 */
Blockly.Nucleo.addDeclaration = function(declarationTag, code) {
  if (Blockly.Nucleo.definitions_[declarationTag] === undefined) {
    Blockly.Nucleo.definitions_[declarationTag] = code;
  }
};

/**
 * Adds a string of code to declare a variable globally to the nuclBlockly.
 * Only if overwrite option is set to true it will overwrite whatever
 * value the identifier held before.
 * @param {!string} varName The name of the variable to declare.
 * @param {!string} code Code to be added for the declaration.
 * @param {boolean=} overwrite Flag to ignore previously set value.
 * @return {!boolean} Indicates if the declaration overwrote a previous one.
 */
Blockly.Nucleo.addVariable = function(varName, code, overwrite) {
  var overwritten = false;
  if (overwrite || (Blockly.Nucleo.variables_[varName] === undefined)) {
    Blockly.Nucleo.variables_[varName] = code;
    overwritten = true;
  }
  return overwritten;
};

/**
 * Adds a string of code into the Nucleo setup() function. It takes an
 * identifier to not repeat the same kind of initialisation code from several
 * blocks. If overwrite option is set to true it will overwrite whatever
 * value the identifier held before.
 * @param {!string} setupTag Identifier for the type of set up code.
 * @param {!string} code Code to be included in the setup() function.
 * @param {boolean=} overwrite Flag to ignore previously set value.
 * @return {!boolean} Indicates if the new setup code overwrote a previous one.
 */
Blockly.Nucleo.addSetup = function(setupTag, code, overwrite) {
  var overwritten = false;
  
  if (overwrite || (Blockly.Nucleo.setups_[setupTag] === undefined)) {
    Blockly.Nucleo.setups_[setupTag] = code;
    overwritten = true;
  } 
  return overwritten;
};

/**
 * Adds a string of code as a function. It takes an identifier (meant to be the
 * function name) to only keep a single copy even if multiple blocks might
 * request this function to be created.
 * A function (and its code) will only be added on first request.
 * @param {!string} preferedName Identifier for the function.
 * @param {!string} code Code to be included in the setup() function.
 * @return {!string} A unique function name based on input name.
 */
Blockly.Nucleo.addFunction = function(preferedName, code) {
  if (Blockly.Nucleo.codeFunctions_[preferedName] === undefined) {
    var uniqueName = Blockly.Nucleo.variableDB_.getDistinctName(
        preferedName, Blockly.Generator.NAME_TYPE);
    Blockly.Nucleo.codeFunctions_[preferedName] =
        code.replace(Blockly.Nucleo.DEF_FUNC_NAME, uniqueName);
    Blockly.Nucleo.functionNames_[preferedName] = uniqueName;
  }
  return Blockly.Nucleo.functionNames_[preferedName];
};

/**
 * Description.
 * @param {!Blockly.Block} block Description.
 * @param {!string} pin Description.
 * @param {!string} pinType Description.
 * @param {!string} warningTag Description.
 */
Blockly.Nucleo.reservePin = function(block, pin, pinType, warningTag) {
  if (Blockly.Nucleo.pins_[pin] !== undefined) {
    if (Blockly.Nucleo.pins_[pin] != pinType) {
      block.setWarningText(Blockly.Msg.ARD_PIN_WARN1.replace('%1', pin)
		.replace('%2', warningTag).replace('%3', pinType)
		.replace('%4', Blockly.Nucleo.pins_[pin]), warningTag);
    } else {
      block.setWarningText(null, warningTag);
    }
  } else {
    Blockly.Nucleo.pins_[pin] = pinType;
    block.setWarningText(null, warningTag);
  }
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything. A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Nucleo.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped Nucleo string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Nucleo string.
 * @private
 */
Blockly.Nucleo.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\$/g, '\\$')
                 .replace(/'/g, '\\\'');
  return '\"' + string + '\"';
};

/**
 * Common tasks for generating Nucleo from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Nucleo code created for this block.
 * @return {string} Nucleo code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
Blockly.Nucleo.scrub_ = function(block, code) {
  if (code === null) { return ''; } // Block has handled code generation itself

  var commentCode = '';
  // Only collect comments for blocks that aren't inline
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += this.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments
    // Don't collect comments for nested statements
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = this.allNestedComments(childBlock);
          if (comment) {
            commentCode += this.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Generates Nucleo Types from a Blockly Type.
 * @param {!Blockly.Type} typeBlockly The Blockly type to be converted.
 * @return {string} Nucleo type for the respective Blockly input type, in a
 *     string format.
 * @private
 */
Blockly.Nucleo.getNucleoType_ = function(typeBlockly) {
  switch (typeBlockly.typeId) {
    case Blockly.Types.SHORT_NUMBER.typeId:
      return 'char';
    case Blockly.Types.NUMBER.typeId:
      return 'int';
    case Blockly.Types.LARGE_NUMBER.typeId:
      return 'long';
    case Blockly.Types.DECIMAL.typeId:
      return 'float';
    case Blockly.Types.TEXT.typeId:
		Blockly.Nucleo.addInclude('', '#include <string>\n using namespace std;\n');
      return 'string';
    case Blockly.Types.CHARACTER.typeId:
      return 'char';
    case Blockly.Types.BOOLEAN.typeId:
      return 'bool';
    case Blockly.Types.NULL.typeId:
      return 'void';
    case Blockly.Types.UNDEF.typeId:
      return 'undefined';
    case Blockly.Types.CHILD_BLOCK_MISSING.typeId:
      // If no block connected default to int, change for easier debugging
      //return 'ChildBlockMissing';
      return 'int';
    default:
      return 'Invalid Blockly Type';
    }
};

/** Used for not-yet-implemented block code generators */
Blockly.Nucleo.noGeneratorCodeInline = function() {
  return ['', Blockly.Nucleo.ORDER_ATOMIC];
};

/** Used for not-yet-implemented block code generators */
Blockly.Nucleo.noGeneratorCodeLine = function() { return ''; };
