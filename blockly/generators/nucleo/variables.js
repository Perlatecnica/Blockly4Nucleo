/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Nucleo code for variables blocks.
 */
'use strict';

goog.provide('Blockly.Nucleo.variables');

goog.require('Blockly.Nucleo');

var var_Name_appoggio = "";
/**
 * Code generator for variable (X) getter.
 * Nucleo code: loop { X }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['variables_get'] = function(block) {
  var code = Blockly.Nucleo.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.Nucleo.ORDER_ATOMIC];
};

/**
 * Code generator for variable (X) setter (Y).
 * Nucleo code: type X;
 *               loop { X = Y; }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Nucleo['variables_set'] = function(block) {
  var argument0 = Blockly.Nucleo.valueToCode(block, 'VALUE',
      Blockly.Nucleo.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.Nucleo.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
	  var_Name_appoggio = varName ; 
	  
  return varName + ' = ' + argument0 + ';\n';
};

/**
 * Code generator for variable (X) casting (Y).
 * Nucleo code: loop { (Y)X }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['variables_set_type'] = function(block) {
  var argument0 = Blockly.Nucleo.valueToCode(block, 'VARIABLE_SETTYPE_INPUT',
      Blockly.Nucleo.ORDER_ASSIGNMENT) || '0';
  var varType = Blockly.Nucleo.getNucleoType_(
      Blockly.Types[block.getFieldValue('VARIABLE_SETTYPE_TYPE')]);
  var code =   argument0 ;
  return [code, Blockly.Nucleo.ORDER_ATOMIC];
};
