/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Nucleo code for the logic blocks.
 */
'use strict';

goog.provide('Blockly.Nucleo.logic');

goog.require('Blockly.Nucleo');


/**
 * Code generator to create if/if else/else statement.
 * Nucleo code: loop { if (X)/else if ()/else { X } }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Nucleo['controls_if'] = function(block) {
  var n = 0;
  var argument = Blockly.Nucleo.valueToCode(block, 'IF' + n,
      Blockly.Nucleo.ORDER_NONE) || 'false';
  var branch = Blockly.Nucleo.statementToCode(block, 'DO' + n);
  var code = 'if (' + argument + ') {\n' + branch + '}';
  for (n = 1; n <= block.elseifCount_; n++) {
    argument = Blockly.Nucleo.valueToCode(block, 'IF' + n,
        Blockly.Nucleo.ORDER_NONE) || 'false';
    branch = Blockly.Nucleo.statementToCode(block, 'DO' + n);
    code += ' else if (' + argument + ') {\n' + branch + '}';
  }
  if (block.elseCount_) {
    branch = Blockly.Nucleo.statementToCode(block, 'ELSE');
    code += ' else {\n' + branch + '}';
  }
  return code + '\n';
};

/**
 * Code generator for the comparison operator block.
 * Nucleo code: loop { X operator Y }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['logic_compare'] = function(block) {
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Nucleo.ORDER_EQUALITY : Blockly.Nucleo.ORDER_RELATIONAL;
  var argument0 = Blockly.Nucleo.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Nucleo.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

/**
 * Code generator for the logic operator block.
 * Nucleo code: loop { X operator Y }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['logic_operation'] = function(block) {
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.Nucleo.ORDER_LOGICAL_AND :
      Blockly.Nucleo.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Nucleo.valueToCode(block, 'A', order) || 'false';
  var argument1 = Blockly.Nucleo.valueToCode(block, 'B', order) || 'false';
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

/**
 * Code generator for the logic negate operator.
 * Nucleo code: loop { !X }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['logic_negate'] = function(block) {
  var order = Blockly.Nucleo.ORDER_UNARY_PREFIX;
  var argument0 = Blockly.Nucleo.valueToCode(block, 'BOOL', order) || 'false';
  var code = '!' + argument0;
  return [code, order];
};

/**
 * Code generator for the boolean values true and false.
 * Nucleo code: loop { true/false }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['logic_boolean'] = function(block) {
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Nucleo.ORDER_ATOMIC];
};

/**
 * Code generator for the null value.
 * Nucleo code: loop { X ? Y : Z }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['logic_null'] = function(block) {
  var code = 'NULL';
  return [code, Blockly.Nucleo.ORDER_ATOMIC];
};

/**
 * Code generator for the ternary operator.
 * Nucleo code: loop { NULL }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 *
 * TODO: Check types of THEN and ELSE blocks and add warning to this block if
 *       they are different from each other.
 */
Blockly.Nucleo['logic_ternary'] = function(block) {
  var valueIf = Blockly.Nucleo.valueToCode(block, 'IF',
      Blockly.Nucleo.ORDER_CONDITIONAL) || 'false';
  var valueThen = Blockly.Nucleo.valueToCode(block, 'THEN',
      Blockly.Nucleo.ORDER_CONDITIONAL) || 'null';
  var valueElse = Blockly.Nucleo.valueToCode(block, 'ELSE',
      Blockly.Nucleo.ORDER_CONDITIONAL) || 'null';
  var code = valueIf + ' ? ' + valueThen + ' : ' + valueElse;
  return [code, Blockly.Nucleo.ORDER_CONDITIONAL];
};
