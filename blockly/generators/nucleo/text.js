/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Nucleo code generator for the text blocks.
 *     Partially implements the Nucleo Serial interface as described in:
 *     http://nucleo.cc/en/Reference/Serial
 *
 * TODO: Too many calls to String constructor, which consumes a lot of uC
 *     resources. This will need revisiting for better type recognition.
 *
 * TODO: Trim generator is not correct.
 */
'use strict';

goog.provide('Blockly.Nucleo.text');

goog.require('Blockly.Nucleo');


/**
 * Code generator for a literal String (X).
 * Nucleo code: loop { "X" }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['text'] = function(block) {
  var code = Blockly.Nucleo.quote_(block.getFieldValue('TEXT'));
  return [code, Blockly.Nucleo.ORDER_ATOMIC];
};

/**
 * Code generator for a String concatenation (X...Y). This string can be made
 * up of any number of elements of any type.
 * This block uses a mutator.
 * String construction info: http://nucleo.cc/en/Reference/StringConstructor
 * Nucleo code: loop { "String(X)" + ... + "String(Y)" }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['text_join'] = function(block) {
  var code;
  if (block.itemCount_ == 0) {
    return ['""', Blockly.Nucleo.ORDER_ATOMIC];
  } else if (block.itemCount_ == 1) {
    var argument0 = Blockly.Nucleo.valueToCode(block, 'ADD0',
        Blockly.Nucleo.ORDER_UNARY_POSTFIX) || '""';
    code = 'string(' + argument0 + ')';
    return [code, Blockly.Nucleo.ORDER_UNARY_POSTFIX];
  } else {
    var argument;
    code = [];
    for (var n = 0; n < block.itemCount_; n++) {
      argument = Blockly.Nucleo.valueToCode(
          block, 'ADD' + n, Blockly.Nucleo.ORDER_NONE);
      if (argument == '') {
        code[n] = '""';
      } else {
        code[n] = 'string(' + argument + ')';
      }
    }
    code = code.join(' + ');
    return [code, Blockly.Nucleo.ORDER_UNARY_POSTFIX];
  }
};

/**
 * Code generator for appending text (Y) to a variable in place (X).
 * String constructor info: http://nucleo.cc/en/Reference/StringConstructor
 * Nucleo code: loop { X += String(Y) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Nucleo['text_append'] = function(block) {
  // Append to a variable in place.
  var varName = Blockly.Nucleo.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Nucleo.valueToCode(block, 'TEXT',
      Blockly.Nucleo.ORDER_UNARY_POSTFIX);
  if (argument0 == '') {
    argument0 = '""';
  } else {
    argument0 = 'string(' + argument0 + ')';
  }
  return varName + ' += ' + argument0 + ';\n';
};

/**
 * Code generator to get the length of a string (X).
 * String length info: http://nucleo.cc/en/Reference/StringLength
 * Nucleo code: loop { String(X).length() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['text_length'] = function(block) {
  var argument0 = Blockly.Nucleo.valueToCode(block, 'VALUE',
      Blockly.Nucleo.ORDER_UNARY_POSTFIX) || '""';
  var code = 'string(' + argument0 + ').length()';
  return [code, Blockly.Nucleo.ORDER_UNARY_POSTFIX];
};

/**
 * Code generator to test if a string (X) is null/empty.
 * String length info: http://nucleo.cc/en/Reference/StringLength
 * Nucleo code: boolean isStringEmpty(...) { ... }
 *               loop { isStringEmpty(X) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['text_isEmpty'] = function(block) {
  var func = [];
  func.push('boolean ' + Blockly.Nucleo.DEF_FUNC_NAME + '(string msg) {');
  func.push('  if (msg.length() == 0) {');
  func.push('    return true;');
  func.push('  } else {');
  func.push('    return false;');
  func.push('  }');
  func.push('}');
  var funcName = Blockly.Nucleo.addFunction('isStringEmpty', func.join('\n'));
  var argument0 = Blockly.Nucleo.valueToCode(block, 'VALUE',
      Blockly.Nucleo.ORDER_UNARY_POSTFIX);
  if (argument0 == '') {
    argument0 = '""';
  } else {
    argument0 = 'string(' + argument0 + ')';
  }
  var code = funcName + '(' + argument0 + ')';
  return [code, Blockly.Nucleo.ORDER_UNARY_POSTFIX];
};

/**
 * Code generator to trim spaces from a string (X).
 * String trim info: http://nucleo.cc/en/Tutorial/StringLengthTrim
 * Nucleo code: loop { String(X).trim() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['text_trim'] = function(block) {
  // Trim spaces.
  Blockly.Nucleo.text_trim.OPERATORS = {
    LEFT: '.trim()',
    RIGHT: '.trim()',
    BOTH: '.trim()'
  };
  var mode = block.getFieldValue('MODE');
  var operator = Blockly.Nucleo.text_trim.OPERATORS[mode];
  var argument0 = Blockly.Nucleo.valueToCode(block, 'TEXT',
      Blockly.Nucleo.ORDER_UNARY_POSTFIX);
  if (argument0 == '') {
    argument0 = '""';
  } else {
    argument0 = 'string(' + argument0 + ')';
  }
  return [argument0 + operator, Blockly.Nucleo.ORDER_UNARY_POSTFIX];
};

/**
 * Code generator to print to the serial comm.
 * Serial info: http://nucleo.cc/en/Reference/Serial
 * Nucleo code: setup { Serial.begin(9600);     }
 *               loop  { Serial.print(String(X)) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Nucleo['text_print'] = function(block) {
  var serialId = Blockly.Nucleo.Boards.selected.serial[0][1];
  var setupCode = serialId + '.begin(9600);';
  Blockly.Nucleo.addSetup('serial_' + serialId, setupCode, false);
  var argument0 = Blockly.Nucleo.valueToCode(block, 'TEXT',
      Blockly.Nucleo.ORDER_NONE);
  if (argument0 == '') {
    argument0 = '""';
  } else {
    argument0 = 'string(' + argument0 + ')';
  }
  return serialId + '.print(' + argument0 + ');\n';
};

/**
 * Code generator to prompt the user with a string (X) and request input.
 * Serial info: http://nucleo.cc/en/Reference/Serial
 * Nucleo code: getUserInputPrompt(...) { ... }
 *               loop { getUserInputPrompt("X")) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['text_prompt_ext'] = function(block) {
  // Get the first Serial peripheral of nucleo board
  var serialId = Blockly.Nucleo.Boards.selected.serial[0][1];
  var returnType = block.getFieldValue('TYPE');

  // The function code changes based on reading a number or string
  var func = [];
  var toNumber = returnType == Blockly.Types.NUMBER.output;
  if (toNumber) {
    func.push('int ' + Blockly.Nucleo.DEF_FUNC_NAME + '(string msg) {');
  } else {
    func.push('string ' + Blockly.Nucleo.DEF_FUNC_NAME + '(string msg) {');
  }
  func.push('  ' + serialId + '.println(msg);');
  func.push('  boolean stringComplete = false;');
  if (toNumber) {
    func.push('  int content = 0;');// + serialId + '.parseInt();');
  } else {
    func.push('  string content = "";');
  }
  func.push('  while (stringComplete == false) {');
  func.push('    if (' + serialId + '.available()) {');
  if (toNumber) {
    func.push('      content = ' + serialId + '.parseInt();');
    func.push('      stringComplete = true;');
  } else {
    func.push('      char readChar = (char)' + serialId + '.read();');
    func.push('      if (readChar == \'\\n\' || readChar == \'\\r\') {');
    func.push('        stringComplete = true;');
    func.push('      } else {');
    func.push('        content += readChar;');
    func.push('      }');
  }
  func.push('    }');
  func.push('  }');
  func.push('  // Empty incoming serial buffer');
  func.push('  while(Serial.available()) { Serial.read(); };');
  func.push('  return content;');
  func.push('}');
  var funcName = Blockly.Nucleo.addFunction(
      'getUserInputPrompt' + returnType, func.join('\n'));

  // Only overwrite the serial set up if not present already
  var setupCode = serialId + '.begin(9600);';
  Blockly.Nucleo.addSetup('serial_' + serialId, setupCode, false);

  var msg = Blockly.Nucleo.valueToCode(block, 'TEXT',
      Blockly.Nucleo.ORDER_NONE) || '""';
  var code = funcName + '(' + msg + ')';

  return [code, Blockly.Nucleo.ORDER_UNARY_POSTFIX];
};


/* ***************************************************************** *
 * The rest of the blocks have been left unimplemented, as they have *
 * been removed from the toolbox and not used for Nucleo code.      *
 * ***************************************************************** */
Blockly.Nucleo['text_endString'] = function(block) {
  return ['', Blockly.Nucleo.ORDER_UNARY_POSTFIX];
};

Blockly.Nucleo['text_indexOf'] = function(block) {
  return ['', Blockly.Nucleo.ORDER_UNARY_POSTFIX];
};

Blockly.Nucleo['text_charAt'] = function(block) {
  return ['', Blockly.Nucleo.ORDER_UNARY_POSTFIX];
};

Blockly.Nucleo['text_getSubstring'] = function(block) {
  return ['', Blockly.Nucleo.ORDER_UNARY_POSTFIX];
};

Blockly.Nucleo['text_changeCase'] = function(block) {
  return ['', Blockly.Nucleo.ORDER_UNARY_POSTFIX];
};

Blockly.Nucleo['text_prompt'] = function(block) {
  return ['', Blockly.Nucleo.ORDER_UNARY_POSTFIX];
};
